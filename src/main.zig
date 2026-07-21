const std = @import("std");
const profiles = @import("browser/profiles.zig");
const context = @import("browser/context.zig");
const lifecycle = @import("browser/lifecycle.zig");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const stdout = std.io.getStdOut().writer();
    try stdout.print("[DUKICZ] High-Performance Native Zig iOS Browser Engine Core Initializing...\n", .{});

    var sess = lifecycle.SessionLifecycle.init();
    try stdout.print("[DUKICZ] Session Created. Active: {}\n", .{sess.is_active});

    var browser_ctx = try context.BrowserContext.create(allocator);
    defer browser_ctx.destroy();

    try stdout.print("[DUKICZ] UserAgent Profile Loaded: {s}\n", .{browser_ctx.profile.user_agent});
    try stdout.print("[DUKICZ] GPU Hardware Acceleration: {s}\n", .{browser_ctx.profile.gl_renderer});

    try stdout.print("[DUKICZ] Engine startup complete. Waiting for CDP/MCP RPC commands...\n", .{});
}
