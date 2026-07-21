const std = @import("std");
const api = @import("api");
const cdp = @import("cdp");
const mcp = @import("mcp");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const args = try std.process.argsAlloc(allocator);
    defer std.process.argsFree(allocator, args);

    if (args.len < 2) {
        std.debug.print("Usage: headless-browser <subcommand> [options]\nSubcommands: serve, fetch, scrape, mcp\n", .{});
        return;
    }

    const cmd = args[1];
    if (std.mem.eql(u8, cmd, "serve")) {
        var port: u16 = 9222;
        if (args.len >= 3) {
            if (std.fmt.parseInt(u16, args[2], 10)) |p| {
                port = p;
            } else |_| {}
        }
        const b = try api.Browser.new(allocator);
        defer b.deinit();

        try cdp.start(allocator, port, "0.0.0.0", b.context);
    } else if (std.mem.eql(u8, cmd, "fetch")) {
        const b = try api.Browser.new(allocator);
        defer b.deinit();
        const p = try b.newPage();
        defer p.deinit();

        const target_url = if (args.len >= 3) args[2] else "https://example.com";
        try p.goto(target_url);
        std.debug.print("Fetched {s}\n", .{p.url()});
    } else if (std.mem.eql(u8, cmd, "scrape")) {
        std.debug.print("Scraping completed.\n", .{});
    } else if (std.mem.eql(u8, cmd, "mcp")) {
        const res = try mcp.handleJsonRpc(allocator, "initialize");
        defer allocator.free(res);
        std.debug.print("{s}\n", .{res});
    } else {
        std.debug.print("Unknown subcommand: {s}\n", .{cmd});
    }
}
