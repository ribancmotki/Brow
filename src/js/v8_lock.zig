const std = @import("std");

var mutex: std.Thread.Mutex = .{};

pub fn global() *std.Thread.Mutex {
    return &mutex;
}
