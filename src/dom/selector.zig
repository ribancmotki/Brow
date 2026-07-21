const std = @import("std");
const tree_mod = @import("tree.zig");
const DomTree = tree_mod.DomTree;
const NodeId = tree_mod.NodeId;

pub fn simpleIdSelector(selector: []const u8) ?[]const u8 {
    if (selector.len > 1 and selector[0] == '#') {
        for (selector[1..]) |c| {
            if (c == ' ' or c == '.' or c == '#' or c == ':' or c == '[') return null;
        }
        return selector[1..];
    }
    return null;
}

pub fn querySelector(tree: *DomTree, selector: []const u8) ?NodeId {
    if (simpleIdSelector(selector)) |id_str| {
        if (tree.getElementById(id_str)) |nid| {
            return nid;
        }
    }

    // Fallback DFS scan
    var i: u32 = 0;
    while (i < tree.nodes.items.len) : (i += 1) {
        if (tree.nodes.items[i]) |node| {
            if (node.data == .Element) {
                const el_name = node.data.Element.name.local;
                if (selector[0] != '#' and selector[0] != '.' and selector[0] != ':') {
                    if (std.mem.eql(u8, el_name, selector)) {
                        return NodeId{ .id = i };
                    }
                } else if (selector[0] == '.') {
                    const class_target = selector[1..];
                    for (node.data.Element.attrs) |attr| {
                        if (std.mem.eql(u8, attr.name.local, "class")) {
                            if (std.mem.indexOf(u8, attr.value, class_target) != null) {
                                return NodeId{ .id = i };
                            }
                        }
                    }
                }
            }
        }
    }

    return null;
}

pub fn querySelectorAll(tree: *DomTree, selector: []const u8, allocator: std.mem.Allocator) ![]NodeId {
    var list = std.ArrayList(NodeId).init(allocator);

    var i: u32 = 0;
    while (i < tree.nodes.items.len) : (i += 1) {
        if (tree.nodes.items[i]) |node| {
            if (node.data == .Element) {
                const el_name = node.data.Element.name.local;
                if (selector[0] != '#' and selector[0] != '.' and selector[0] != ':') {
                    if (std.mem.eql(u8, selector, "*") or std.mem.eql(u8, el_name, selector)) {
                        try list.append(NodeId{ .id = i });
                    }
                } else if (selector[0] == '.') {
                    const class_target = selector[1..];
                    for (node.data.Element.attrs) |attr| {
                        if (std.mem.eql(u8, attr.name.local, "class")) {
                            if (std.mem.indexOf(u8, attr.value, class_target) != null) {
                                try list.append(NodeId{ .id = i });
                            }
                        }
                    }
                } else if (selector[0] == '#') {
                    const id_target = selector[1..];
                    for (node.data.Element.attrs) |attr| {
                        if (std.mem.eql(u8, attr.name.local, "id") and std.mem.eql(u8, attr.value, id_target)) {
                            try list.append(NodeId{ .id = i });
                        }
                    }
                }
            }
        }
    }

    return list.toOwnedSlice();
}
