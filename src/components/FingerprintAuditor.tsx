import React, { useState } from 'react';
import { 
  RefreshCw, 
  ShieldCheck, 
  Cpu, 
  Maximize2, 
  Volume2, 
  Battery, 
  Smartphone, 
  Check, 
  Copy, 
  Sparkles, 
  Sliders, 
  Eye, 
  Activity, 
  Radio, 
  Layers, 
  FileCode,
  Zap
} from 'lucide-react';
import { FingerprintProfile, UserAgentProfile } from '../types';
import { USER_AGENT_PROFILES } from '../lib/fingerprint';

interface FingerprintAuditorProps {
  fingerprint: FingerprintProfile;
  onRandomize: (profileOverride?: UserAgentProfile) => void;
}

export const FingerprintAuditor: React.FC<FingerprintAuditorProps> = ({
  fingerprint,
  onRandomize
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(fingerprint.uaProfile.id);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(fingerprint, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProfileSelect = (profId: string) => {
    setSelectedProfileId(profId);
    const prof = USER_AGENT_PROFILES.find(p => p.id === profId);
    if (prof) {
      onRandomize(prof);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#1c1c1e] p-5 rounded-2xl border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0A84FF]" />
            <h2 className="text-lg font-bold text-white tracking-tight">Dynamic Session Fingerprint Generator</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Generates authentic, zero-detection randomized fingerprints for GPU, Canvas, WebAudio, Battery, Screen & Sensors per session.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onRandomize()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0A84FF] to-[#0056B3] hover:brightness-110 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            Randomize Session Now
          </button>
          <button
            onClick={handleCopyJson}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white font-medium text-xs rounded-xl border border-white/10 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-[#30D158]" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied JSON' : 'Export Payload'}
          </button>
        </div>
      </div>

      {/* Preset Profile Switcher Pills */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
          Select User Agent Profile Base:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {USER_AGENT_PROFILES.map((prof) => {
            const isSelected = prof.id === fingerprint.uaProfile.id;
            return (
              <button
                key={prof.id}
                onClick={() => handleProfileSelect(prof.id)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-white shadow-md' 
                    : 'bg-[#1c1c1e] border-white/10 text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-white truncate">{prof.name}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#0A84FF] animate-pulse"></span>}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 truncate">
                  {prof.platform.toUpperCase()} • {prof.browser.toUpperCase()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Fingerprint Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* 1. WebGL & GPU */}
        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#0A84FF]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">WebGL GPU Hardware</h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-[#30D158]/15 text-[#30D158] rounded-full">
              Real Driver Spoofed
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Unmasked Vendor:</span>
              <span className="text-white font-medium">{fingerprint.gpu.vendor}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Unmasked Renderer:</span>
              <span className="text-[#64D2FF] font-semibold">{fingerprint.gpu.renderer}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">GLSL Version:</span>
              <span className="text-zinc-300">{fingerprint.gpu.glslVersion}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Max Texture Size:</span>
              <span className="text-zinc-300">{fingerprint.gpu.maxTextureSize} px</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-400">Extensions Hash:</span>
              <span className="text-[#BF5AF2]">{fingerprint.gpu.extensionsHash} ({fingerprint.gpu.extensionsCount} ext)</span>
            </div>
          </div>
        </div>

        {/* 2. Canvas 2D Noise */}
        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#FF9F0A]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Canvas 2D Context Noise</h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-[#FF9F0A]/15 text-[#FF9F0A] rounded-full">
              Random Seeded
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Canvas Data Hash:</span>
              <span className="text-[#FF9F0A] font-semibold">{fingerprint.canvas.dataUrlHash}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Noise Seed:</span>
              <span className="text-zinc-300">{fingerprint.canvas.noiseSeed}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Rendering Offset:</span>
              <span className="text-zinc-300">{fingerprint.canvas.renderingOffset} px</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Text Baseline Jitter:</span>
              <span className="text-zinc-300">{fingerprint.canvas.textBaselineNoise} px</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-400">Blend Mode Parity:</span>
              <span className="text-[#30D158]">{fingerprint.canvas.blendModeParity}</span>
            </div>
          </div>
        </div>

        {/* 3. WebAudio Fingerprint */}
        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#BF5AF2]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">WebAudio Context Synthesis</h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-[#BF5AF2]/15 text-[#BF5AF2] rounded-full">
              Audio Node Jitter
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Audio Buffer Hash:</span>
              <span className="text-[#BF5AF2] font-semibold">{fingerprint.audio.audioBufferHash}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Sample Rate:</span>
              <span className="text-zinc-300">{fingerprint.audio.sampleRate} Hz</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Oscillator Jitter:</span>
              <span className="text-zinc-300">{fingerprint.audio.oscillatorFrequencyJitter} Hz</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Base Latency:</span>
              <span className="text-zinc-300">{fingerprint.audio.baseLatency} s</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-400">Compressor Hash:</span>
              <span className="text-zinc-300">{fingerprint.audio.dynamicsCompressorHash}</span>
            </div>
          </div>
        </div>

        {/* 4. Battery & Power API */}
        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-[#30D158]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Battery & Power State</h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-[#30D158]/15 text-[#30D158] rounded-full">
              Dynamic Randomized
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Battery Level:</span>
              <span className="text-[#30D158] font-bold">{Math.round(fingerprint.battery.level * 100)}%</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Charging State:</span>
              <span className="text-zinc-300">{fingerprint.battery.charging ? 'Plugged In (AC)' : 'Discharging (Battery)'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Charging Time:</span>
              <span className="text-zinc-300">{fingerprint.battery.chargingTime} seconds</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-400">Discharging Time:</span>
              <span className="text-zinc-300">{fingerprint.battery.dischargingTime} seconds</span>
            </div>
          </div>
        </div>

        {/* 5. Screen & Viewport */}
        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#64D2FF]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Screen & Touch Viewport</h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-[#64D2FF]/15 text-[#64D2FF] rounded-full">
              {fingerprint.screen.orientation}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Screen Resolution:</span>
              <span className="text-white font-medium">{fingerprint.screen.width} x {fingerprint.screen.height}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Device Pixel Ratio:</span>
              <span className="text-[#64D2FF] font-bold">{fingerprint.screen.devicePixelRatio}x Super Retina</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Max Touch Points:</span>
              <span className="text-zinc-300">{fingerprint.screen.maxTouchPoints} points</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-400">Color / Pixel Depth:</span>
              <span className="text-zinc-300">{fingerprint.screen.colorDepth}-bit</span>
            </div>
          </div>
        </div>

        {/* 6. WebRTC Candidates */}
        <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#30D158]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">WebRTC & IP Candidate</h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-[#30D158]/15 text-[#30D158] rounded-full">
              STUN Masked
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Local IP Candidate:</span>
              <span className="text-[#30D158] font-semibold">{fingerprint.webRtc.localIpCandidate}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Media Devices Hash:</span>
              <span className="text-zinc-300">{fingerprint.webRtc.mediaDevicesHash}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">Audio Inputs / Outputs:</span>
              <span className="text-zinc-300">{fingerprint.webRtc.audioInputsCount} in / {fingerprint.webRtc.audioOutputsCount} out</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-400">Video Cameras:</span>
              <span className="text-zinc-300">{fingerprint.webRtc.videoInputsCount} active lens</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
