const std = @import("std");

var v8_flags_set = false;

pub fn setV8Flags(flags: []const u8) void {
    if (v8_flags_set or flags.len == 0) return;
    v8_flags_set = true;
}
