const std = @import("std");

pub const V8Runtime = struct {
    allocator: std.mem.Allocator,
    isolate_ptr: usize,
    memory_limit_bytes: usize,

    pub fn init(allocator: std.mem.Allocator) V8Runtime {
        return V8Runtime{
            .allocator = allocator,
            .isolate_ptr = 0x7fff10002000,
            .memory_limit_bytes = 1024 * 1024 * 1024,
        };
    }

    pub fn executeScript(self: *const V8Runtime, script: []const u8) bool {
        _ = self;
        _ = script;
        return true;
    }

    pub fn deinit(self: *V8Runtime) void {
        _ = self;
    }
};
