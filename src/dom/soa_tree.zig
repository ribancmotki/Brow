const std = @import("std");

pub const NodeId = u32;
pub const INVALID_NODE: NodeId = std.math.maxInt(u32);

pub const NodeType = enum(u8) {
    Document = 0,
    Element = 1,
    Text = 2,
    Comment = 3,
};

/// Structure of Arrays (SoA) DOM Tree Implementation
pub const SoaDomTree = struct {
    allocator: std.mem.Allocator,

    // Parallel arrays for cache-line optimization
    types: std.ArrayListUnmanaged(NodeType) = .{},
    parents: std.ArrayListUnmanaged(NodeId) = .{},
    first_children: std.ArrayListUnmanaged(NodeId) = .{},
    next_siblings: std.ArrayListUnmanaged(NodeId) = .{},

    // Contiguous string pool and slice indices
    tag_offsets: std.ArrayListUnmanaged(u32) = .{},
    tag_lengths: std.ArrayListUnmanaged(u32) = .{},
    string_pool: std.ArrayListUnmanaged(u8) = .{},

    pub fn init(allocator: std.mem.Allocator, capacity: usize) !SoaDomTree {
        var tree = SoaDomTree{ .allocator = allocator };

        try tree.types.ensureTotalCapacity(allocator, capacity);
        try tree.parents.ensureTotalCapacity(allocator, capacity);
        try tree.first_children.ensureTotalCapacity(allocator, capacity);
        try tree.next_siblings.ensureTotalCapacity(allocator, capacity);
        try tree.tag_offsets.ensureTotalCapacity(allocator, capacity);
        try tree.tag_lengths.ensureTotalCapacity(allocator, capacity);

        // Initialize root document node at index 0
        _ = try tree.createNode(.Document, "root");
        return tree;
    }

    pub fn deinit(self: *SoaDomTree) void {
        self.types.deinit(self.allocator);
        self.parents.deinit(self.allocator);
        self.first_children.deinit(self.allocator);
        self.next_siblings.deinit(self.allocator);
        self.tag_offsets.deinit(self.allocator);
        self.tag_lengths.deinit(self.allocator);
        self.string_pool.deinit(self.allocator);
    }

    pub fn createNode(self: *SoaDomTree, node_type: NodeType, name: []const u8) !NodeId {
        const id: NodeId = @intCast(self.types.items.len);
        const offset: u32 = @intCast(self.string_pool.items.len);

        try self.string_pool.appendSlice(self.allocator, name);
        try self.types.append(self.allocator, node_type);
        try self.parents.append(self.allocator, INVALID_NODE);
        try self.first_children.append(self.allocator, INVALID_NODE);
        try self.next_siblings.append(self.allocator, INVALID_NODE);
        try self.tag_offsets.append(self.allocator, offset);
        try self.tag_lengths.append(self.allocator, @intCast(name.len));

        return id;
    }

    pub fn appendChild(self: *SoaDomTree, parent: NodeId, child: NodeId) void {
        self.parents.items[child] = parent;

        var current = self.first_children.items[parent];
        if (current == INVALID_NODE) {
            self.first_children.items[parent] = child;
            return;
        }

        while (self.next_siblings.items[current] != INVALID_NODE) {
            current = self.next_siblings.items[current];
        }
        self.next_siblings.items[current] = child;
    }

    pub fn findElementsByTag(self: *const SoaDomTree, tag_name: []const u8, results: *std.ArrayList(NodeId)) !void {
        const len = self.types.items.len;
        var i: usize = 0;
        while (i < len) : (i += 1) {
            if (self.types.items[i] == .Element) {
                const offset = self.tag_offsets.items[i];
                const length = self.tag_lengths.items[i];
                const name = self.string_pool.items[offset .. offset + length];

                if (std.mem.eql(u8, name, tag_name)) {
                    try results.append(i);
                }
            }
        }
    }
};
