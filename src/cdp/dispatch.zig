const std = @import("std");
const types = @import("types.zig");
const CdpRequest = types.CdpRequest;
const CdpResponse = types.CdpResponse;
const CdpEvent = types.CdpEvent;
const BrowserContext = @import("../browser/context.zig").BrowserContext;
const Page = @import("../browser/page.zig").Page;

const browser_domain = @import("domains/browser.zig");
const dom_domain = @import("domains/dom.zig");
const page_domain = @import("domains/page.zig");
const runtime_domain = @import("domains/runtime.zig");
const target_domain = @import("domains/target.zig");

pub const CdpContext = struct {
    allocator: std.mem.Allocator,
    default_context: *BrowserContext,
    pages: std.ArrayList(*Page),

    pub fn init(allocator: std.mem.Allocator, context: *BrowserContext) !*CdpContext {
        const self = try allocator.create(CdpContext);
        self.* = .{
            .allocator = allocator,
            .default_context = context,
            .pages = std.ArrayList(*Page).init(allocator),
        };
        const p1 = try Page.init(allocator, "page-1", context);
        try self.pages.append(p1);
        return self;
    }

    pub fn deinit(self: *CdpContext) void {
        for (self.pages.items) |p| p.deinit();
        self.pages.deinit();
        self.allocator.destroy(self);
    }

    pub fn dispatch(self: *CdpContext, req: CdpRequest) !CdpResponse {
        if (std.mem.eql(u8, req.method, "Browser.getVersion")) {
            const res = try browser_domain.getVersion(self.allocator);
            return CdpResponse.success(req.id, res, req.session_id);
        } else if (std.mem.eql(u8, req.method, "Target.getTargets")) {
            const res = try target_domain.getTargets(self.allocator);
            return CdpResponse.success(req.id, res, req.session_id);
        } else if (std.mem.eql(u8, req.method, "DOM.getDocument")) {
            const res = try dom_domain.getDocument(self.allocator);
            return CdpResponse.success(req.id, res, req.session_id);
        } else if (std.mem.eql(u8, req.method, "Page.navigate")) {
            var url: []const u8 = "about:blank";
            if (req.params) |p| {
                if (p == .object) {
                    if (p.object.get("url")) |u| {
                        if (u == .string) url = u.string;
                    }
                }
            }
            if (self.pages.items.len > 0) {
                try self.pages.items[0].navigate(url);
            }
            const res = try page_domain.navigate(self.allocator, url);
            return CdpResponse.success(req.id, res, req.session_id);
        } else if (std.mem.eql(u8, req.method, "Runtime.evaluate")) {
            const res = try runtime_domain.evaluate(self.allocator, "");
            return CdpResponse.success(req.id, res, req.session_id);
        }

        return CdpResponse.success(req.id, std.json.Value{ .object = std.json.ObjectMap.init(self.allocator) }, req.session_id);
    }
};
