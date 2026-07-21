const std = @import("std");

pub fn read(allocator: std.mem.Allocator) !std.json.Value {
    var res = std.json.ObjectMap.init(allocator);
    try res.put("data", std.json.Value{ .string = "" });
    try res.put("eof", std.json.Value{ .bool = true });
    return std.json.Value{ .object = res };
}
