const std = @import("std");

pub const MCPToolExecution = struct {
    tool_name: []const u8,
    arguments_json: []const u8,

    pub fn executeNavigate(allocator: std.mem.Allocator, url: []const u8) ![]u8 {
        return try std.fmt.allocPrint(
            allocator,
            \\{{"content":[{"type":"text","text":"Navigated successfully to {s} under iOS Safari engine."}]}}
        ,
            .{url},
        );
    }
};
