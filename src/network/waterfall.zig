const std = @import("std");

pub const HTTPHeader = struct {
    name: []const u8,
    value: []const u8,
};

pub const InterceptedRequest = struct {
    id: []const u8,
    url: []const u8,
    method: []const u8,
    status_code: u16,
    content_type: []const u8,
    duration_ms: u32,
    headers: std.ArrayList(HTTPHeader),

    pub fn init(allocator: std.mem.Allocator, id: []const u8, url: []const u8, method: []const u8) InterceptedRequest {
        return InterceptedRequest{
            .id = id,
            .url = url,
            .method = method,
            .status_code = 200,
            .content_type = "text/html; charset=utf-8",
            .duration_ms = 120,
            .headers = std.ArrayList(HTTPHeader).init(allocator),
        };
    }

    pub fn addHeader(self: *InterceptedRequest, name: []const u8, value: []const u8) !void {
        try self.headers.append(HTTPHeader{ .name = name, .value = value });
    }

    pub fn deinit(self: *InterceptedRequest) void {
        self.headers.deinit();
    }
};
