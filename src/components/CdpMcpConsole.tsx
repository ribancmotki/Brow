import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  Play, 
  Check, 
  Copy, 
  Activity, 
  Globe, 
  Search, 
  Filter, 
  X, 
  Clock, 
  ArrowDown, 
  FileText, 
  ShieldCheck, 
  Download, 
  RefreshCw 
} from 'lucide-react';
import { FingerprintProfile, NetworkRequest } from '../types';

interface CdpMcpConsoleProps {
  fingerprint: FingerprintProfile;
  urlInput: string;
}

export const CdpMcpConsole: React.FC<CdpMcpConsoleProps> = ({ fingerprint, urlInput }) => {
  const [activeTab, setActiveTab] = useState<'cdp' | 'mcp' | 'waterfall'>('waterfall');
  const [cdpMethod, setCdpMethod] = useState('Emulation.setDeviceMetricsOverride');
  const [cdpResponse, setCdpResponse] = useState<string | null>(null);

  const [mcpTool, setMcpTool] = useState('navigate');
  const [mcpResponse, setMcpResponse] = useState<string | null>(null);

  // Network Waterfall state
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>('req-1');
  const [activeInspectorTab, setActiveInspectorTab] = useState<'headers' | 'payload' | 'timing'>('headers');

  // Dynamic sample intercepted network requests based on current session fingerprint & URL
  const [requests, setRequests] = useState<NetworkRequest[]>([
    {
      id: 'req-1',
      url: urlInput,
      method: 'GET',
      status: 200,
      statusText: 'OK',
      type: 'document',
      mimeType: 'text/html',
      size: '18.4 KB',
      transferredSize: '4.8 KB (gzip)',
      startTime: 0,
      duration: 124,
      timing: {
        dns: 12,
        connect: 18,
        ssl: 24,
        send: 4,
        ttfb: 42,
        download: 24,
        total: 124
      },
      requestHeaders: {
        ':authority': urlInput.replace(/^https?:\/\//, ''),
        ':method': 'GET',
        ':path': '/',
        ':scheme': 'https',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': fingerprint.uaProfile.acceptLanguage,
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': fingerprint.uaProfile.userAgent
      },
      responseHeaders: {
        'alt-svc': 'h3=":443"; ma=2592000',
        'cache-control': 'max-age=604800',
        'content-encoding': 'gzip',
        'content-type': 'text/html; charset=UTF-8',
        'date': new Date().toUTCString(),
        'etag': '"3147526947+gzip"',
        'server': 'ECAcc (fra/41CE)',
        'strict-transport-security': 'max-age=31536000; includeSubDomains',
        'x-cache': 'HIT'
      },
      responsePayload: `<!doctype html>
<html>
<head>
    <title>Example Domain</title>
    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
        font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    </style>
</head>
<body>
<div>
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples in documents.</p>
</div>
</body>
</html>`
    },
    {
      id: 'req-2',
      url: `${urlInput.replace(/\/$/, '')}/styles/main.css`,
      method: 'GET',
      status: 200,
      statusText: 'OK',
      type: 'stylesheet',
      mimeType: 'text/css',
      size: '34.2 KB',
      transferredSize: '8.1 KB (br)',
      startTime: 48,
      duration: 86,
      timing: {
        dns: 0,
        connect: 0,
        ssl: 0,
        send: 2,
        ttfb: 36,
        download: 48,
        total: 86
      },
      requestHeaders: {
        ':authority': urlInput.replace(/^https?:\/\//, ''),
        ':method': 'GET',
        ':path': '/styles/main.css',
        ':scheme': 'https',
        'accept': 'text/css,*/*;q=0.1',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': fingerprint.uaProfile.acceptLanguage,
        'referer': urlInput,
        'sec-fetch-dest': 'style',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': fingerprint.uaProfile.userAgent
      },
      responseHeaders: {
        'cache-control': 'public, max-age=31536000, immutable',
        'content-encoding': 'br',
        'content-type': 'text/css; charset=utf-8',
        'server': 'cloudflare',
        'cf-ray': '89b21f92a10d9382-MAD'
      },
      responsePayload: `/* Main stylesheet */
:root {
  --primary-color: #0071e3;
  --bg-color: #000000;
  --text-color: #f5f5f7;
}
body {
  background: var(--bg-color);
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
}`
    },
    {
      id: 'req-3',
      url: `${urlInput.replace(/\/$/, '')}/js/app-v8.js`,
      method: 'GET',
      status: 200,
      statusText: 'OK',
      type: 'script',
      mimeType: 'application/javascript',
      size: '142.8 KB',
      transferredSize: '39.2 KB (br)',
      startTime: 62,
      duration: 164,
      timing: {
        dns: 0,
        connect: 0,
        ssl: 0,
        send: 3,
        ttfb: 58,
        download: 103,
        total: 164
      },
      requestHeaders: {
        ':authority': urlInput.replace(/^https?:\/\//, ''),
        ':method': 'GET',
        ':path': '/js/app-v8.js',
        ':scheme': 'https',
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': fingerprint.uaProfile.acceptLanguage,
        'referer': urlInput,
        'sec-fetch-dest': 'script',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': fingerprint.uaProfile.userAgent
      },
      responseHeaders: {
        'cache-control': 'public, max-age=31536000',
        'content-encoding': 'br',
        'content-type': 'application/javascript; charset=utf-8',
        'x-content-type-options': 'nosniff'
      },
      responsePayload: `// App execution script
(function() {
  console.log('dukicz iOS Native V8 WebKit App loaded successfully');
  window.__FINGERPRINT_SEED__ = ${fingerprint.canvas.noiseSeed};
})();`
    },
    {
      id: 'req-4',
      url: `${urlInput.replace(/\/$/, '')}/api/v1/session/verify`,
      method: 'POST',
      status: 200,
      statusText: 'OK',
      type: 'xhr',
      mimeType: 'application/json',
      size: '1.2 KB',
      transferredSize: '0.6 KB',
      startTime: 180,
      duration: 92,
      timing: {
        dns: 0,
        connect: 0,
        ssl: 0,
        send: 5,
        ttfb: 72,
        download: 15,
        total: 92
      },
      requestHeaders: {
        ':authority': urlInput.replace(/^https?:\/\//, ''),
        ':method': 'POST',
        ':path': '/api/v1/session/verify',
        ':scheme': 'https',
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
        'origin': urlInput,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': fingerprint.uaProfile.userAgent
      },
      responseHeaders: {
        'access-control-allow-origin': urlInput,
        'content-type': 'application/json; charset=utf-8',
        'x-session-id': fingerprint.sessionId
      },
      responsePayload: JSON.stringify({
        status: "authenticated",
        sessionId: fingerprint.sessionId,
        trustScore: 99.8,
        platform: fingerprint.uaProfile.platform,
        gpuVendor: fingerprint.gpu.vendor,
        maxTouchPoints: fingerprint.screen.maxTouchPoints
      }, null, 2)
    },
    {
      id: 'req-5',
      url: `${urlInput.replace(/\/$/, '')}/assets/logo.png`,
      method: 'GET',
      status: 200,
      statusText: 'OK',
      type: 'image',
      mimeType: 'image/png',
      size: '28.6 KB',
      transferredSize: '28.6 KB',
      startTime: 195,
      duration: 74,
      timing: {
        dns: 0,
        connect: 0,
        ssl: 0,
        send: 2,
        ttfb: 28,
        download: 44,
        total: 74
      },
      requestHeaders: {
        ':authority': urlInput.replace(/^https?:\/\//, ''),
        ':method': 'GET',
        ':path': '/assets/logo.png',
        ':scheme': 'https',
        'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'referer': urlInput,
        'sec-fetch-dest': 'image',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': fingerprint.uaProfile.userAgent
      },
      responseHeaders: {
        'cache-control': 'public, max-age=86400',
        'content-type': 'image/png'
      },
      responsePayload: '[Binary Image Data: PNG 512x512 32-bit RGBA]'
    },
    {
      id: 'req-6',
      url: `${urlInput.replace(/\/$/, '')}/fonts/SFProDisplay-Regular.woff2`,
      method: 'GET',
      status: 200,
      statusText: 'OK',
      type: 'font',
      mimeType: 'font/woff2',
      size: '84.1 KB',
      transferredSize: '84.1 KB',
      startTime: 110,
      duration: 112,
      timing: {
        dns: 0,
        connect: 0,
        ssl: 0,
        send: 3,
        ttfb: 45,
        download: 64,
        total: 112
      },
      requestHeaders: {
        ':authority': urlInput.replace(/^https?:\/\//, ''),
        ':method': 'GET',
        ':path': '/fonts/SFProDisplay-Regular.woff2',
        ':scheme': 'https',
        'accept': '*/*',
        'origin': urlInput,
        'sec-fetch-dest': 'font',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': fingerprint.uaProfile.userAgent
      },
      responseHeaders: {
        'cache-control': 'public, max-age=31536000, immutable',
        'content-type': 'font/woff2'
      },
      responsePayload: '[Binary WOFF2 Font Data]'
    }
  ]);

  const handleRunCdp = () => {
    let res = {};
    if (cdpMethod === 'Emulation.setDeviceMetricsOverride') {
      res = {
        id: 1,
        result: {
          width: fingerprint.screen.width,
          height: fingerprint.screen.height,
          deviceScaleFactor: fingerprint.screen.devicePixelRatio,
          mobile: fingerprint.uaProfile.platform === 'ios',
          screenOrientation: { type: fingerprint.screen.orientation, angle: 0 },
          viewport: { x: 0, y: 0, width: fingerprint.screen.width, height: fingerprint.screen.height, scale: 1 }
        }
      };
    } else if (cdpMethod === 'Emulation.setTouchEmulationEnabled') {
      res = {
        id: 2,
        result: {
          enabled: true,
          maxTouchPoints: fingerprint.screen.maxTouchPoints
        }
      };
    } else if (cdpMethod === 'Browser.getVersion') {
      res = {
        id: 3,
        result: {
          protocolVersion: "1.3",
          product: fingerprint.uaProfile.browser === 'safari' ? "Safari/605.1.15" : "Chrome/125.0.0.0",
          revision: "dukicz-zig-0.14-ios-v8",
          userAgent: fingerprint.uaProfile.userAgent,
          jsVersion: "V8/12.4.254"
        }
      };
    } else if (cdpMethod === 'Target.getTargets') {
      res = {
        id: 4,
        result: {
          targetInfos: [
            { targetId: "page-ios-1", type: "page", title: "Example Domain", url: urlInput, attached: true, canAccessOpener: false }
          ]
        }
      };
    } else if (cdpMethod === 'DOM.getDocument') {
      res = {
        id: 5,
        result: {
          root: {
            nodeId: 1,
            backendNodeId: 1,
            nodeType: 9,
            nodeName: "#document",
            documentURL: urlInput,
            children: [
              { nodeId: 2, nodeType: 1, nodeName: "HTML", children: [
                { nodeId: 3, nodeType: 1, nodeName: "HEAD" },
                { nodeId: 4, nodeType: 1, nodeName: "BODY" }
              ]}
            ]
          }
        }
      };
    } else {
      res = { id: 6, result: { status: "success", executed: cdpMethod } };
    }
    setCdpResponse(JSON.stringify(res, null, 2));
  };

  const handleRunMcp = () => {
    let res = {};
    if (mcpTool === 'navigate') {
      res = { content: [{ type: "text", text: `Navigated successfully to ${urlInput} with iOS UserAgent` }] };
    } else if (mcpTool === 'snapshot') {
      res = { content: [{ type: "text", text: `Root WebArea "Example Domain"\n  Heading "Example Domain" [level=1]\n  Paragraph "This domain is for use in illustrative examples..."\n  Link "More information..." [href=https://www.iana.org/domains/example]` }] };
    } else if (mcpTool === 'evaluate') {
      res = { content: [{ type: "text", text: JSON.stringify({ documentTitle: "Example Domain", touchPoints: fingerprint.screen.maxTouchPoints, memory: fingerprint.uaProfile.deviceMemory }) }] };
    } else {
      res = { content: [{ type: "text", text: `MCP Tool ${mcpTool} executed successfully.` }] };
    }
    setMcpResponse(JSON.stringify(res, null, 2));
  };

  const handleRefreshRequests = () => {
    const timestamp = Date.now();
    const newReqs = requests.map(r => ({
      ...r,
      id: `req-${timestamp}-${Math.floor(Math.random() * 1000)}`,
      duration: Math.floor(r.duration * (0.8 + Math.random() * 0.4)),
      timing: {
        ...r.timing,
        ttfb: Math.floor(r.timing.ttfb * (0.85 + Math.random() * 0.3)),
        download: Math.floor(r.timing.download * (0.85 + Math.random() * 0.3))
      }
    }));
    setRequests(newReqs);
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesType = filterType === 'all' || req.type === filterType;
    const matchesQuery = searchQuery === '' || 
      req.url.toLowerCase().includes(searchQuery.toLowerCase()) || 
      req.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.status.toString().includes(searchQuery);
    return matchesType && matchesQuery;
  });

  const selectedRequest = requests.find(r => r.id === selectedRequestId) || requests[0];

  // Calculate totals
  const maxTotalTime = Math.max(...requests.map(r => r.startTime + r.duration), 300);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Console Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 bg-[#1c1c1e] p-2 rounded-2xl border border-white/10 shadow-xl">
        <button
          onClick={() => setActiveTab('waterfall')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'waterfall' 
              ? 'bg-[#0A84FF] text-white shadow-lg shadow-blue-500/20' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          Network Request Waterfall
        </button>

        <button
          onClick={() => setActiveTab('cdp')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'cdp' 
              ? 'bg-[#0A84FF] text-white shadow-lg shadow-blue-500/20' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          CDP Commands Protocol
        </button>

        <button
          onClick={() => setActiveTab('mcp')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'mcp' 
              ? 'bg-[#0A84FF] text-white shadow-lg shadow-blue-500/20' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          MCP Tool Inspector
        </button>
      </div>

      {/* Network Waterfall Visualization Tool */}
      {activeTab === 'waterfall' && (
        <div className="space-y-4">
          {/* Top Filter & Toolbar */}
          <div className="bg-[#1c1c1e] p-4 rounded-2xl border border-white/10 shadow-xl space-y-3">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#30D158]" />
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Intercepted Browser Network Traffic</h3>
                  <p className="text-xs text-zinc-400">
                    Real-time network timeline, TLS negotiation, request/response headers, and payloads under iOS spoofing.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefreshRequests}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white text-xs font-medium rounded-xl border border-white/10 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Re-capture Traffic
                </button>
              </div>
            </div>

            {/* Filter Pills & Search Input */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1 bg-[#000000] p-1 rounded-xl border border-white/10 text-xs font-mono">
                {['all', 'document', 'script', 'stylesheet', 'xhr', 'image', 'font'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1 rounded-lg capitalize transition-all ${
                      filterType === t 
                        ? 'bg-[#0A84FF] text-white font-bold shadow-sm' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter URL, Method or Status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#000000] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
                />
              </div>
            </div>
          </div>

          {/* Main Network Table & Inspector Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Waterfall List Table */}
            <div className={`bg-[#1c1c1e] rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col ${selectedRequest ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
              <div className="p-3 bg-[#121214] border-b border-white/10 grid grid-cols-12 text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                <div className="col-span-4 truncate">Name / URL</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2 text-right pr-2">Size</div>
                <div className="col-span-3 text-right">Waterfall ({maxTotalTime}ms)</div>
              </div>

              <div className="divide-y divide-white/5 max-h-[480px] overflow-y-auto">
                {filteredRequests.map((req) => {
                  const isSelected = selectedRequest?.id === req.id;
                  const leftPercent = (req.startTime / maxTotalTime) * 100;
                  const widthPercent = Math.max((req.duration / maxTotalTime) * 100, 2);

                  return (
                    <div
                      key={req.id}
                      onClick={() => setSelectedRequestId(req.id)}
                      className={`p-3 grid grid-cols-12 items-center text-xs font-mono cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#0A84FF]/20 border-l-4 border-l-[#0A84FF] text-white' 
                          : 'hover:bg-white/5 text-zinc-300'
                      }`}
                    >
                      <div className="col-span-4 flex items-center gap-2 truncate pr-2">
                        <span className="px-1.5 py-0.5 text-[9px] bg-[#2c2c2e] text-[#64D2FF] font-bold rounded">
                          {req.method}
                        </span>
                        <span className="truncate text-zinc-200" title={req.url}>
                          {req.url.replace(/^https?:\/\/[^\/]+/, '') || req.url}
                        </span>
                      </div>

                      <div className="col-span-1">
                        <span className="px-1.5 py-0.5 text-[9px] bg-[#30D158]/20 text-[#30D158] rounded font-bold">
                          {req.status}
                        </span>
                      </div>

                      <div className="col-span-2 text-zinc-400 capitalize text-[11px] truncate">
                        {req.type}
                      </div>

                      <div className="col-span-2 text-right pr-2 text-zinc-400 text-[11px]">
                        {req.size}
                      </div>

                      {/* Waterfall timing bar */}
                      <div className="col-span-3 relative h-3 bg-[#000000] rounded-full overflow-hidden border border-white/5 my-auto">
                        <div
                          className="absolute h-full rounded-full transition-all"
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            background: req.type === 'document' 
                              ? '#0A84FF' 
                              : req.type === 'script' 
                              ? '#FF9F0A' 
                              : req.type === 'stylesheet' 
                              ? '#BF5AF2' 
                              : req.type === 'xhr' 
                              ? '#30D158' 
                              : '#64D2FF'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Waterfall Footer Summary */}
              <div className="p-3 bg-[#121214] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>{filteredRequests.length} requests</span>
                <span>Transferred: 137.5 KB</span>
                <span>Finish: {maxTotalTime} ms</span>
              </div>
            </div>

            {/* Request Inspector Panel */}
            {selectedRequest && (
              <div className="lg:col-span-5 bg-[#1c1c1e] rounded-2xl border border-white/10 shadow-xl p-4 flex flex-col space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <FileText className="w-4 h-4 text-[#0A84FF] shrink-0" />
                    <span className="text-xs font-bold font-mono text-white truncate">
                      {selectedRequest.url}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedRequestId(null)}
                    className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Inspector Tab Buttons */}
                <div className="flex bg-[#000000] p-1 rounded-xl border border-white/10 text-xs font-mono">
                  <button
                    onClick={() => setActiveInspectorTab('headers')}
                    className={`flex-1 py-1.5 text-center rounded-lg transition-all ${
                      activeInspectorTab === 'headers' ? 'bg-[#0A84FF] text-white font-bold' : 'text-zinc-400'
                    }`}
                  >
                    Headers
                  </button>
                  <button
                    onClick={() => setActiveInspectorTab('payload')}
                    className={`flex-1 py-1.5 text-center rounded-lg transition-all ${
                      activeInspectorTab === 'payload' ? 'bg-[#0A84FF] text-white font-bold' : 'text-zinc-400'
                    }`}
                  >
                    Response
                  </button>
                  <button
                    onClick={() => setActiveInspectorTab('timing')}
                    className={`flex-1 py-1.5 text-center rounded-lg transition-all ${
                      activeInspectorTab === 'timing' ? 'bg-[#0A84FF] text-white font-bold' : 'text-zinc-400'
                    }`}
                  >
                    Timing
                  </button>
                </div>

                {/* Tab 1: Headers */}
                {activeInspectorTab === 'headers' && (
                  <div className="space-y-4 max-h-[380px] overflow-y-auto text-xs font-mono pr-1">
                    {/* General */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">General Info</div>
                      <div className="p-2.5 bg-[#000000] rounded-xl border border-white/5 space-y-1">
                        <div><span className="text-zinc-500">Request URL:</span> <span className="text-white break-all">{selectedRequest.url}</span></div>
                        <div><span className="text-zinc-500">Request Method:</span> <span className="text-[#64D2FF]">{selectedRequest.method}</span></div>
                        <div><span className="text-zinc-500">Status Code:</span> <span className="text-[#30D158]">{selectedRequest.status} {selectedRequest.statusText}</span></div>
                        <div><span className="text-zinc-500">Resource Type:</span> <span className="text-zinc-300">{selectedRequest.type}</span></div>
                      </div>
                    </div>

                    {/* Response Headers */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Response Headers</div>
                      <div className="p-2.5 bg-[#000000] rounded-xl border border-white/5 space-y-1">
                        {Object.entries(selectedRequest.responseHeaders).map(([k, v]) => (
                          <div key={k} className="flex flex-wrap gap-1">
                            <span className="text-[#BF5AF2]">{k}:</span>
                            <span className="text-zinc-300 break-all">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Request Headers */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Request Headers</div>
                      <div className="p-2.5 bg-[#000000] rounded-xl border border-white/5 space-y-1">
                        {Object.entries(selectedRequest.requestHeaders).map(([k, v]) => (
                          <div key={k} className="flex flex-wrap gap-1">
                            <span className="text-[#0A84FF]">{k}:</span>
                            <span className="text-zinc-300 break-all">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Response Payload */}
                {activeInspectorTab === 'payload' && (
                  <div className="flex-1 max-h-[380px] flex flex-col space-y-2">
                    <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                      <span>MIME: {selectedRequest.mimeType}</span>
                      <span>Size: {selectedRequest.size}</span>
                    </div>
                    <pre className="flex-1 bg-[#000000] p-3 rounded-xl text-xs font-mono text-[#30D158] overflow-auto border border-white/10 min-h-[280px]">
                      {selectedRequest.responsePayload}
                    </pre>
                  </div>
                )}

                {/* Tab 3: Timing Breakdown */}
                {activeInspectorTab === 'timing' && (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto text-xs font-mono">
                    <div className="p-3 bg-[#000000] rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-zinc-400">DNS Lookup:</span>
                        <span className="text-white font-semibold">{selectedRequest.timing.dns} ms</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-zinc-400">TCP Handshake:</span>
                        <span className="text-white font-semibold">{selectedRequest.timing.connect} ms</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-zinc-400">TLS/SSL Negotiation:</span>
                        <span className="text-[#BF5AF2] font-semibold">{selectedRequest.timing.ssl} ms</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-zinc-400">Request Sent:</span>
                        <span className="text-white font-semibold">{selectedRequest.timing.send} ms</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-zinc-400">Waiting (TTFB):</span>
                        <span className="text-[#FF9F0A] font-semibold">{selectedRequest.timing.ttfb} ms</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-400">Content Download:</span>
                        <span className="text-[#30D158] font-semibold">{selectedRequest.timing.download} ms</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#000000] rounded-xl border border-white/5 flex justify-between items-center">
                      <span className="text-zinc-300 font-bold">Total Request Latency:</span>
                      <span className="text-[#64D2FF] font-bold text-sm">{selectedRequest.timing.total} ms</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CDP Mode */}
      {activeTab === 'cdp' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-xl space-y-4">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
              CDP Method Domain
            </label>
            <select
              value={cdpMethod}
              onChange={(e) => setCdpMethod(e.target.value)}
              className="w-full bg-[#000000] border border-white/10 rounded-xl p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            >
              <option value="Emulation.setDeviceMetricsOverride">1. Emulation.setDeviceMetricsOverride (iOS)</option>
              <option value="Emulation.setTouchEmulationEnabled">2. Emulation.setTouchEmulationEnabled</option>
              <option value="Browser.getVersion">3. Browser.getVersion</option>
              <option value="Target.getTargets">4. Target.getTargets</option>
              <option value="DOM.getDocument">5. DOM.getDocument</option>
              <option value="LP.getMarkdown">6. LP.getMarkdown</option>
            </select>

            <button
              onClick={handleRunCdp}
              className="w-full py-2.5 bg-[#0A84FF] hover:bg-[#0071E3] text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Dispatch CDP Command
            </button>
          </div>

          <div className="col-span-2 p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-xl flex flex-col">
            <div className="text-xs font-mono text-zinc-400 mb-3">CDP Response Payload (JSON-RPC 2.0)</div>
            <pre className="flex-1 bg-[#000000] p-4 rounded-xl text-xs font-mono text-[#30D158] overflow-x-auto border border-white/10 min-h-[260px]">
              {cdpResponse || '// Response will appear here after dispatching command'}
            </pre>
          </div>
        </div>
      )}

      {/* MCP Mode */}
      {activeTab === 'mcp' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-xl space-y-4">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
              MCP AI Agent Tool
            </label>
            <select
              value={mcpTool}
              onChange={(e) => setMcpTool(e.target.value)}
              className="w-full bg-[#000000] border border-white/10 rounded-xl p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            >
              <option value="navigate">1. navigate</option>
              <option value="snapshot">2. snapshot</option>
              <option value="evaluate">3. evaluate</option>
              <option value="get_markdown">4. get_markdown</option>
              <option value="click">5. click</option>
              <option value="type">6. type</option>
            </select>

            <button
              onClick={handleRunMcp}
              className="w-full py-2.5 bg-[#0A84FF] hover:bg-[#0071E3] text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Invoke MCP Tool
            </button>
          </div>

          <div className="col-span-2 p-5 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-xl flex flex-col">
            <div className="text-xs font-mono text-zinc-400 mb-3">MCP Result Payload</div>
            <pre className="flex-1 bg-[#000000] p-4 rounded-xl text-xs font-mono text-[#64D2FF] overflow-x-auto border border-white/10 min-h-[260px]">
              {mcpResponse || '// MCP result payload will appear here after tool invocation'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
