const std = @import("std");

pub const InterceptorChain = struct {
    allocator: std.mem.Allocator,
    patterns: std.ArrayList([]const u8),

    pub fn init(allocator: std.mem.Allocator) InterceptorChain {
        return .{
            .allocator = allocator,
            .patterns = std.ArrayList([]const u8).init(allocator),
        };
    }

    pub fn deinit(self: *InterceptorChain) void {
        self.patterns.deinit();
    }

    pub fn matches(self: *InterceptorChain, url_str: []const u8) bool {
        for (self.patterns.items) |pattern| {
            if (std.mem.eql(u8, pattern, "*")) return true;
            if (std.mem.indexOf(u8, url_str, pattern) != null) return true;
        }
        return false;
    }
};
