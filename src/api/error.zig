pub const Error = union(enum) {
    Navigation: []const u8,
    JsEval: []const u8,
    Timeout: []const u8,
    ElementNotFound: []const u8,
    NoPage,
    Internal: anyerror,
};
