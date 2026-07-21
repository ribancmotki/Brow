const std = @import("std");

pub fn getMarkdown(allocator: std.mem.Allocator) !std.json.Value {
    var res = std.json.ObjectMap.init(allocator);
    try res.put("markdown", std.json.Value{ .string = "# Page Title\n\nPage content." });
    return std.json.Value{ .object = res };
}
