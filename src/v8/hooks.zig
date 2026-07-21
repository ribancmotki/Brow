const std = @import("std");

pub const CanvasHook = struct {
    seed: u32,

    pub fn injectNoise(self: CanvasHook, pixel_data: []u8) void {
        var prng = std.rand.DefaultPrng.init(self.seed);
        const random = prng.random();

        var i: usize = 0;
        while (i < pixel_data.len) : (i += 4) {
            if (pixel_data[i] > 0) {
                const noise = random.intRangeAtMost(i8, -1, 1);
                const current: i16 = pixel_data[i];
                const new_val = std.math.clamp(current + noise, 0, 255);
                pixel_data[i] = @intCast(new_val);
            }
        }
    }
};
