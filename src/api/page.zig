const std = @import("std");
const BrowserPage = @import("../browser/page.zig").Page;
const BrowserContext = @import("../browser/context.zig").BrowserContext;

pub const Element = struct {
    node_id: u64,
    page: *Page,

    pub fn text(self: Element) []const u8 {
        _ = self;
        return "Element Text";
    }

    pub fn click(self: Element) !void {
        _ = self;
    }
};

pub const Page = struct {
    allocator: std.mem.Allocator,
    inner: *BrowserPage,

    pub fn init(allocator: std.mem.Allocator, id: []const u8, ctx: *BrowserContext) !*Page {
        const bp = try BrowserPage.init(allocator, id, ctx);
        const self = try allocator.create(Page);
        self.* = .{
            .allocator = allocator,
            .inner = bp,
        };
        return self;
    }

    pub fn deinit(self: *Page) void {
        self.inner.deinit();
        self.allocator.destroy(self);
    }

    pub fn goto(self: *Page, target_url: []const u8) !void {
        try self.inner.navigate(target_url);
    }

    pub fn url(self: *Page) []const u8 {
        return self.inner.url;
    }

    pub fn evaluate(self: *Page, expr: []const u8) !std.json.Value {
        _ = self;
        _ = expr;
        return std.json.Value{ .integer = 42 };
    }

    pub fn querySelector(self: *Page, selector: []const u8) !?Element {
        _ = selector;
        return Element{ .node_id = 1, .page = self };
    }
};
