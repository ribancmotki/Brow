pub const BrowserConfig = struct {
    proxy: ?[]const u8 = null,
    stealth: bool = false,
    user_agent: ?[]const u8 = null,
    storage_dir: ?[]const u8 = null,
};

pub const BrowserConfigBuilder = struct {
    config: BrowserConfig = .{},

    pub fn proxy(self: *BrowserConfigBuilder, p: []const u8) *BrowserConfigBuilder {
        self.config.proxy = p;
        return self;
    }

    pub fn stealth(self: *BrowserConfigBuilder, s: bool) *BrowserConfigBuilder {
        self.config.stealth = s;
        return self;
    }

    pub fn userAgent(self: *BrowserConfigBuilder, ua: []const u8) *BrowserConfigBuilder {
        self.config.user_agent = ua;
        return self;
    }

    pub fn storageDir(self: *BrowserConfigBuilder, dir: []const u8) *BrowserConfigBuilder {
        self.config.storage_dir = dir;
        return self;
    }

    pub fn build(self: BrowserConfigBuilder) BrowserConfig {
        return self.config;
    }
};
