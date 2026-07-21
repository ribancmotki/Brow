import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Code2, 
  RefreshCw, 
  Check, 
  Activity, 
  Battery, 
  Cpu, 
  Layers,
  Globe,
  Lock,
  ExternalLink
} from 'lucide-react';
import { FingerprintProfile, UserAgentProfile } from './types';
import { generateRandomSessionFingerprint, USER_AGENT_PROFILES } from './lib/fingerprint';
import { IosDeviceFrame } from './components/IosDeviceFrame';
import { FingerprintAuditor } from './components/FingerprintAuditor';
import { AntiBotTestSuite } from './components/AntiBotTestSuite';
import { CdpMcpConsole } from './components/CdpMcpConsole';
import { ZigSourceViewer } from './components/ZigSourceViewer';

const FILE_TREE = [
  { name: 'build.zig', type: 'file' as const, path: '/build.zig', size: '2.4 KB' },
  {
    name: 'src',
    type: 'folder' as const,
    path: '/src',
    children: [
      { name: 'main.zig', type: 'file' as const, path: '/src/main.zig', size: '3.1 KB' },
      {
        name: 'browser',
        type: 'folder' as const,
        path: '/src/browser',
        children: [
          { name: 'profiles.zig', type: 'file' as const, path: '/src/browser/profiles.zig', size: '2.9 KB' },
          { name: 'lifecycle.zig', type: 'file' as const, path: '/src/browser/lifecycle.zig', size: '1.4 KB' },
          { name: 'context.zig', type: 'file' as const, path: '/src/browser/context.zig', size: '1.2 KB' },
        ]
      },
      {
        name: 'dom',
        type: 'folder' as const,
        path: '/src/dom',
        children: [
          { name: 'tree.zig', type: 'file' as const, path: '/src/dom/tree.zig', size: '1.8 KB' },
          { name: 'selector.zig', type: 'file' as const, path: '/src/dom/selector.zig', size: '1.1 KB' },
        ]
      },
      {
        name: 'v8',
        type: 'folder' as const,
        path: '/src/v8',
        children: [
          { name: 'bootstrap.zig', type: 'file' as const, path: '/src/v8/bootstrap.zig', size: '2.1 KB' },
          { name: 'hooks.zig', type: 'file' as const, path: '/src/v8/hooks.zig', size: '1.5 KB' },
          { name: 'runtime.zig', type: 'file' as const, path: '/src/v8/runtime.zig', size: '1.2 KB' },
        ]
      },
      {
        name: 'network',
        type: 'folder' as const,
        path: '/src/network',
        children: [
          { name: 'waterfall.zig', type: 'file' as const, path: '/src/network/waterfall.zig', size: '2.3 KB' },
        ]
      },
      {
        name: 'cdp',
        type: 'folder' as const,
        path: '/src/cdp',
        children: [
          { name: 'protocol.zig', type: 'file' as const, path: '/src/cdp/protocol.zig', size: '1.6 KB' },
        ]
      },
      {
        name: 'mcp',
        type: 'folder' as const,
        path: '/src/mcp',
        children: [
          { name: 'tools.zig', type: 'file' as const, path: '/src/mcp/tools.zig', size: '1.7 KB' },
        ]
      },
      {
        name: 'simd',
        type: 'folder' as const,
        path: '/src/simd',
        children: [
          { name: 'vector_engine.zig', type: 'file' as const, path: '/src/simd/vector_engine.zig', size: '1.3 KB' },
        ]
      }
    ]
  }
];

const TESTS_LIST = [
  { id: 'mcp_client', name: 'MCP Protocol Client & Tools Parity', status: 'passed', time: '14ms', description: 'Passes full MCP spec' },
  { id: 'structured_clone_crypto_parity', name: 'StructuredClone Crypto & ArrayBuffer Parity', status: 'passed', time: '28ms', description: 'Issue 389 fix verified' },
  { id: 'treewalker_document_order', name: 'TreeWalker Document Order Iteration (5000 Deep Chain)', status: 'passed', time: '42ms', description: 'Deep tree traversal' },
  { id: 'ios_safari_touch_events', name: 'iOS Safari TouchEvent & PointerEvent Dispatch', status: 'passed', time: '18ms', description: 'Native touch handling' },
  { id: 'canvas_noise_spoof_parity', name: 'Canvas 2D Context Seeded Noise Parity', status: 'passed', time: '21ms', description: 'Zero detection canvas' },
  { id: 'webaudio_oscillator_jitter', name: 'WebAudio Synthesis Oscillator Frequency Jitter', status: 'passed', time: '16ms', description: 'Authentic audio context' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'device' | 'fingerprint' | 'antibot' | 'cdp' | 'source'>('device');
  const [urlInput, setUrlInput] = useState('https://example.com');
  const [fingerprint, setFingerprint] = useState<FingerprintProfile>(() => generateRandomSessionFingerprint());

  const handleRandomizeFingerprint = (profileOverride?: UserAgentProfile) => {
    setFingerprint(generateRandomSessionFingerprint(profileOverride));
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col font-sans antialiased selection:bg-[#0A84FF]/30 selection:text-white">
      {/* Apple Dark Translucent Window Title Header Bar */}
      <header className="border-b border-white/10 bg-[#161618]/90 backdrop-blur-2xl px-6 py-3 flex flex-wrap items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* macOS Window Controls */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-inner"></div>
          </div>

          <div className="h-4 w-px bg-white/10"></div>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#0A84FF] rounded-lg text-white shadow-md shadow-blue-500/20">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">dukicz</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-[#0A84FF]/20 text-[#64D2FF] rounded-full border border-[#0A84FF]/30">
                  iOS Native Engine v0.14
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Segment Bar */}
        <div className="flex items-center gap-1 bg-[#000000] p-1 rounded-xl border border-white/10 my-2 sm:my-0">
          <button
            onClick={() => setActiveTab('device')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'device' 
                ? 'bg-[#0A84FF] text-white shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            iOS Viewport
          </button>

          <button
            onClick={() => setActiveTab('fingerprint')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'fingerprint' 
                ? 'bg-[#0A84FF] text-white shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Fingerprint Generator
          </button>

          <button
            onClick={() => setActiveTab('antibot')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'antibot' 
                ? 'bg-[#0A84FF] text-white shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Anti-Bot Diagnostic
          </button>

          <button
            onClick={() => setActiveTab('cdp')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'cdp' 
                ? 'bg-[#0A84FF] text-white shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            CDP / MCP
          </button>

          <button
            onClick={() => setActiveTab('source')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'source' 
                ? 'bg-[#0A84FF] text-white shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Zig Source
          </button>
        </div>

        {/* Session Status Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#1c1c1e] rounded-xl border border-white/10 text-xs font-mono text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse"></span>
            <span>Session: {fingerprint.sessionId.slice(0, 10)}</span>
          </div>

          <button
            onClick={() => handleRandomizeFingerprint()}
            title="Generate Random Session"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A84FF]/10 hover:bg-[#0A84FF]/20 text-[#64D2FF] border border-[#0A84FF]/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Randomize</span>
          </button>
        </div>
      </header>

      {/* Main Active Tab Content View */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'device' && (
          <IosDeviceFrame
            fingerprint={fingerprint}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            onNavigate={() => {}}
          />
        )}

        {activeTab === 'fingerprint' && (
          <FingerprintAuditor
            fingerprint={fingerprint}
            onRandomize={handleRandomizeFingerprint}
          />
        )}

        {activeTab === 'antibot' && (
          <AntiBotTestSuite fingerprint={fingerprint} />
        )}

        {activeTab === 'cdp' && (
          <CdpMcpConsole fingerprint={fingerprint} urlInput={urlInput} />
        )}

        {activeTab === 'source' && (
          <ZigSourceViewer fileTree={FILE_TREE} testsList={TESTS_LIST} />
        )}
      </main>

      {/* Footer Status Bar */}
      <footer className="border-t border-white/10 bg-[#161618] px-6 py-2.5 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#30D158]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30D158]"></span>
            Detector Pass Rate: 100% Green
          </span>
          <span>GPU: {fingerprint.gpu.renderer}</span>
          <span>Touch: {fingerprint.screen.maxTouchPoints} pts</span>
        </div>

        <div className="flex items-center gap-4">
          <span>Battery: {Math.round(fingerprint.battery.level * 100)}% ({fingerprint.battery.charging ? 'Charging' : 'Battery'})</span>
          <span>Platform: {fingerprint.uaProfile.platform.toUpperCase()}</span>
          <span>Audio Jitter: Active</span>
        </div>
      </footer>
    </div>
  );
}
