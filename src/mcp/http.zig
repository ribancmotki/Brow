const std = @import("std");

pub fn handleHttpRequest(allocator: std.mem.Allocator, body: []const u8) ![]u8 {
    _ = body;
    var res_map = std.json.ObjectMap.init(allocator);
    try res_map.put("jsonrpc", std.json.Value{ .string = "2.0" });
    try res_map.put("id", std.json.Value{ .integer = 1 });

    var result = std.json.ObjectMap.init(allocator);
    try result.put("status", std.json.Value{ .string = "mcp_ok" });
    try res_map.put("result", std.json.Value{ .object = result });

    var arr = std.ArrayList(u8).init(allocator);
    const val = std.json.Value{ .object = res_map };
    try std.json.stringify(val, .{}, arr.writer());
    return arr.toOwnedSlice();
}
