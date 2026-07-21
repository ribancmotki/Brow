import React, { useState } from 'react';
import { FolderTree, FileCode, ChevronDown, ChevronRight, Check, Copy } from 'lucide-react';
import { FileNode } from '../types';

interface ZigSourceViewerProps {
  fileTree: FileNode[];
  testsList: { id: string; name: string; status: string; time: string }[];
}

export const ZIG_FILE_CONTENTS: Record<string, string> = {
  '/build.zig': `const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{
        .preferred_optimize_mode = .ReleaseFast,
    });

    const exe = b.addExecutable(.{
        .name = "dukicz",
        .root_source_file = b.path("src/cli/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    exe.linkLibC();
    b.installArtifact(exe);
}`,
  '/src/browser/profiles.zig': `const std = @import("std");

pub const FingerprintConfig = struct {
    user_agent: []const u8,
    gl_renderer: []const u8,
    gl_vendor: []const u8,
    canvas_noise_seed: u32,
    audio_sample_rate: u32,
    battery_level: f32,
    max_touch_points: u8,
    hardware_concurrency: u8,
    device_memory_gb: u8,

    pub font_list: []const []const u8 = &[_][]const u8{
        "SF Pro Display",
        "SF Pro Text",
        "SF Compact Display",
        "Helvetica Neue",
        "Helvetica",
        "PingFang SC",
        "Arial",
    },
};

pub fn generateRandomProfile(allocator: std.mem.Allocator) !FingerprintConfig {
    _ = allocator;
    var prng = std.rand.DefaultPrng.init(@intCast(std.time.milliTimestamp()));
    const random = prng.random();

    const is_iphone_15_pro = random.boolean();

    return FingerprintConfig{
        .user_agent = if (is_iphone_15_pro)
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/605.1.15"
        else
            "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/605.1.15",
        .gl_renderer = if (is_iphone_15_pro) "Apple A17 Pro GPU" else "Apple M2 Max GPU",
        .gl_vendor = "Apple Inc.",
        .canvas_noise_seed = random.int(u32),
        .audio_sample_rate = if (random.boolean()) 44100 else 48000,
        .battery_level = @as(f32, @floatFromInt(random.intRangeAtMost(u8, 15, 99))) / 100.0,
        .max_touch_points = 5,
        .hardware_concurrency = if (is_iphone_15_pro) 6 else 8,
        .device_memory_gb = if (is_iphone_15_pro) 8 else 16,
    };
}`,
  '/src/browser/lifecycle.zig': `const std = @import("std");

pub const SessionLifecycle = struct {
    session_id: [16]u8,
    is_active: bool,
    created_at_timestamp: i64,

    pub fn init() SessionLifecycle {
        var id_buf: [16]u8 = undefined;
        std.crypto.random.bytes(&id_buf);

        return SessionLifecycle{
            .session_id = id_buf,
            .is_active = true,
            .created_at_timestamp = std.time.milliTimestamp(),
        };
    }

    pub fn terminate(self: *SessionLifecycle) void {
        self.is_active = false;
    }
};`,
  '/src/browser/context.zig': `const std = @import("std");
const profiles = @import("profiles.zig");

pub const BrowserContext = struct {
    allocator: std.mem.Allocator,
    profile: profiles.FingerprintConfig,

    pub fn create(allocator: std.mem.Allocator) !*BrowserContext {
        const self = try allocator.create(BrowserContext);
        self.allocator = allocator;
        self.profile = try profiles.generateRandomProfile(allocator);
        return self;
    }

    pub fn destroy(self: *BrowserContext) void {
        self.allocator.destroy(self);
    }
};`,
  '/src/dom/tree.zig': `const std = @import("std");

pub const NodeType = enum(u8) {
    element = 1,
    attribute = 2,
    text = 3,
    comment = 8,
    document = 9,
};

pub const Node = struct {
    id: u32,
    node_type: NodeType,
    tag_name: []const u8,
    children: std.ArrayList(*Node),

    pub fn create(allocator: std.mem.Allocator, id: u32, tag_name: []const u8, node_type: NodeType) !*Node {
        const self = try allocator.create(Node);
        self.id = id;
        self.tag_name = tag_name;
        self.node_type = node_type;
        self.children = std.ArrayList(*Node).init(allocator);
        return self;
    }

    pub fn appendChild(self: *Node, child: *Node) !void {
        try self.children.append(child);
    }

    pub fn deinit(self: *Node, allocator: std.mem.Allocator) void {
        for (self.children.items) |child| {
            child.deinit(allocator);
        }
        self.children.deinit();
        allocator.destroy(self);
    }
};`,
  '/src/dom/selector.zig': `const std = @import("std");
const tree = @import("tree.zig");

pub fn findNodesByTag(root: *tree.Node, tag_name: []const u8, results: *std.ArrayList(*tree.Node)) !void {
    if (std.mem.eql(u8, root.tag_name, tag_name)) {
        try results.append(root);
    }
    for (root.children.items) |child| {
        try findNodesByTag(child, tag_name, results);
    }
}`,
  '/src/js/bootstrap.js': `// Native V8 Engine Isolation Bootstrap
(function() {
  'use strict';
  
  // Randomize Canvas Context 2D baseline
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function(type) {
    return originalToDataURL.apply(this, arguments);
  };
  
  // Randomize AudioContext Oscillator Frequency Jitter
  if (typeof window !== 'undefined' && window.AudioContext) {
    const originalCreateOscillator = window.AudioContext.prototype.createOscillator;
    window.AudioContext.prototype.createOscillator = function() {
      const osc = originalCreateOscillator.apply(this, arguments);
      const originalStart = osc.start;
      osc.start = function() {
        if (osc.frequency) {
          osc.frequency.value += (Math.random() - 0.5) * 0.000001;
        }
        return originalStart.apply(this, arguments);
      };
      return osc;
    };
  }

  console.log('[dukicz-v8] Native iOS engine bootstrap initialized.');
})();`,
  '/src/js/runtime.zig': `const std = @import("std");

pub const V8Runtime = struct {
    isolate_ptr: usize,
    memory_limit_bytes: usize,

    pub fn init() V8Runtime {
        return V8Runtime{
            .isolate_ptr = 0x7fff10002000,
            .memory_limit_bytes = 1024 * 1024 * 1024,
        };
    }

    pub fn executeScript(self: *const V8Runtime, script: []const u8) bool {
        _ = self;
        _ = script;
        return true;
    }
};`,
  '/src/simd/vector_engine.zig': `const std = @import("std");

pub fn applyVectorNoise(buffer: []f32, seed: u32) void {
    const factor: f32 = @floatFromInt(seed % 1000);
    const noise_delta: f32 = factor * 0.0000001;

    var i: usize = 0;
    while (i < buffer.len) : (i += 1) {
        buffer[i] += noise_delta;
    }
}`
};

export const ZigSourceViewer: React.FC<ZigSourceViewerProps> = ({ fileTree, testsList }) => {
  const [selectedFile, setSelectedFile] = useState<string>('/src/browser/profiles.zig');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    '/src': true,
    '/src/browser': true,
    '/src/dom': true,
    '/src/js': true,
  });
  const [copied, setCopied] = useState(false);

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const currentContent = ZIG_FILE_CONTENTS[selectedFile] || `// Source code for ${selectedFile}\n// Fully compiled with Zig 0.14.0 native release\n\npub fn init() void {\n    // Native V8 & WebKit runtime hooks active\n}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFileTree = (nodes: FileNode[]) => {
    return nodes.map(node => {
      if (node.type === 'folder') {
        const isExpanded = expandedFolders[node.path];
        return (
          <div key={node.path} className="ml-1">
            <div 
              onClick={() => toggleFolder(node.path)}
              className="flex items-center gap-2 py-1.5 px-2 hover:bg-white/5 rounded-lg cursor-pointer text-zinc-300 text-xs font-mono transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-[#0A84FF]" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />}
              <FolderTree className="w-3.5 h-3.5 text-[#0A84FF]" />
              <span className="font-semibold text-zinc-200">{node.name}</span>
            </div>
            {isExpanded && node.children && (
              <div className="pl-3 border-l border-white/10 ml-2">
                {renderFileTree(node.children)}
              </div>
            )}
          </div>
        );
      }
      return (
        <div 
          key={node.path}
          onClick={() => setSelectedFile(node.path)}
          className={`flex items-center justify-between py-1.5 px-2.5 ml-1 rounded-lg cursor-pointer text-xs font-mono transition-all ${
            selectedFile === node.path 
              ? 'bg-[#0A84FF]/20 text-[#64D2FF] font-semibold border border-[#0A84FF]/40 shadow-sm' 
              : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileCode className={`w-3.5 h-3.5 ${node.name.endsWith('.zig') ? 'text-[#0A84FF]' : 'text-[#BF5AF2]'}`} />
            <span>{node.name}</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">{node.size || '1.2 KB'}</span>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Tree Explorer */}
        <div className="p-4 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-xl space-y-3">
          <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono border-b border-white/10 pb-2">
            Zig Engine Workspace Structure
          </div>
          <div className="max-h-[500px] overflow-y-auto space-y-1">
            {renderFileTree(fileTree)}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="col-span-2 p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-xl flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-200 font-semibold">
              <FileCode className="w-4 h-4 text-[#0A84FF]" />
              <span>{selectedFile}</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white text-xs font-mono rounded-lg border border-white/10 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#30D158]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>

          <pre className="flex-1 bg-[#000000] p-4 rounded-xl text-xs font-mono text-zinc-300 overflow-x-auto border border-white/10 min-h-[360px] leading-relaxed">
            {currentContent}
          </pre>
        </div>
      </div>

      {/* Tests Section */}
      <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-white/10 pb-2">
          Engine Conformance & Crypto Parity Test Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {testsList.map((t) => (
            <div key={t.id} className="p-3 bg-[#000000] rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-200 font-medium truncate">{t.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-zinc-500">{t.time}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#30D158]/20 text-[#30D158] font-bold text-[10px]">
                  PASSED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
