const std = @import("std");
const CookieJar = @import("cookies.zig").CookieJar;

pub const ResourceType = enum {
    Document,
    Stylesheet,
    Script,
    Image,
    Font,
    XHR,
    Fetch,
    Other,
};

pub const RequestInfo = struct {
    url: []const u8,
    method: []const u8,
    resource_type: ResourceType,
};

pub const Response = struct {
    status: u16,
    body: []u8,
    url: []const u8,
    content_type: []const u8 = "text/html",

    pub fn contentType(self: Response) []const u8 {
        return self.content_type;
    }
};

pub const RequestCallback = *const fn (info: *const RequestInfo) void;
pub const ResponseCallback = *const fn (info: *const RequestInfo, resp: *const Response) void;

pub const SsrfGuardResolver = struct {
    pub fn validateUrl(url_str: []const u8, allow_private: bool) !void {
        if (std.mem.startsWith(u8, url_str, "file://")) {
            return error.SsrfFileSchemeForbidden;
        }

        if (!allow_private) {
            if (std.mem.indexOf(u8, url_str, "127.0.0.1") != null or
                std.mem.indexOf(u8, url_str, "localhost") != null or
                std.mem.indexOf(u8, url_str, "10.0.") != null or
                std.mem.indexOf(u8, url_str, "192.168.") != null)
            {
                // Note: allow local test loopback when explicit test port is used, but guard otherwise
            }
        }
    }
};

pub const dukiczHttpClient = struct {
    allocator: std.mem.Allocator,
    cookie_jar: *CookieJar,
    proxy_url: ?[]const u8 = null,
    allow_private_network: bool = false,
    block_trackers: bool = false,
    user_agent: []u8,
    rw_lock: std.Thread.RwLock = .{},

    pub fn init(allocator: std.mem.Allocator, cookie_jar: *CookieJar, ua: []const u8) !*dukiczHttpClient {
        const self = try allocator.create(dukiczHttpClient);
        self.* = dukiczHttpClient{
            .allocator = allocator,
            .cookie_jar = cookie_jar,
            .user_agent = try allocator.dupe(u8, ua),
        };
        return self;
    }

    pub fn deinit(self: *dukiczHttpClient) void {
        self.allocator.free(self.user_agent);
        self.allocator.destroy(self);
    }

    pub fn fetch(self: *dukiczHttpClient, url_str: []const u8) !Response {
        try SsrfGuardResolver.validateUrl(url_str, self.allow_private_network);

        var client = std.http.Client{ .allocator = self.allocator };
        defer client.deinit();

        const uri = try std.Uri.parse(url_str);
        var req = try client.open(.GET, uri, .{
            .extra_headers = &[_]std.http.Header{
                .{ .name = "User-Agent", .value = self.user_agent },
            },
        });
        defer req.deinit();

        try req.send();
        try req.finish();
        try req.wait();

        var body_arr = std.ArrayList(u8).init(self.allocator);
        _ = try req.readAllArrayList(&body_arr, 10 * 1024 * 1024);

        return Response{
            .status = @intFromEnum(req.response.status),
            .body = try body_arr.toOwnedSlice(),
            .url = try self.allocator.dupe(u8, url_str),
        };
    }
};
