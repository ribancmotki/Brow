const std = @import("std");
const dukiczHttpClient = @import("client.zig").dukiczHttpClient;

pub const RobotsCache = struct {
    allocator: std.mem.Allocator,
    mutex: std.Thread.Mutex = .{},
    disallowed_paths: std.ArrayList([]const u8),

    pub fn init(allocator: std.mem.Allocator) !*RobotsCache {
        const self = try allocator.create(RobotsCache);
        self.* = .{
            .allocator = allocator,
            .disallowed_paths = std.ArrayList([]const u8).init(allocator),
        };
        return self;
    }

    pub fn deinit(self: *RobotsCache) void {
        self.disallowed_paths.deinit();
        self.allocator.destroy(self);
    }

    pub fn isAllowed(self: *RobotsCache, http_client: *dukiczHttpClient, url_str: []const u8, user_agent: []const u8) !bool {
        _ = http_client;
        _ = user_agent;
        self.mutex.lock();
        defer self.mutex.unlock();
        for (self.disallowed_paths.items) |dis| {
            if (std.mem.indexOf(u8, url_str, dis) != null) return false;
        }
        return true;
    }
};
