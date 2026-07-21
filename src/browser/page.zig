const std = @import("std");
const DomTree = @import("../dom/tree.zig").DomTree;
const parseHtml = @import("../dom/tree_sink.zig").parseHtml;
const BrowserContext = @import("context.zig").BrowserContext;
const LifecycleState = @import("lifecycle.zig").LifecycleState;
const WaitUntil = @import("lifecycle.zig").WaitUntil;
const ResourceType = @import("../net/client.zig").ResourceType;

pub const NetworkEvent = struct {
    request_id: []const u8,
    url: []const u8,
    method: []const u8,
    resource_type: ResourceType,
    status: u16,
    timestamp: f64,
};

pub const Page = struct {
    allocator: std.mem.Allocator,
    id: []const u8,
    frame_id: []const u8,
    url: []u8,
    dom: ?*DomTree = null,
    lifecycle: LifecycleState = .Idle,
    context: *BrowserContext,
    title: []u8,
    encoding: []u8,
    history: std.ArrayList([]u8),
    history_index: usize = 0,
    network_events: std.ArrayList(NetworkEvent),
    preload_scripts: std.ArrayList([]const u8),

    pub fn init(allocator: std.mem.Allocator, id: []const u8, context: *BrowserContext) !*Page {
        const self = try allocator.create(Page);
        self.* = .{
            .allocator = allocator,
            .id = try allocator.dupe(u8, id),
            .frame_id = try allocator.dupe(u8, "main-frame"),
            .url = try allocator.dupe(u8, "about:blank"),
            .context = context,
            .title = try allocator.dupe(u8, "about:blank"),
            .encoding = try allocator.dupe(u8, "UTF-8"),
            .history = std.ArrayList([]u8).init(allocator),
            .network_events = std.ArrayList(NetworkEvent).init(allocator),
            .preload_scripts = std.ArrayList([]const u8).init(allocator),
        };
        try self.history.append(try allocator.dupe(u8, "about:blank"));
        return self;
    }

    pub fn deinit(self: *Page) void {
        if (self.dom) |d| d.deinit();
        self.allocator.free(self.id);
        self.allocator.free(self.frame_id);
        self.allocator.free(self.url);
        self.allocator.free(self.title);
        self.allocator.free(self.encoding);
        for (self.history.items) |h| self.allocator.free(h);
        self.history.deinit();
        for (self.network_events.items) |ne| {
            self.allocator.free(ne.request_id);
            self.allocator.free(ne.url);
            self.allocator.free(ne.method);
        }
        self.network_events.deinit();
        for (self.preload_scripts.items) |ps| self.allocator.free(ps);
        self.preload_scripts.deinit();
        self.allocator.destroy(self);
    }

    pub fn navigate(self: *Page, target_url: []const u8) !void {
        self.lifecycle = .Loading;

        if (std.mem.eql(u8, target_url, "about:blank")) {
            self.allocator.free(self.url);
            self.url = try self.allocator.dupe(u8, "about:blank");
            self.dom = try DomTree.init(self.allocator);
            self.lifecycle = .Loaded;
            return;
        }

        const resp = try self.context.http_client.fetch(target_url);
        defer self.allocator.free(resp.body);

        if (self.dom) |d| d.deinit();
        self.dom = try parseHtml(self.allocator, resp.body);

        self.allocator.free(self.url);
        self.url = try self.allocator.dupe(u8, target_url);

        self.lifecycle = .Loaded;

        // Record Network Event
        try self.network_events.append(NetworkEvent{
            .request_id = try self.allocator.dupe(u8, "req-1"),
            .url = try self.allocator.dupe(u8, target_url),
            .method = try self.allocator.dupe(u8, "GET"),
            .resource_type = .Document,
            .status = resp.status,
            .timestamp = @floatFromInt(std.time.milliTimestamp()),
        });
    }

    pub fn addPreloadScript(self: *Page, script: []const u8) !void {
        try self.preload_scripts.append(try self.allocator.dupe(u8, script));
    }
};
