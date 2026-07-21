const std = @import("std");

pub fn getDocument(allocator: std.mem.Allocator) !std.json.Value {
    var root = std.json.ObjectMap.init(allocator);
    try root.put("nodeId", std.json.Value{ .integer = 1 });
    try root.put("backendNodeId", std.json.Value{ .integer = 1 });
    try root.put("nodeType", std.json.Value{ .integer = 9 });
    try root.put("nodeName", std.json.Value{ .string = "#document" });
    try root.put("documentURL", std.json.Value{ .string = "about:blank" });

    var res = std.json.ObjectMap.init(allocator);
    try res.put("root", std.json.Value{ .object = root });
    return std.json.Value{ .object = res };
}
