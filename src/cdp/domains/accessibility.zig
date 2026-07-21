const std = @import("std");

pub fn getFullAXTree(allocator: std.mem.Allocator) !std.json.Value {
    var nodes = std.ArrayList(std.json.Value).init(allocator);

    var node1 = std.json.ObjectMap.init(allocator);
    try node1.put("nodeId", std.json.Value{ .string = "1" });
    try node1.put("role", std.json.Value{ .string = "WebArea" });
    try node1.put("name", std.json.Value{ .string = "Document" });

    try nodes.append(std.json.Value{ .object = node1 });

    var res = std.json.ObjectMap.init(allocator);
    try res.put("nodes", std.json.Value{ .array = nodes });
    return std.json.Value{ .object = res };
}
