const std = @import("std");

pub const NodeId = struct {
    id: u32,

    pub fn index(self: NodeId) usize {
        return @as(usize, self.id);
    }

    pub fn raw(self: NodeId) u32 {
        return self.id;
    }
};

pub const QualName = struct {
    local: []const u8,
    ns: []const u8 = "",
    prefix: ?[]const u8 = null,
};

pub const Attribute = struct {
    name: QualName,
    value: []const u8,
};

pub const NodeData = union(enum) {
    Document,
    Doctype: struct {
        name: []const u8,
        public_id: []const u8,
        system_id: []const u8,
    },
    Element: struct {
        name: QualName,
        attrs: []Attribute,
        template_contents: ?NodeId = null,
        mathml_annotation_xml_integration_point: bool = false,
    },
    Text: struct {
        contents: std.ArrayList(u8),
    },
    Comment: struct {
        contents: []const u8,
    },
    ProcessingInstruction: struct {
        target: []const u8,
        data: []const u8,
    },
};

pub const Node = struct {
    data: NodeData,
    parent: ?NodeId = null,
    first_child: ?NodeId = null,
    last_child: ?NodeId = null,
    prev_sibling: ?NodeId = null,
    next_sibling: ?NodeId = null,
};

pub const DomTree = struct {
    allocator: std.mem.Allocator,
    nodes: std.ArrayList(?Node),
    free_list: std.ArrayList(u32),
    document: NodeId,
    id_index: std.StringHashMap(NodeId),
    mutex: std.Thread.Mutex,

    pub fn init(allocator: std.mem.Allocator) !*DomTree {
        const self = try allocator.create(DomTree);
        self.* = DomTree{
            .allocator = allocator,
            .nodes = std.ArrayList(?Node).init(allocator),
            .free_list = std.ArrayList(u32).init(allocator),
            .document = NodeId{ .id = 0 },
            .id_index = std.StringHashMap(NodeId).init(allocator),
            .mutex = .{},
        };
        const doc_node = Node{
            .data = NodeData.Document,
        };
        try self.nodes.append(doc_node);
        return self;
    }

    pub fn deinit(self: *DomTree) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        for (self.nodes.items) |maybe_node| {
            if (maybe_node) |node| {
                switch (node.data) {
                    .Text => |t| @constCast(&t.contents).deinit(),
                    else => {},
                }
            }
        }
        self.nodes.deinit();
        self.free_list.deinit();
        self.id_index.deinit();
        self.allocator.destroy(self);
    }

    pub fn newNode(self: *DomTree, data: NodeData) !NodeId {
        self.mutex.lock();
        defer self.mutex.unlock();

        var id: u32 = undefined;
        if (self.free_list.popOrNull()) |free_id| {
            id = free_id;
            self.nodes.items[free_id] = Node{ .data = data };
        } else {
            id = @intCast(self.nodes.items.len);
            try self.nodes.append(Node{ .data = data });
        }

        const nid = NodeId{ .id = id };
        self.registerIdIndexLocked(nid);
        return nid;
    }

    fn registerIdIndexLocked(self: *DomTree, nid: NodeId) void {
        if (self.nodes.items[nid.index()]) |node| {
            if (node.data == .Element) {
                for (node.data.Element.attrs) |attr| {
                    if (std.mem.eql(u8, attr.name.local, "id") and attr.value.len > 0) {
                        self.id_index.put(attr.value, nid) catch {};
                    }
                }
            }
        }
    }

    pub fn appendChild(self: *DomTree, parent: NodeId, child: NodeId) !void {
        self.mutex.lock();
        defer self.mutex.unlock();

        if (parent.id == child.id) return error.SelfAppendNotAllowed;

        // Ancestor cycle check
        var curr = parent;
        while (true) {
            if (curr.id == child.id) return error.AncestorCycleDetected;
            if (self.nodes.items[curr.index()]) |node| {
                if (node.parent) |p| {
                    curr = p;
                } else break;
            } else break;
        }

        self.detachLocked(child);

        var pnode = &(self.nodes.items[parent.index()].?);
        if (pnode.last_child) |last_id| {
            var last_node = &(self.nodes.items[last_id.index()].?);
            last_node.next_sibling = child;
            var child_node = &(self.nodes.items[child.index()].?);
            child_node.prev_sibling = last_id;
            child_node.parent = parent;
            pnode.last_child = child;
        } else {
            pnode.first_child = child;
            pnode.last_child = child;
            var child_node = &(self.nodes.items[child.index()].?);
            child_node.parent = parent;
        }
    }

    pub fn insertBefore(self: *DomTree, parent: NodeId, new_node: NodeId, reference: ?NodeId) !void {
        self.mutex.lock();
        defer self.mutex.unlock();

        if (parent.id == new_node.id) return error.SelfAppendNotAllowed;
        if (reference) |ref| {
            if (ref.id == new_node.id) return; // Inserting before self is a no-op
        }

        // Ancestor check
        var curr = parent;
        while (true) {
            if (curr.id == new_node.id) return error.AncestorCycleDetected;
            if (self.nodes.items[curr.index()]) |node| {
                if (node.parent) |p| {
                    curr = p;
                } else break;
            } else break;
        }

        // CRITICAL BUGFIX: Read prev_sibling AFTER detaching new_node to avoid stale pointer if new_node was reference's prev sibling!
        self.detachLocked(new_node);

        if (reference) |ref| {
            const ref_node = self.nodes.items[ref.index()].?;
            const prev_opt = ref_node.prev_sibling; // read AFTER detach!

            var nnode = &(self.nodes.items[new_node.index()].?);
            nnode.parent = parent;
            nnode.next_sibling = ref;
            nnode.prev_sibling = prev_opt;

            if (prev_opt) |prev_id| {
                var prev_node = &(self.nodes.items[prev_id.index()].?);
                prev_node.next_sibling = new_node;
            } else {
                var pnode = &(self.nodes.items[parent.index()].?);
                pnode.first_child = new_node;
            }

            var ref_node_mut = &(self.nodes.items[ref.index()].?);
            ref_node_mut.prev_sibling = new_node;
        } else {
            // Append at end
            var pnode = &(self.nodes.items[parent.index()].?);
            if (pnode.last_child) |last_id| {
                var last_node = &(self.nodes.items[last_id.index()].?);
                last_node.next_sibling = new_node;
                var nnode = &(self.nodes.items[new_node.index()].?);
                nnode.prev_sibling = last_id;
                nnode.parent = parent;
                pnode.last_child = new_node;
            } else {
                pnode.first_child = new_node;
                pnode.last_child = new_node;
                var nnode = &(self.nodes.items[new_node.index()].?);
                nnode.parent = parent;
            }
        }
    }

    fn detachLocked(self: *DomTree, node_id: NodeId) void {
        var node = &(self.nodes.items[node_id.index()] orelse return);
        const parent_id = node.parent orelse return;

        const prev = node.prev_sibling;
        const next = node.next_sibling;

        if (prev) |pid| {
            if (self.nodes.items[pid.index()]) |*pnode| {
                pnode.next_sibling = next;
            }
        }
        if (next) |nid| {
            if (self.nodes.items[nid.index()]) |*nnode| {
                nnode.prev_sibling = prev;
            }
        }

        if (self.nodes.items[parent_id.index()]) |*pnode| {
            if (pnode.first_child) |fc| {
                if (fc.id == node_id.id) pnode.first_child = next;
            }
            if (pnode.last_child) |lc| {
                if (lc.id == node_id.id) pnode.last_child = prev;
            }
        }

        node.parent = null;
        node.prev_sibling = null;
        node.next_sibling = null;
    }

    pub fn detach(self: *DomTree, node_id: NodeId) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        self.detachLocked(node_id);
    }

    pub fn getElementById(self: *DomTree, id: []const u8) ?NodeId {
        self.mutex.lock();
        defer self.mutex.unlock();
        return self.id_index.get(id);
    }

    pub fn textContent(self: *DomTree, node_id: NodeId) ![]u8 {
        self.mutex.lock();
        defer self.mutex.unlock();

        var result = std.ArrayList(u8).init(self.allocator);
        var stack = std.ArrayList(NodeId).init(self.allocator);
        defer stack.deinit();

        try stack.append(node_id);
        var steps: usize = 0;
        const max_steps = self.nodes.items.len * 2;

        while (stack.popOrNull()) |curr| {
            steps += 1;
            if (steps > max_steps) break;

            if (self.nodes.items[curr.index()]) |node| {
                switch (node.data) {
                    .Text => |t| {
                        try result.appendSlice(t.contents.items);
                    },
                    else => {},
                }
                var child = node.last_child;
                while (child) |cid| {
                    try stack.append(cid);
                    child = if (self.nodes.items[cid.index()]) |cn| cn.prev_sibling else null;
                }
            }
        }

        return result.toOwnedSlice();
    }

    pub fn appendText(self: *DomTree, parent: NodeId, text: []const u8) !void {
        self.mutex.lock();
        defer self.mutex.unlock();

        if (self.nodes.items[parent.index()]) |pnode| {
            if (pnode.last_child) |lc_id| {
                if (self.nodes.items[lc_id.index()]) |*lc_node| {
                    if (lc_node.data == .Text) {
                        try lc_node.data.Text.contents.appendSlice(text);
                        return;
                    }
                }
            }
        }

        var text_arr = std.ArrayList(u8).init(self.allocator);
        try text_arr.appendSlice(text);
        const new_txt_id = try self.newNode(NodeData{ .Text = .{ .contents = text_arr } });
        try self.appendChild(parent, new_txt_id);
    }

    pub fn findBodyOrRoot(self: *DomTree) NodeId {
        self.mutex.lock();
        defer self.mutex.unlock();

        for (self.nodes.items, 0..) |maybe_node, idx| {
            if (maybe_node) |node| {
                if (node.data == .Element) {
                    if (std.mem.eql(u8, node.data.Element.name.local, "body")) {
                        return NodeId{ .id = @intCast(idx) };
                    }
                }
            }
        }
        return self.document;
    }

    pub fn updateIdIndex(self: *DomTree, node_id: NodeId) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        self.registerIdIndexLocked(node_id);
    }
};
