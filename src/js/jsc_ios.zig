const std = @import("std");

const c = @cImport({
    @cInclude("JavaScriptCore/JavaScript.h");
});

pub const IosJsEngine = struct {
    group: c.JSContextGroupRef,
    context: c.JSGlobalContextRef,

    pub fn init() !IosJsEngine {
        const group = c.JSContextGroupCreate();
        const context = c.JSGlobalContextCreateInGroup(group, null);
        if (context == null) return error.ContextCreationFailed;

        return IosJsEngine{
            .group = group,
            .context = context,
        };
    }

    pub fn deinit(self: *IosJsEngine) void {
        c.JSGlobalContextRelease(self.context);
        c.JSContextGroupRelease(self.group);
    }

    pub fn evaluateScript(self: *IosJsEngine, allocator: std.mem.Allocator, script_text: []const u8) ![]u8 {
        var buf: [4096]u8 = undefined;
        const script_z = try std.fmt.bufPrintZ(&buf, "{s}", .{script_text});

        const js_string = c.JSStringCreateWithUTF8CString(script_z.ptr);
        defer c.JSStringRelease(js_string);

        var exception: c.JSValueRef = null;
        const result = c.JSEvaluateScript(self.context, js_string, null, null, 1, &exception);

        if (exception != null) {
            return error.JsExecutionError;
        }

        const result_string = c.JSValueToStringCopy(self.context, result, null);
        defer c.JSStringRelease(result_string);

        const max_bytes = c.JSStringGetMaximumUTF8CStringSize(result_string);
        const out_buf = try allocator.alloc(u8, max_bytes);
        _ = c.JSStringGetUTF8CString(result_string, out_buf.ptr, max_bytes);

        // Trim trailing null byte if present
        const actual_len = std.mem.indexOfScalar(u8, out_buf, 0) orelse out_buf.len;
        return allocator.realloc(out_buf, actual_len);
    }
};
