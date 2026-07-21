const std = @import("std");

pub fn getTargets(allocator: std.mem.Allocator) !std.json.Value {
    var targetInfos = std.ArrayList(std.json.Value).init(allocator);

    var info1 = std.json.ObjectMap.init(allocator);
    try info1.put("targetId", std.json.Value{ .string = "page-1" });
    try info1.put("type", std.json.Value{ .string = "page" });
    try info1.put("title", std.json.Value{ .string = "Main Page" });
    try info1.put("url", std.json.Value{ .string = "about:blank" });
    try info1.put("attached", std.json.Value{ .bool = true });
    try info1.put("canAccessOpener", std.json.Value{ .bool = false });

    try targetInfos.append(std.json.Value{ .object = info1 });

    var res = std.json.ObjectMap.init(allocator);
    try res.put("targetInfos", std.json.Value{ .array = targetInfos });
    return std.json.Value{ .object = res };
}
