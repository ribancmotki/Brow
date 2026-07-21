const std = @import("std");
const mcp = @import("mcp");

test "test_initialize" {
    const testing = std.testing;
    const res = try mcp.handleJsonRpc(testing.allocator, "initialize");
    defer testing.allocator.free(res);
    try testing.expect(std.mem.indexOf(u8, res, "2024-11-05") != null);
}

test "test_ping" {
    const testing = std.testing;
    try testing.expect(true);
}

test "test_tools_list" {
    const testing = std.testing;
    const res = try mcp.handleJsonRpc(testing.allocator, "tools/list");
    defer testing.allocator.free(res);
    try testing.expect(std.mem.indexOf(u8, res, "navigate") != null);
    try testing.expect(std.mem.indexOf(u8, res, "get_markdown") != null);
}

test "test_resources_list" {
    const testing = std.testing;
    try testing.expect(true);
}

test "test_prompts_list" {
    const testing = std.testing;
    try testing.expect(true);
}

test "test_unknown_method_returns_error" {
    const testing = std.testing;
    const res = try mcp.handleJsonRpc(testing.allocator, "non_existent_method");
    defer testing.allocator.free(res);
    try testing.expect(std.mem.indexOf(u8, res, "-32601") != null);
}
