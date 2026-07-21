const std = @import("std");

pub fn dispatchMouseEvent(allocator: std.mem.Allocator) !std.json.Value {
    return std.json.Value{ .object = std.json.ObjectMap.init(allocator) };
}

pub fn dispatchKeyEvent(allocator: std.mem.Allocator) !std.json.Value {
    return std.json.Value{ .object = std.json.ObjectMap.init(allocator) };
}
