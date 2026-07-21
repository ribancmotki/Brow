const std = @import("std");

pub const CookieEntry = struct {
    name: []u8,
    value: []u8,
    domain: []u8,
    path: []u8,
    secure: bool = false,
    http_only: bool = false,
    same_site: ?[]u8 = null,
    expires: ?i64 = null, // -1 = session
};

pub const CookieJar = struct {
    allocator: std.mem.Allocator,
    cookies: std.ArrayList(CookieEntry),
    mutex: std.Thread.Mutex,

    pub fn init(allocator: std.mem.Allocator) !*CookieJar {
        const self = try allocator.create(CookieJar);
        self.* = CookieJar{
            .allocator = allocator,
            .cookies = std.ArrayList(CookieEntry).init(allocator),
            .mutex = .{},
        };
        return self;
    }

    pub fn deinit(self: *CookieJar) void {
        self.mutex.lock();
        defer self.mutex.unlock();

        for (self.cookies.items) |c| {
            self.allocator.free(c.name);
            self.allocator.free(c.value);
            self.allocator.free(c.domain);
            self.allocator.free(c.path);
            if (c.same_site) |ss| self.allocator.free(ss);
        }
        self.cookies.deinit();
        self.allocator.destroy(self);
    }

    pub fn setCookie(self: *CookieJar, set_cookie_str: []const u8, url_host: []const u8) !void {
        self.mutex.lock();
        defer self.mutex.unlock();

        var parts = std.mem.splitScalar(u8, set_cookie_str, ';');
        const first_part = parts.next() orelse return;

        const eq_idx = std.mem.indexOfScalar(u8, first_part, '=') orelse return;
        const name = std.mem.trim(u8, first_part[0..eq_idx], " ");
        const value = std.mem.trim(u8, first_part[eq_idx + 1 ..], " ");

        var domain = try self.allocator.dupe(u8, url_host);
        var path = try self.allocator.dupe(u8, "/");
        var secure = false;
        var http_only = false;
        var same_site: ?[]u8 = null;

        while (parts.next()) |part| {
            const attr = std.mem.trim(u8, part, " ");
            if (std.ascii.startsWithIgnoreCase(attr, "Domain=")) {
                self.allocator.free(domain);
                var dom_val = attr[7..];
                if (dom_val.len > 0 and dom_val[0] == '.') dom_val = dom_val[1..];
                domain = try self.allocator.dupe(u8, dom_val);
            } else if (std.ascii.startsWithIgnoreCase(attr, "Path=")) {
                self.allocator.free(path);
                path = try self.allocator.dupe(u8, attr[5..]);
            } else if (std.ascii.eqlIgnoreCase(attr, "Secure")) {
                secure = true;
            } else if (std.ascii.eqlIgnoreCase(attr, "HttpOnly")) {
                http_only = true;
            } else if (std.ascii.startsWithIgnoreCase(attr, "SameSite=")) {
                same_site = try self.allocator.dupe(u8, attr[9..]);
            }
        }

        // Replace existing cookie if same name and domain
        for (self.cookies.items) |*existing| {
            if (std.mem.eql(u8, existing.name, name) and std.mem.eql(u8, existing.domain, domain)) {
                self.allocator.free(existing.value);
                existing.value = try self.allocator.dupe(u8, value);
                existing.secure = secure;
                existing.http_only = http_only;
                if (existing.same_site) |ss| self.allocator.free(ss);
                existing.same_site = same_site;
                self.allocator.free(domain);
                self.allocator.free(path);
                return;
            }
        }

        try self.cookies.append(CookieEntry{
            .name = try self.allocator.dupe(u8, name),
            .value = try self.allocator.dupe(u8, value),
            .domain = domain,
            .path = path,
            .secure = secure,
            .http_only = http_only,
            .same_site = same_site,
        });
    }

    pub fn getCookieHeader(self: *CookieJar, url_host: []const u8, allocator: std.mem.Allocator) ![]u8 {
        self.mutex.lock();
        defer self.mutex.unlock();

        var header_buf = std.ArrayList(u8).init(allocator);

        var first = true;
        for (self.cookies.items) |c| {
            if (std.mem.endsWith(u8, url_host, c.domain) or std.mem.eql(u8, url_host, c.domain)) {
                if (!first) {
                    try header_buf.appendSlice("; ");
                }
                try header_buf.writer().print("{s}={s}", .{ c.name, c.value });
                first = false;
            }
        }

        return header_buf.toOwnedSlice();
    }

    pub fn saveToFile(self: *CookieJar, path: []const u8) !void {
        self.mutex.lock();
        defer self.mutex.unlock();

        const file = try std.fs.cwd().createFile(path, .{});
        defer file.close();

        try file.writeAll("[\n");
        for (self.cookies.items, 0..) |c, idx| {
            try file.writer().print("  {{\"name\": \"{s}\", \"value\": \"{s}\", \"domain\": \"{s}\", \"path\": \"{s}\", \"secure\": {s}, \"http_only\": {s}}}{s}\n", .{
                c.name,
                c.value,
                c.domain,
                c.path,
                if (c.secure) "true" else "false",
                if (c.http_only) "true" else "false",
                if (idx + 1 < self.cookies.items.len) "," else "",
            });
        }
        try file.writeAll("]\n");
    }

    pub fn loadFromFile(self: *CookieJar, path: []const u8) !usize {
        _ = self;
        const file = std.fs.cwd().openFile(path, .{}) catch return 0;
        defer file.close();
        return 1;
    }
};
