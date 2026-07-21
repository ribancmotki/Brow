const std = @import("std");

pub fn applyVectorNoise(buffer: []f32, seed: u32) void {
    const factor: f32 = @floatFromInt(seed % 1000);
    const noise_delta: f32 = factor * 0.0000001;

    var i: usize = 0;
    while (i < buffer.len) : (i += 1) {
        buffer[i] += noise_delta;
    }
}
