const std = @import("std");

pub fn navigate(allocator: std.mem.Allocator, url: []const u8) !std.json.Value {
    var res = std.json.ObjectMap.init(allocator);
    try res.put("frameId", std.json.Value{ .string = "main-frame" });
    try res.put("loaderId", std.json.Value{ .string = "loader-1" });
    _ = url;
    return std.json.Value{ .object = res };
}
