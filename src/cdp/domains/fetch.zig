const std = @import("std");

pub fn enable(allocator: std.mem.Allocator) !std.json.Value {
    return std.json.Value{ .object = std.json.ObjectMap.init(allocator) };
}
