const std = @import("std");
const profiles = @import("../browser/profiles.zig");

pub fn generateBootstrapScript(allocator: std.mem.Allocator, config: profiles.FingerprintConfig) ![]u8 {
    return try std.fmt.allocPrint(
        allocator,
        \\(function() {{
        \\  'use strict';
        \\  Object.defineProperty(navigator, 'userAgent', {{ get: () => "{s}" }});
        \\  Object.defineProperty(navigator, 'platform', {{ get: () => "iPhone" }});
        \\  Object.defineProperty(navigator, 'maxTouchPoints', {{ get: () => {d} }});
        \\  Object.defineProperty(navigator, 'hardwareConcurrency', {{ get: () => {d} }});
        \\  Object.defineProperty(navigator, 'deviceMemory', {{ get: () => {d} }});
        \\  window.__DUKICZ_CANVAS_SEED__ = {d};
        \\  window.__DUKICZ_AUDIO_RATE__ = {d};
        \\}})();
    ,
        .{
            config.user_agent,
            config.max_touch_points,
            config.hardware_concurrency,
            config.device_memory_gb,
            config.canvas_noise_seed,
            config.audio_sample_rate,
        },
    );
}
