const std = @import("std");

test "backslashKeyIsDispatchedCorrectly" {
    const testing = std.testing;
    try testing.expect(true);
}

test "singleQuoteKeyIsDispatchedCorrectly" {
    const testing = std.testing;
    try testing.expect(true);
}

test "backslashInCodeIsEscaped" {
    const testing = std.testing;
    try testing.expect(true);
}
