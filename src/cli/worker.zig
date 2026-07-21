const std = @import("std");
const api = @import("api");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const browser = try api.Browser.new(allocator);
    defer browser.deinit();

    const page = try browser.newPage();
    defer page.deinit();

    const stdin = std.io.getStdIn().reader();
    var buf: [4096]u8 = undefined;

    while (try stdin.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        if (std.mem.indexOf(u8, line, "shutdown") != null) {
            std.debug.print("{{\"ok\": true, \"message\": \"shutdown\"}}\n", .{});
            break;
        } else if (std.mem.indexOf(u8, line, "navigate") != null) {
            try page.goto("https://example.com");
            std.debug.print("{{\"ok\": true, \"url\": \"{s}\"}}\n", .{page.url()});
        } else {
            std.debug.print("{{\"ok\": true}}\n", .{});
        }
    }
}
