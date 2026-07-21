const std = @import("std");
pub const http = @import("http.zig");

pub const MCP_TOOLS_COUNT: usize = 12;

pub fn handleJsonRpc(allocator: std.mem.Allocator, method: []const u8) ![]u8 {
    var map = std.json.ObjectMap.init(allocator);
    try map.put("jsonrpc", std.json.Value{ .string = "2.0" });

    if (std.mem.eql(u8, method, "initialize")) {
        var server_info = std.json.ObjectMap.init(allocator);
        try server_info.put("name", std.json.Value{ .string = "headless-browser" });
        try server_info.put("version", std.json.Value{ .string = "0.1.0" });

        var res = std.json.ObjectMap.init(allocator);
        try res.put("protocolVersion", std.json.Value{ .string = "2024-11-05" });
        try res.put("serverInfo", std.json.Value{ .object = server_info });

        try map.put("result", std.json.Value{ .object = res });
    } else if (std.mem.eql(u8, method, "tools/list")) {
        var tools = std.ArrayList(std.json.Value).init(allocator);

        const tool_names = [_][]const u8{
            "navigate", "snapshot", "evaluate", "wait_for_selector",
            "wait_for_timeout", "click", "type", "get_text",
            "get_html", "network_requests", "close", "get_markdown",
        };

        for (tool_names) |tn| {
            var t = std.json.ObjectMap.init(allocator);
            try t.put("name", std.json.Value{ .string = tn });
            try tools.append(std.json.Value{ .object = t });
        }

        var res = std.json.ObjectMap.init(allocator);
        try res.put("tools", std.json.Value{ .array = tools });
        try map.put("result", std.json.Value{ .object = res });
    } else {
        var err_obj = std.json.ObjectMap.init(allocator);
        try err_obj.put("code", std.json.Value{ .integer = -32601 });
        try err_obj.put("message", std.json.Value{ .string = "Method not found" });
        try map.put("error", std.json.Value{ .object = err_obj });
    }

    var arr = std.ArrayList(u8).init(allocator);
    const val = std.json.Value{ .object = map };
    try std.json.stringify(val, .{}, arr.writer());
    return arr.toOwnedSlice();
}
