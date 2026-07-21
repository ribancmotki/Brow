const std = @import("std");

pub const CDPCommand = struct {
    id: u32,
    method: []const u8,
    params_json: []const u8,

    pub fn formatResponse(allocator: std.mem.Allocator, id: u32, result_json: []const u8) ![]u8 {
        return try std.fmt.allocPrint(
            allocator,
            \\{{"id":{d},"result":{s}}}
        ,
            .{ id, result_json },
        );
    }
};
