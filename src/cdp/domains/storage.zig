const std = @import("std");

pub fn getCookies(allocator: std.mem.Allocator) !std.json.Value {
    var cookies = std.ArrayList(std.json.Value).init(allocator);
    var res = std.json.ObjectMap.init(allocator);
    try res.put("cookies", std.json.Value{ .array = cookies });
    return std.json.Value{ .object = res };
}
