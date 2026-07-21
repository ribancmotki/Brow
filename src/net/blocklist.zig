const std = @import("std");

pub const Blocklist = struct {
    allocator: std.mem.Allocator,
    blocked_patterns: std.ArrayList([]const u8),

    pub fn init(allocator: std.mem.Allocator) Blocklist {
        return .{
            .allocator = allocator,
            .blocked_patterns = std.ArrayList([]const u8).init(allocator),
        };
    }

    pub fn deinit(self: *Blocklist) void {
        self.blocked_patterns.deinit();
    }

    pub fn isBlocked(self: *Blocklist, url_str: []const u8) bool {
        for (self.blocked_patterns.items) |pat| {
            if (std.mem.indexOf(u8, url_str, pat) != null) return true;
        }
        return false;
    }
};
