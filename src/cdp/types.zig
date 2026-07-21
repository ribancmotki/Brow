const std = @import("std");

pub const CdpError = struct {
    code: i32,
    message: []const u8,
};

pub const CdpRequest = struct {
    id: ?i64 = null,
    method: []const u8,
    params: ?std.json.Value = null,
    session_id: ?[]const u8 = null,
};

pub const CdpResponse = struct {
    id: ?i64,
    result: ?std.json.Value = null,
    @"error": ?CdpError = null,
    session_id: ?[]const u8 = null,

    pub fn success(id: ?i64, result: ?std.json.Value, session_id: ?[]const u8) CdpResponse {
        return .{ .id = id, .result = result, .session_id = session_id };
    }

    pub fn error_(id: ?i64, code: i32, message: []const u8, session_id: ?[]const u8) CdpResponse {
        return .{ .id = id, .@"error" = .{ .code = code, .message = message }, .session_id = session_id };
    }
};

pub const CdpEvent = struct {
    method: []const u8,
    params: std.json.Value,
    session_id: ?[]const u8 = null,

    pub fn new(method: []const u8, params: std.json.Value) CdpEvent {
        return .{ .method = method, .params = params };
    }

    pub fn withSession(method: []const u8, params: std.json.Value, session_id: ?[]const u8) CdpEvent {
        return .{ .method = method, .params = params, .session_id = session_id };
    }
};
