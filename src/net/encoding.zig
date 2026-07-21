const std = @import("std");

pub fn decodeNonHtml(allocator: std.mem.Allocator, body: []const u8, content_type: ?[]const u8) ![]u8 {
    _ = content_type;
    return allocator.dupe(u8, body);
}
