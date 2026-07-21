import React, { useState } from 'react';
import { 
  Globe, 
  Lock, 
  RotateCw, 
  Share, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Battery, 
  Wifi, 
  Signal, 
  Play, 
  Check, 
  Cpu, 
  Activity, 
  Layers,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { FingerprintProfile } from '../types';

interface IosDeviceFrameProps {
  fingerprint: FingerprintProfile;
  urlInput: string;
  setUrlInput: (url: string) => void;
  onNavigate: () => void;
}

export const IosDeviceFrame: React.FC<IosDeviceFrameProps> = ({
  fingerprint,
  urlInput,
  setUrlInput,
  onNavigate
}) => {
  const [deviceModel, setDeviceModel] = useState<'iphone' | 'ipad' | 'mac'>('iphone');
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeSegment, setActiveSegment] = useState<'dom' | 'network' | 'v8'>('dom');

  const handleRunNavigate = () => {
    setIsNavigating(true);
    onNavigate();
    setTimeout(() => {
      setIsNavigating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* iOS Device Model Selector Bar */}
      <div className="flex items-center justify-between bg-[#1c1c1e] p-3 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#0A84FF]" />
          <span className="text-xs font-semibold text-zinc-200">Device Hardware Viewport:</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#000000] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setDeviceModel('iphone')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              deviceModel === 'iphone' 
                ? 'bg-[#0A84FF] text-white font-semibold shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            iPhone 15 Pro
          </button>
          <button
            onClick={() => setDeviceModel('ipad')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              deviceModel === 'ipad' 
                ? 'bg-[#0A84FF] text-white font-semibold shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            iPad Pro 12.9"
          </button>
          <button
            onClick={() => setDeviceModel('mac')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              deviceModel === 'mac' 
                ? 'bg-[#0A84FF] text-white font-semibold shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mac Studio / Desktop
          </button>
        </div>
      </div>

      {/* Screen Container */}
      <div className="flex justify-center">
        {deviceModel === 'iphone' && (
          <div className="w-[390px] h-[780px] bg-[#000000] rounded-[52px] p-3 border-[8px] border-[#2c2c2e] shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-white/20">
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 flex items-center justify-between px-3.5 border border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-[#30D158] animate-pulse"></div>
              <span className="text-[10px] font-mono text-zinc-400">dukicz-v8</span>
              <div className="w-3 h-3 rounded-full bg-blue-500/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]"></div>
              </div>
            </div>

            {/* iOS Top Status Bar */}
            <div className="flex items-center justify-between px-6 pt-2 pb-1 text-white text-xs font-semibold select-none z-40 mt-1">
              <span>9:41</span>
              <div className="flex items-center gap-2">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono">
                    {Math.round(fingerprint.battery.level * 100)}%
                  </span>
                  <Battery className="w-4 h-4 fill-current text-white" />
                </div>
              </div>
            </div>

            {/* iOS Safari Address Bar */}
            <div className="mt-7 px-3 py-2 bg-[#1c1c1e]/90 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-between gap-2 z-30 shadow-lg">
              <BookOpen className="w-4 h-4 text-zinc-400 shrink-0" />
              <div className="flex-1 flex items-center justify-center gap-1.5 bg-[#000000]/60 py-1.5 px-3 rounded-xl border border-white/5">
                <Lock className="w-3 h-3 text-[#30D158]" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunNavigate()}
                  className="bg-transparent text-xs font-mono text-white text-center focus:outline-none w-full truncate"
                />
              </div>
              <button 
                onClick={handleRunNavigate} 
                className="p-1.5 bg-[#0A84FF] rounded-xl text-white hover:bg-[#0071E3] transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isNavigating ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* iOS Render Screen Content */}
            <div className="flex-1 bg-[#121214] mt-2 rounded-2xl p-4 overflow-y-auto border border-white/5 space-y-4 text-xs font-sans">
              <div className="bg-[#1c1c1e] p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Example Domain</h3>
                  <span className="px-2 py-0.5 text-[9px] bg-[#30D158]/20 text-[#30D158] rounded-full font-mono">
                    iOS WebKit 200 OK
                  </span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination.
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Session: {fingerprint.sessionId.slice(0, 10)}...
                  </span>
                  <span className="text-[10px] text-[#64D2FF] font-mono">
                    Touch Points: {fingerprint.screen.maxTouchPoints}
                  </span>
                </div>
              </div>

              {/* Real-time iOS Inspection Segment */}
              <div className="bg-[#1c1c1e] rounded-xl p-3 border border-white/10 space-y-3">
                <div className="flex justify-between items-center bg-[#000000] p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => setActiveSegment('dom')}
                    className={`flex-1 py-1 text-[10px] font-semibold rounded-md transition-all ${
                      activeSegment === 'dom' ? 'bg-[#0A84FF] text-white' : 'text-zinc-400'
                    }`}
                  >
                    DOM
                  </button>
                  <button
                    onClick={() => setActiveSegment('network')}
                    className={`flex-1 py-1 text-[10px] font-semibold rounded-md transition-all ${
                      activeSegment === 'network' ? 'bg-[#0A84FF] text-white' : 'text-zinc-400'
                    }`}
                  >
                    Headers
                  </button>
                  <button
                    onClick={() => setActiveSegment('v8')}
                    className={`flex-1 py-1 text-[10px] font-semibold rounded-md transition-all ${
                      activeSegment === 'v8' ? 'bg-[#0A84FF] text-white' : 'text-zinc-400'
                    }`}
                  >
                    V8 JIT
                  </button>
                </div>

                {activeSegment === 'dom' && (
                  <div className="space-y-1 font-mono text-[11px] text-zinc-300 bg-[#000000] p-3 rounded-lg border border-white/5">
                    <div className="text-[#BF5AF2]">[Node #0] Document</div>
                    <div className="pl-3 text-[#FFD60A]">├── [Node #1] &lt;html lang="en"&gt;</div>
                    <div className="pl-6 text-[#64D2FF]">├── [Node #2] &lt;head&gt;</div>
                    <div className="pl-9 text-zinc-500">│   └── &lt;title&gt;Example Domain&lt;/title&gt;</div>
                    <div className="pl-6 text-[#30D158]">└── [Node #3] &lt;body class="ios-dark"&gt;</div>
                  </div>
                )}

                {activeSegment === 'network' && (
                  <div className="space-y-1.5 font-mono text-[10px] text-zinc-300 bg-[#000000] p-3 rounded-lg border border-white/5">
                    <div>
                      <span className="text-zinc-500">User-Agent: </span>
                      <span className="text-[#64D2FF] break-all">{fingerprint.uaProfile.userAgent}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Sec-Fetch-Site: </span>
                      <span className="text-[#30D158]">none</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Accept-Language: </span>
                      <span className="text-[#FFD60A]">{fingerprint.uaProfile.acceptLanguage}</span>
                    </div>
                  </div>
                )}

                {activeSegment === 'v8' && (
                  <div className="space-y-1 font-mono text-[10px] text-zinc-300 bg-[#000000] p-3 rounded-lg border border-white/5">
                    <div className="text-[#30D158]">✓ V8 Isolate Lock: Single LocalSet</div>
                    <div className="text-[#64D2FF]">✓ WebKit JIT Memory: 16 MB allocated</div>
                    <div className="text-zinc-400">✓ Canvas Noise Injection: Active</div>
                    <div className="text-zinc-400">✓ Audio Jitter: {fingerprint.audio.oscillatorFrequencyJitter} Hz</div>
                  </div>
                )}
              </div>
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="py-2 flex justify-center">
              <div className="w-32 h-1 bg-white/40 rounded-full"></div>
            </div>
          </div>
        )}

        {deviceModel === 'ipad' && (
          <div className="w-[680px] h-[520px] bg-[#000000] rounded-[32px] p-4 border-[6px] border-[#2c2c2e] shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-white/20">
            {/* iPad Top Status */}
            <div className="flex items-center justify-between px-4 pb-2 text-white text-xs font-semibold">
              <span>9:41 AM Mon Jul 21</span>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                <span className="text-[11px] font-mono">{Math.round(fingerprint.battery.level * 100)}%</span>
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* iPad Safari Top Controls Bar */}
            <div className="flex items-center gap-3 bg-[#1c1c1e] p-2.5 rounded-2xl border border-white/10 mb-3">
              <div className="flex items-center gap-2 text-zinc-400">
                <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-white" />
                <ChevronRight className="w-4 h-4 cursor-pointer hover:text-white" />
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 bg-[#000000] py-1.5 px-4 rounded-xl border border-white/10">
                <Lock className="w-3.5 h-3.5 text-[#30D158]" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="bg-transparent text-xs font-mono text-white focus:outline-none w-full text-center"
                />
              </div>
              <button onClick={handleRunNavigate} className="p-2 bg-[#0A84FF] text-white rounded-xl">
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* iPad Web View Area */}
            <div className="flex-1 bg-[#121214] rounded-2xl p-6 border border-white/10 overflow-y-auto space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">iPad OS Safari 17.5 Render Area</h2>
                <span className="px-3 py-1 bg-[#0A84FF]/20 text-[#64D2FF] font-mono text-xs rounded-full border border-[#0A84FF]/30">
                  GPU: {fingerprint.gpu.renderer}
                </span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Rendered with complete Apple Metal acceleration and touch pointer events.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[#1c1c1e] rounded-xl border border-white/10">
                  <div className="text-zinc-400 text-xs">Touch Points</div>
                  <div className="text-xl font-bold text-white font-mono">{fingerprint.screen.maxTouchPoints}</div>
                </div>
                <div className="p-4 bg-[#1c1c1e] rounded-xl border border-white/10">
                  <div className="text-zinc-400 text-xs">Device Memory</div>
                  <div className="text-xl font-bold text-[#64D2FF] font-mono">{fingerprint.uaProfile.deviceMemory} GB</div>
                </div>
                <div className="p-4 bg-[#1c1c1e] rounded-xl border border-white/10">
                  <div className="text-zinc-400 text-xs">Battery Level</div>
                  <div className="text-xl font-bold text-[#30D158] font-mono">{Math.round(fingerprint.battery.level * 100)}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {deviceModel === 'mac' && (
          <div className="w-full max-w-4xl bg-[#1c1c1e] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="bg-[#2c2c2e] px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
              </div>
              <div className="text-xs font-medium text-zinc-300 font-mono">Mac Studio / Sonoma Desktop Preview</div>
              <div className="w-12"></div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 bg-[#000000] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none"
                />
                <button
                  onClick={handleRunNavigate}
                  className="px-5 py-2.5 bg-[#0A84FF] text-white font-medium text-xs rounded-xl shadow-lg hover:bg-[#0071E3]"
                >
                  Navigate Page
                </button>
              </div>
              <div className="p-6 bg-[#000000] rounded-2xl border border-white/10 space-y-3">
                <h3 className="text-lg font-bold text-white">Full-Desktop macOS Headless Window</h3>
                <p className="text-zinc-400 text-xs">
                  Native macOS Sonoma execution window running headless Zig v0.14 with randomized GPU and V8 Isolates.
                </p>
                <div className="grid grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 bg-[#1c1c1e] rounded-xl border border-white/10 text-zinc-300">
                    Resolution: {fingerprint.screen.width}x{fingerprint.screen.height}
                  </div>
                  <div className="p-3 bg-[#1c1c1e] rounded-xl border border-white/10 text-[#30D158]">
                    WebGL GLSL: ES 3.0
                  </div>
                  <div className="p-3 bg-[#1c1c1e] rounded-xl border border-white/10 text-[#64D2FF]">
                    Cores: {fingerprint.uaProfile.hardwareConcurrency}
                  </div>
                  <div className="p-3 bg-[#1c1c1e] rounded-xl border border-white/10 text-[#BF5AF2]">
                    Audio Latency: {fingerprint.audio.baseLatency}s
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
