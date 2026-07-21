const std = @import("std");
const CookieJar = @import("../net/cookies.zig").CookieJar;

pub const Cookie = struct {
    name: []const u8,
    value: []const u8,
    domain: []const u8,
    path: []const u8 = "/",
    secure: bool = false,
    http_only: bool = false,

    pub fn new(name: []const u8, value: []const u8, domain: []const u8) Cookie {
        return .{
            .name = name,
            .value = value,
            .domain = domain,
        };
    }
};

pub const CookieStore = struct {
    jar: *CookieJar,

    pub fn set(self: CookieStore, set_cookie_str: []const u8, url_host: []const u8) !void {
        try self.jar.setCookie(set_cookie_str, url_host);
    }
};
