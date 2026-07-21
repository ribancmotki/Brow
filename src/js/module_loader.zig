const std = @import("std");

pub const dukiczModuleLoader = struct {
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) dukiczModuleLoader {
        return .{ .allocator = allocator };
    }

    pub fn resolve(self: dukiczModuleLoader, specifier: []const u8, referrer: []const u8) ![]u8 {
        _ = referrer;
        return try self.allocator.dupe(u8, specifier);
    }
};
