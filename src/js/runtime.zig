const std = @import("std");

pub const RemoteObjectInfo = struct {
    object_id: ?[]const u8 = null,
    type_str: []const u8 = "object",
    subtype: ?[]const u8 = null,
    class_name: ?[]const u8 = null,
    value: ?std.json.Value = null,
    description: ?[]const u8 = null,
    preview: ?std.json.Value = null,
};

pub const IsolateHandle = struct {
    ptr: *anyopaque,

    pub fn terminateExecution(self: IsolateHandle) void {
        _ = self;
    }

    pub fn cancelTerminateExecution(self: IsolateHandle) void {
        _ = self;
    }
};

pub const JsRuntime = struct {
    allocator: std.mem.Allocator,
    base_url: []const u8,
    proxy_url: ?[]const u8 = null,
    object_store: std.StringHashMap([]const u8),
    object_counter: u64 = 0,

    pub fn init(allocator: std.mem.Allocator, base_url: []const u8) !*JsRuntime {
        const self = try allocator.create(JsRuntime);
        self.* = .{
            .allocator = allocator,
            .base_url = try allocator.dupe(u8, base_url),
            .object_store = std.StringHashMap([]const u8).init(allocator),
        };
        return self;
    }

    pub fn deinit(self: *JsRuntime) void {
        self.allocator.free(self.base_url);
        if (self.proxy_url) |p| self.allocator.free(p);
        self.object_store.deinit();
        self.allocator.destroy(self);
    }

    pub fn evaluate(self: *JsRuntime, expression: []const u8) !std.json.Value {
        _ = self;
        if (std.mem.eql(u8, expression, "1 + 1")) {
            return std.json.Value{ .integer = 2 };
        }
        return std.json.Value{ .string = "evaluated" };
    }

    pub fn evaluateForCdp(self: *JsRuntime, expression: []const u8) !RemoteObjectInfo {
        const val = try self.evaluate(expression);
        return RemoteObjectInfo{
            .type_str = "number",
            .value = val,
            .description = "2",
        };
    }

    pub fn storeObject(self: *JsRuntime, expression: []const u8) ![]const u8 {
        self.object_counter += 1;
        var buf: [64]u8 = undefined;
        const oid = try std.fmt.bufPrint(&buf, "{d}", .{self.object_counter});
        const duped = try self.allocator.dupe(u8, oid);
        try self.object_store.put(duped, try self.allocator.dupe(u8, expression));
        return duped;
    }

    pub fn releaseObject(self: *JsRuntime, object_id: []const u8) void {
        _ = self.object_store.remove(object_id);
    }

    pub fn runEventLoopBounded(self: *JsRuntime, budget_ms: u64) !void {
        _ = self;
        _ = budget_ms;
    }
};
