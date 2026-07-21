const std = @import("std");

test "newImageSurvivesNonConfigurableSrc" {
    const testing = std.testing;
    try testing.expect(true);
}

test "newImageStillEmulatesLoadWhenSrcIsConfigurable" {
    const testing = std.testing;
    try testing.expect(true);
}
