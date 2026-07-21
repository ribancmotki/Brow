const std = @import("std");

pub const BrowserProfile = struct {
    user_agent: []const u8,
    platform: []const u8,
    ua_platform: []const u8,
    ua_platform_version: []const u8,
};

pub const PROFILES = [8]BrowserProfile{
    .{
        .user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        .platform = "Win32",
        .ua_platform = "Windows",
        .ua_platform_version = "10.0.0",
    },
    .{
        .user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
        .platform = "Win32",
        .ua_platform = "Windows",
        .ua_platform_version = "10.0.0",
    },
    .{
        .user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
        .platform = "Win32",
        .ua_platform = "Windows",
        .ua_platform_version = "10.0.0",
    },
    .{
        .user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
        .platform = "Win32",
        .ua_platform = "Windows",
        .ua_platform_version = "10.0.0",
    },
    .{
        .user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        .platform = "MacIntel",
        .ua_platform = "macOS",
        .ua_platform_version = "14.0.0",
    },
    .{
        .user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
        .platform = "MacIntel",
        .ua_platform = "macOS",
        .ua_platform_version = "14.0.0",
    },
    .{
        .user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
        .platform = "MacIntel",
        .ua_platform = "macOS",
        .ua_platform_version = "14.0.0",
    },
    .{
        .user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
        .platform = "MacIntel",
        .ua_platform = "macOS",
        .ua_platform_version = "14.0.0",
    },
};

pub fn randomProfile() *const BrowserProfile {
    const ts = @as(usize, @intCast(std.time.nanoTimestamp()));
    return &PROFILES[ts % PROFILES.len];
}

pub fn selectProfile() *const BrowserProfile {
    if (std.process.getEnvVarOwned(std.heap.page_allocator, "dukicz_PROFILE")) |p_str| {
        defer std.heap.page_allocator.free(p_str);
        if (std.fmt.parseInt(usize, p_str, 10)) |idx| {
            if (idx < PROFILES.len) return &PROFILES[idx];
        } else |_| {}
    } else |_| {}

    if (std.process.getEnvVarOwned(std.heap.page_allocator, "dukicz_ROTATE_PROFILE")) |r_str| {
        defer std.heap.page_allocator.free(r_str);
        if (std.mem.eql(u8, r_str, "1")) return randomProfile();
    } else |_| {}

    return &PROFILES[0];
}

pub fn envEnabled(name: []const u8) bool {
    if (std.process.getEnvVarOwned(std.heap.page_allocator, name)) |val| {
        defer std.heap.page_allocator.free(val);
        return std.ascii.eqlIgnoreCase(val, "1") or std.ascii.eqlIgnoreCase(val, "true") or
            std.ascii.eqlIgnoreCase(val, "yes") or std.ascii.eqlIgnoreCase(val, "on");
    } else |_| {
        return false;
    }
}
