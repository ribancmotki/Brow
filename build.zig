const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{ .preferred_optimize_mode = .ReleaseFast });

    const exe = b.addExecutable(.{
        .name = "headless-browser",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Link target-specific libraries
    if (target.result.os.tag == .ios) {
        exe.linkFramework("JavaScriptCore");
        exe.linkFramework("Foundation");
    } else {
        if (std.process.getEnvVarOwned(b.allocator, "V8_LIB_DIR")) |lib_dir| {
            defer b.allocator.free(lib_dir);
            exe.addLibraryPath(.{ .cwd_relative = lib_dir });
        } else |_| {}
        exe.linkSystemLibrary("v8_monolith");
        exe.linkLibCpp();
    }

    exe.linkLibC();
    b.installArtifact(exe);
}
