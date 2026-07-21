const std = @import("std");

pub const LifecycleState = enum {
    Idle,
    Loading,
    DomContentLoaded,
    Loaded,
    NetworkIdle,
    Failed,

    pub fn isLoading(self: LifecycleState) bool {
        return self == .Loading;
    }

    pub fn isLoaded(self: LifecycleState) bool {
        return self == .Loaded or self == .NetworkIdle;
    }

    pub fn isNetworkIdle(self: LifecycleState) bool {
        return self == .NetworkIdle;
    }
};

pub const WaitUntil = enum {
    Load,
    DomContentLoaded,
    NetworkIdle0,
    NetworkIdle2,

    pub fn fromStr(s: []const u8) WaitUntil {
        if (std.ascii.eqlIgnoreCase(s, "domcontentloaded")) {
            return .DomContentLoaded;
        } else if (std.ascii.eqlIgnoreCase(s, "networkidle0") or std.ascii.eqlIgnoreCase(s, "networkidle") or std.ascii.eqlIgnoreCase(s, "networkIdle")) {
            return .NetworkIdle0;
        } else if (std.ascii.eqlIgnoreCase(s, "networkidle2")) {
            return .NetworkIdle2;
        } else {
            return .Load;
        }
    }
};
