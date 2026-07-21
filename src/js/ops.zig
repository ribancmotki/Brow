const std = @import("std");

pub fn op_dom(command_json: []const u8) []const u8 {
    _ = command_json;
    return "{\"status\": \"ok\"}";
}

pub fn op_crypto_random(len: u32, allocator: std.mem.Allocator) ![]u8 {
    const buf = try allocator.alloc(u8, len);
    std.crypto.random.bytes(buf);
    return buf;
}
