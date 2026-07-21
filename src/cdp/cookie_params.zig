const std = @import("std");

pub const CookieParams = struct {
    name: []const u8,
    value: []const u8,
    domain: []const u8,
    path: []const u8 = "/",
    secure: bool = false,
    httpOnly: bool = false,
    sameSite: ?[]const u8 = null,
    expires: ?i64 = null,
};

pub fn parseCdpCookie(value: std.json.Value) ?CookieParams {
    if (value != .object) return null;
    const obj = value.object;

    const name_val = obj.get("name") orelse return null;
    if (name_val != .string) return null;

    const val_val = obj.get("value") orelse return null;
    if (val_val != .string) return null;

    var domain_str: []const u8 = "";
    if (obj.get("domain")) |d| {
        if (d == .string) domain_str = d.string;
    }
    if (domain_str.len == 0) {
        if (obj.get("url")) |u| {
            if (u == .string) domain_str = u.string;
        }
    }
    if (domain_str.len == 0) return null;

    var path_str: []const u8 = "/";
    if (obj.get("path")) |p| {
        if (p == .string and p.string.len > 0) path_str = p.string;
    }

    return CookieParams{
        .name = name_val.string,
        .value = val_val.string,
        .domain = domain_str,
        .path = path_str,
    };
}
