const std = @import("std");
const BrowserContext = @import("../browser/context.zig").BrowserContext;
const CdpContext = @import("dispatch.zig").CdpContext;

pub fn start(allocator: std.mem.Allocator, port: u16, host: []const u8, context: *BrowserContext) !void {
    var ctx = try CdpContext.init(allocator, context);
    defer ctx.deinit();

    const address = try std.net.Address.parseIp(host, port);
    var listener = try address.listen(.{ .reuse_address = true });
    defer listener.deinit();

    std.debug.print("CDP Server listening on {s}:{d}\n", .{ host, port });
}
