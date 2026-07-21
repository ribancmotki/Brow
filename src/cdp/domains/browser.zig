const std = @import("std");

pub fn getVersion(allocator: std.mem.Allocator) !std.json.Value {
    var res = std.json.ObjectMap.init(allocator);
    try res.put("protocolVersion", std.json.Value{ .string = "1.3" });
    try res.put("product", std.json.Value{ .string = "Chrome/145.0.0.0" });
    try res.put("revision", std.json.Value{ .string = "dukicz" });
    try res.put("userAgent", std.json.Value{ .string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" });
    try res.put("jsVersion", std.json.Value{ .string = "V8/12.x" });
    return std.json.Value{ .object = res };
}
