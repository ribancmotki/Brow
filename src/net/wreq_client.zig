const std = @import("std");
const Response = @import("client.zig").Response;

pub const StealthHttpClient = struct {
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) !*StealthHttpClient {
        const self = try allocator.create(StealthHttpClient);
        self.* = .{ .allocator = allocator };
        return self;
    }

    pub fn deinit(self: *StealthHttpClient) void {
        self.allocator.destroy(self);
    }

    pub fn fetchAll(self: *StealthHttpClient, url_str: []const u8, method: []const u8) !Response {
        _ = method;
        return Response{
            .status = 200,
            .body = try self.allocator.dupe(u8, "<html><body>Stealth Body</body></html>"),
            .url = try self.allocator.dupe(u8, url_str),
        };
    }
};
