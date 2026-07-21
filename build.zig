const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const stealth_opt = b.option(bool, "stealth", "Enable stealth TLS fingerprint spoofing") orelse false;

    // Resolve build version
    var env_map = std.process.getEnvMap(b.allocator) catch std.process.EnvMap.init(b.allocator);
    defer env_map.deinit();

    const version_str = resolveVersion(b.allocator, &env_map) catch "0.1.0";
    const options = b.addOptions();
    options.addOption([]const u8, "BUILD_VERSION", version_str);
    options.addOption(bool, "STEALTH_ENABLED", stealth_opt);

    // Modules
    const dom_mod = b.addModule("dom", .{ .root_source_file = b.path("src/dom/lib.zig") });
    const net_mod = b.addModule("net", .{ .root_source_file = b.path("src/net/lib.zig") });
    const browser_mod = b.addModule("browser", .{ .root_source_file = b.path("src/browser/lib.zig") });
    const js_mod = b.addModule("js", .{ .root_source_file = b.path("src/js/lib.zig") });
    const cdp_mod = b.addModule("cdp", .{ .root_source_file = b.path("src/cdp/lib.zig") });
    const mcp_mod = b.addModule("mcp", .{ .root_source_file = b.path("src/mcp/lib.zig") });
    const api_mod = b.addModule("api", .{ .root_source_file = b.path("src/api/lib.zig") });

    dom_mod.addOptions("build_options", options);
    net_mod.addOptions("build_options", options);
    browser_mod.addOptions("build_options", options);
    js_mod.addOptions("build_options", options);
    cdp_mod.addOptions("build_options", options);
    mcp_mod.addOptions("build_options", options);
    api_mod.addOptions("build_options", options);

    // Main CLI Executable
    const exe = b.addExecutable(.{
        .name = "headless-browser",
        .root_source_file = b.path("src/cli/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    exe.root_module.addImport("dom", dom_mod);
    exe.root_module.addImport("net", net_mod);
    exe.root_module.addImport("browser", browser_mod);
    exe.root_module.addImport("js", js_mod);
    exe.root_module.addImport("cdp", cdp_mod);
    exe.root_module.addImport("mcp", mcp_mod);
    exe.root_module.addImport("api", api_mod);

    // Link V8 via environment or pkg-config
    if (env_map.get("V8_INCLUDE_DIR")) |inc_dir| {
        exe.addIncludePath(.{ .cwd_relative = inc_dir });
    }
    if (env_map.get("V8_LIB_DIR")) |lib_dir| {
        exe.addLibraryPath(.{ .cwd_relative = lib_dir });
    }
    exe.linkSystemLibrary("v8_monolith");
    exe.linkLibCpp();

    b.installArtifact(exe);

    // Worker Executable
    const worker_exe = b.addExecutable(.{
        .name = "headless-worker",
        .root_source_file = b.path("src/cli/worker.zig"),
        .target = target,
        .optimize = optimize,
    });
    worker_exe.root_module.addImport("api", api_mod);
    worker_exe.linkLibCpp();
    b.installArtifact(worker_exe);

    // Serial Tests Runner
    const main_tests = b.addTest(.{
        .root_source_file = b.path("src/tests/mcp_client.zig"),
        .target = target,
        .optimize = optimize,
    });
    const run_main_tests = b.addRunArtifact(main_tests);
    run_main_tests.has_side_effects = true;
    const test_step = b.step("test", "Run unit tests serially");
    test_step.dependOn(&run_main_tests.step);
}

fn resolveVersion(allocator: std.mem.Allocator, env: *std.process.EnvMap) ![]const u8 {
    if (env.get("HEADLESS_VERSION")) |ver| return ver;
    if (env.get("GITHUB_REF_NAME")) |ref_name| {
        if (std.mem.startsWith(u8, ref_name, "v")) {
            return ref_name[1..];
        }
        return ref_name;
    }
    return "0.1.0";
}
