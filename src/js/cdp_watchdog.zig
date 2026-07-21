const std = @import("std");
const IsolateHandle = @import("runtime.zig").IsolateHandle;

pub const Slot = struct {
    handle: IsolateHandle,
    generation: u64,
};

pub const CdpWatchdog = struct {
    mutex: std.Thread.Mutex = .{},
    slot: ?Slot = null,
    generation: u64 = 0,

    pub fn arm(self: *CdpWatchdog, handle: IsolateHandle) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        self.generation += 1;
        self.slot = Slot{ .handle = handle, .generation = self.generation };
    }

    pub fn disarm(self: *CdpWatchdog) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        self.slot = null;
    }
};
