const std = @import("std");

pub fn captureSnapshot(allocator: std.mem.Allocator) !std.json.Value {
    var strings = std.ArrayList(std.json.Value).init(allocator);
    try strings.append(std.json.Value{ .string = "HTML" });
    try strings.append(std.json.Value{ .string = "BODY" });

    var res = std.json.ObjectMap.init(allocator);
    try res.put("strings", std.json.Value{ .array = strings });
    return std.json.Value{ .object = res };
}
