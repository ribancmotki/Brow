const std = @import("std");
const BrowserContext = @import("../browser/context.zig").BrowserContext;
const BrowserConfig = @import("config.zig").BrowserConfig;
const CookieStore = @import("cookie.zig").CookieStore;
const Page = @import("page.zig").Page;

pub const Browser = struct {
    allocator: std.mem.Allocator,
    context: *BrowserContext,
    next_page_id: std.atomic.Value(u64),

    pub fn new(allocator: std.mem.Allocator) !*Browser {
        return build(allocator, .{});
    }

    pub fn build(allocator: std.mem.Allocator, cfg: BrowserConfig) !*Browser {
        const ctx = try BrowserContext.withStorageFull(allocator, "ctx-main", cfg.proxy, cfg.stealth, cfg.user_agent, cfg.storage_dir);
        const self = try allocator.create(Browser);
        self.* = .{
            .allocator = allocator,
            .context = ctx,
            .next_page_id = std.atomic.Value(u64).init(1),
        };
        return self;
    }

    pub fn deinit(self: *Browser) void {
        self.context.deinit();
        self.allocator.destroy(self);
    }

    pub fn newPage(self: *Browser) !*Page {
        const id = self.next_page_id.fetchAdd(1, .monotonic);
        var buf: [32]u8 = undefined;
        const page_id = try std.fmt.bufPrint(&buf, "page-{d}", .{id});
        return Page.init(self.allocator, page_id, self.context);
    }

    pub fn cookies(self: *Browser) CookieStore {
        return CookieStore{ .jar = self.context.cookie_jar };
    }
};
