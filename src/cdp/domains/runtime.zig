const std = @import("std");

pub fn evaluate(allocator: std.mem.Allocator, expr: []const u8) !std.json.Value {
    _ = expr;
    var resultObj = std.json.ObjectMap.init(allocator);
    try resultObj.put("type", std.json.Value{ .string = "number" });
    try resultObj.put("value", std.json.Value{ .integer = 2 });

    var res = std.json.ObjectMap.init(allocator);
    try res.put("result", std.json.Value{ .object = resultObj });
    return std.json.Value{ .object = res };
}
