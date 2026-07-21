const std = @import("std");
const CookieJar = @import("../net/cookies.zig").CookieJar;
const dukiczHttpClient = @import("../net/client.zig").dukiczHttpClient;
const RobotsCache = @import("../net/robots.zig").RobotsCache;
const profiles = @import("profiles.zig");

pub const BrowserContext = struct {
    allocator: std.mem.Allocator,
    id: []const u8,
    cookie_jar: *CookieJar,
    http_client: *dukiczHttpClient,
    user_agent: []const u8,
    platform: []const u8,
    ua_platform: []const u8,
    ua_platform_version: []const u8,
    proxy_url: ?[]const u8 = null,
    robots_cache: *RobotsCache,
    obey_robots: bool = false,
    stealth: bool = false,
    allow_file_access: bool = false,
    storage_dir: ?[]const u8 = null,
    allow_private_network: bool = false,

    pub fn new(allocator: std.mem.Allocator, id: []const u8) !*BrowserContext {
        return withStorageAndNetwork(allocator, id, null, false, null, null, false);
    }

    pub fn withStorage(allocator: std.mem.Allocator, id: []const u8, storage_dir: ?[]const u8) !*BrowserContext {
        return withStorageAndNetwork(allocator, id, null, false, null, storage_dir, false);
    }

    pub fn withStorageFull(allocator: std.mem.Allocator, id: []const u8, proxy_url: ?[]const u8, stealth: bool, user_agent: ?[]const u8, storage_dir: ?[]const u8) !*BrowserContext {
        return withStorageAndNetwork(allocator, id, proxy_url, stealth, user_agent, storage_dir, false);
    }

    pub fn withStorageAndNetwork(
        allocator: std.mem.Allocator,
        id: []const u8,
        proxy_url: ?[]const u8,
        stealth: bool,
        user_agent: ?[]const u8,
        storage_dir: ?[]const u8,
        allow_private_network: bool,
    ) !*BrowserContext {
        const profile = profiles.selectProfile();
        const final_ua = user_agent orelse profile.user_agent;

        const jar = try CookieJar.init(allocator);
        if (storage_dir) |dir| {
            var path_buf: [1024]u8 = undefined;
            const cookie_path = try std.fmt.bufPrint(&path_buf, "{s}/cookies.json", .{dir});
            _ = jar.loadFromFile(cookie_path) catch 0;
        }

        const client = try dukiczHttpClient.init(allocator, jar, final_ua);
        client.proxy_url = proxy_url;
        client.allow_private_network = allow_private_network;
        client.block_trackers = stealth;

        const robots = try RobotsCache.init(allocator);

        const self = try allocator.create(BrowserContext);
        self.* = .{
            .allocator = allocator,
            .id = try allocator.dupe(u8, id),
            .cookie_jar = jar,
            .http_client = client,
            .user_agent = try allocator.dupe(u8, final_ua),
            .platform = profile.platform,
            .ua_platform = profile.ua_platform,
            .ua_platform_version = profile.ua_platform_version,
            .proxy_url = if (proxy_url) |p| try allocator.dupe(u8, p) else null,
            .robots_cache = robots,
            .stealth = stealth,
            .storage_dir = if (storage_dir) |s| try allocator.dupe(u8, s) else null,
            .allow_private_network = allow_private_network,
        };

        return self;
    }

    pub fn deinit(self: *BrowserContext) void {
        self.saveCookies();
        self.cookie_jar.deinit();
        self.http_client.deinit();
        self.robots_cache.deinit();
        self.allocator.free(self.id);
        self.allocator.free(self.user_agent);
        if (self.proxy_url) |p| self.allocator.free(p);
        if (self.storage_dir) |s| self.allocator.free(s);
        self.allocator.destroy(self);
    }

    pub fn saveCookies(self: *BrowserContext) void {
        if (self.storage_dir) |dir| {
            var path_buf: [1024]u8 = undefined;
            if (std.fmt.bufPrint(&path_buf, "{s}/cookies.json", .{dir})) |cookie_path| {
                self.cookie_jar.saveToFile(cookie_path) catch {};
            } else |_| {}
        }
    }
};
