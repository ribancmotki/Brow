const std = @import("std");

pub fn urlIsFileScheme(raw: []const u8) bool {
    const trimmed = std.mem.trimLeft(u8, raw, " \t\r\n");
    if (trimmed.len >= 5) {
        return std.ascii.eqlIgnoreCase(trimmed[0..5], "file:");
    }
    return false;
}
