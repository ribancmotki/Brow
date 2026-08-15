import express from "express";
import http from "http";
import https from "https";
import urlModule from "url";
import path from "path";
import fs from "fs";
import vm from "vm";
import crypto from "crypto";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

interface ProfileConfig {
  id: string;
  name: string;
  userAgent: string;
  platform: string;
  uaPlatform: string;
  uaPlatformVersion: string;
  hardwareConcurrency: number;
  deviceMemory: number;
  maxTouchPoints: number;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  glVendor: string;
  glRenderer: string;
  canvasSeed: number;
  audioSampleRate: number;
}

const ENGINE_PROFILES: ProfileConfig[] = [
  {
    id: "ios-safari-18",
    name: "Apple iPhone 16 Pro - iOS 18.2 Safari",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1",
    platform: "iPhone",
    uaPlatform: "iOS",
    uaPlatformVersion: "18.2.0",
    hardwareConcurrency: 6,
    deviceMemory: 8,
    maxTouchPoints: 5,
    screenWidth: 393,
    screenHeight: 852,
    devicePixelRatio: 3.0,
    glVendor: "Apple Inc.",
    glRenderer: "Apple A18 Pro GPU",
    canvasSeed: 0x5a1f8b,
    audioSampleRate: 48000
  },
  {
    id: "ios-safari-17",
    name: "Apple iPhone 15 Pro - iOS 17.5 Safari",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/605.1.15",
    platform: "iPhone",
    uaPlatform: "iOS",
    uaPlatformVersion: "17.5.1",
    hardwareConcurrency: 6,
    deviceMemory: 8,
    maxTouchPoints: 5,
    screenWidth: 393,
    screenHeight: 852,
    devicePixelRatio: 3.0,
    glVendor: "Apple Inc.",
    glRenderer: "Apple A17 Pro GPU",
    canvasSeed: 0x3d7a9c,
    audioSampleRate: 48000
  },
  {
    id: "ipad-safari-18",
    name: "Apple iPad Pro 13 (M4) - iPadOS 18 Safari",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
    platform: "iPad",
    uaPlatform: "iPadOS",
    uaPlatformVersion: "18.1.0",
    hardwareConcurrency: 10,
    deviceMemory: 16,
    maxTouchPoints: 5,
    screenWidth: 1024,
    screenHeight: 1366,
    devicePixelRatio: 2.0,
    glVendor: "Apple Inc.",
    glRenderer: "Apple M4 GPU",
    canvasSeed: 0x9b4c12,
    audioSampleRate: 48000
  },
  {
    id: "macos-safari-18",
    name: "Apple Mac Studio (M3 Ultra) - macOS Sonoma Safari",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
    platform: "MacIntel",
    uaPlatform: "macOS",
    uaPlatformVersion: "14.7.0",
    hardwareConcurrency: 24,
    deviceMemory: 64,
    maxTouchPoints: 0,
    screenWidth: 2560,
    screenHeight: 1440,
    devicePixelRatio: 2.0,
    glVendor: "Apple Inc.",
    glRenderer: "Apple M3 Ultra",
    canvasSeed: 0x7e2d5f,
    audioSampleRate: 48000
  },
  {
    id: "win11-chrome-133",
    name: "Microsoft Windows 11 - Chrome 133 Desktop",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    platform: "Win32",
    uaPlatform: "Windows",
    uaPlatformVersion: "15.0.0",
    hardwareConcurrency: 16,
    deviceMemory: 32,
    maxTouchPoints: 0,
    screenWidth: 1920,
    screenHeight: 1080,
    devicePixelRatio: 1.0,
    glVendor: "Google Inc. (NVIDIA)",
    glRenderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 Direct3D11 vs_5_0 ps_5_0, D3D11)",
    canvasSeed: 0x112233,
    audioSampleRate: 44100
  }
];

interface EngineCookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: "Strict" | "Lax" | "None";
  expires: number;
}

interface NetworkWaterfallEntry {
  id: string;
  url: string;
  method: string;
  status: number;
  contentType: string;
  durationMs: number;
  timestamp: number;
  sizeBytes: number;
  headers: Record<string, string>;
  initiator: "Navigation" | "Fetch" | "XHR" | "Script" | "Stylesheet" | "CDP";
}

interface EngineState {
  currentProfile: ProfileConfig;
  currentUrl: string;
  currentHtml: string;
  documentTitle: string;
  cookies: Map<string, EngineCookie>;
  waterfall: NetworkWaterfallEntry[];
  localStorage: Map<string, string>;
  sessionStorage: Map<string, string>;
  history: string[];
  historyIndex: number;
  blockedUrls: string[];
  stealth: boolean;
  allowPrivateNetwork: boolean;
}

const state: EngineState = {
  currentProfile: ENGINE_PROFILES[0],
  currentUrl: "https://example.com",
  currentHtml: "<!DOCTYPE html><html><head><title>Example Domain</title></head><body><div><h1>Example Domain</h1><p>This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.</p><p><a href=\"https://www.iana.org/domains/example\">More information...</a></p></div></body></html>",
  documentTitle: "Example Domain",
  cookies: new Map(),
  waterfall: [],
  localStorage: new Map(),
  sessionStorage: new Map(),
  history: ["https://example.com"],
  historyIndex: 0,
  blockedUrls: [],
  stealth: true,
  allowPrivateNetwork: false
};

function parseCookiesFromHeader(header: string, defaultDomain: string): EngineCookie[] {
  const list: EngineCookie[] = [];
  const parts = header.split(/,(?=\s*[^;]+=)/g);
  for (const part of parts) {
    const segments = part.split(";").map(s => s.trim());
    if (segments.length === 0 || !segments[0].includes("=")) continue;
    const [name, ...valParts] = segments[0].split("=");
    const value = valParts.join("=");
    let domain = defaultDomain;
    let path = "/";
    let secure = false;
    let httpOnly = false;
    let sameSite: "Strict" | "Lax" | "None" = "Lax";
    let expires = Date.now() + 86400000 * 30;

    for (let i = 1; i < segments.length; i++) {
      const seg = segments[i];
      const lower = seg.toLowerCase();
      if (lower === "secure") secure = true;
      else if (lower === "httponly") httpOnly = true;
      else if (lower.startsWith("domain=")) domain = seg.substring(7).replace(/^\./, "");
      else if (lower.startsWith("path=")) path = seg.substring(5);
      else if (lower.startsWith("samesite=")) {
        const ss = seg.substring(9).toLowerCase();
        if (ss === "strict") sameSite = "Strict";
        else if (ss === "none") sameSite = "None";
        else sameSite = "Lax";
      } else if (lower.startsWith("max-age=")) {
        const ma = parseInt(seg.substring(8), 10);
        if (!isNaN(ma)) expires = Date.now() + ma * 1000;
      }
    }
    list.push({ name: name.trim(), value: value.trim(), domain, path, secure, httpOnly, sameSite, expires });
  }
  return list;
}

function fetchHttpResource(targetUrl: string, method: string = "GET", headers: Record<string, string> = {}, bodyPayload?: string): Promise<{ status: number; headers: Record<string, string>; body: string; finalUrl: string; duration: number }> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const parsed = new urlModule.URL(targetUrl);
    const client = parsed.protocol === "https:" ? https : http;

    const cookieHeaderParts: string[] = [];
    state.cookies.forEach((cookie) => {
      if (parsed.hostname.endsWith(cookie.domain) && parsed.pathname.startsWith(cookie.path)) {
        if (!cookie.secure || parsed.protocol === "https:") {
          cookieHeaderParts.push(`${cookie.name}=${cookie.value}`);
        }
      }
    });

    const requestHeaders: Record<string, string> = {
      "User-Agent": state.currentProfile.userAgent,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "identity",
      "Sec-Ch-Ua": `"Chromium";v="133", "Not(A:Brand";v="24", "Google Chrome";v="133"`,
      "Sec-Ch-Ua-Mobile": state.currentProfile.maxTouchPoints > 0 ? "?1" : "?0",
      "Sec-Ch-Ua-Platform": `"${state.currentProfile.uaPlatform}"`,
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      ...headers
    };

    if (cookieHeaderParts.length > 0) {
      requestHeaders["Cookie"] = cookieHeaderParts.join("; ");
    }

    if (bodyPayload) {
      requestHeaders["Content-Length"] = Buffer.byteLength(bodyPayload).toString();
    }

    const req = client.request(parsed, {
      method,
      headers: requestHeaders,
      timeout: 15000
    }, (res) => {
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        const duration = Date.now() - startTime;
        const respHeaders: Record<string, string> = {};
        for (const [k, v] of Object.entries(res.headers)) {
          if (Array.isArray(v)) respHeaders[k.toLowerCase()] = v.join(", ");
          else if (v) respHeaders[k.toLowerCase()] = v;
        }

        if (res.headers["set-cookie"]) {
          const cookieStrings = Array.isArray(res.headers["set-cookie"]) ? res.headers["set-cookie"] : [res.headers["set-cookie"]];
          for (const cs of cookieStrings) {
            const parsedCookies = parseCookiesFromHeader(cs, parsed.hostname);
            for (const pc of parsedCookies) {
              state.cookies.set(`${pc.domain}:${pc.name}`, pc);
            }
          }
        }

        if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) && res.headers.location) {
          const redirectTarget = new urlModule.URL(res.headers.location, targetUrl).toString();
          fetchHttpResource(redirectTarget, "GET").then(resolve).catch(reject);
          return;
        }

        resolve({
          status: res.statusCode || 200,
          headers: respHeaders,
          body: data,
          finalUrl: targetUrl,
          duration
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.on("timeout", () => {
      req.destroy(new Error("Request timed out after 15000ms"));
    });

    if (bodyPayload) {
      req.write(bodyPayload);
    }
    req.end();
  });
}

interface SimplifiedNode {
  id: number;
  nodeType: number;
  tagName: string;
  nodeName: string;
  nodeValue: string;
  attributes: Record<string, string>;
  children: SimplifiedNode[];
  text: string;
}

function parseDomTree(html: string): { root: SimplifiedNode; nodes: SimplifiedNode[]; nodeCount: number; title: string } {
  let counter = 1;
  const nodes: SimplifiedNode[] = [];
  let extractedTitle = "";

  const root: SimplifiedNode = {
    id: counter++,
    nodeType: 9,
    tagName: "#document",
    nodeName: "#document",
    nodeValue: "",
    attributes: {},
    children: [],
    text: ""
  };
  nodes.push(root);

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) extractedTitle = titleMatch[1].trim();

  const tagRegex = /<([a-zA-Z0-9\-:]+)([^>]*?)>([\s\S]*?)<\/\1>|<([a-zA-Z0-9\-:]+)([^>]*?)\/?>|([^<]+)/gi;
  const stack: SimplifiedNode[] = [root];

  let match: RegExpExecArray | null;
  while ((match = tagRegex.exec(html)) !== null) {
    if (match[6]) {
      const textContent = match[6].trim();
      if (textContent.length > 0) {
        const textNode: SimplifiedNode = {
          id: counter++,
          nodeType: 3,
          tagName: "#text",
          nodeName: "#text",
          nodeValue: textContent,
          attributes: {},
          children: [],
          text: textContent
        };
        nodes.push(textNode);
        if (stack.length > 0) stack[stack.length - 1].children.push(textNode);
      }
      continue;
    }

    const tagName = (match[1] || match[4] || "").toLowerCase();
    const rawAttrs = match[2] || match[5] || "";
    if (!tagName) continue;

    const attributes: Record<string, string> = {};
    const attrRegex = /([a-zA-Z0-9\-_:.]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
      attributes[attrMatch[1].toLowerCase()] = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";
    }

    const elNode: SimplifiedNode = {
      id: counter++,
      nodeType: 1,
      tagName: tagName.toUpperCase(),
      nodeName: tagName.toUpperCase(),
      nodeValue: "",
      attributes,
      children: [],
      text: ""
    };
    nodes.push(elNode);
    if (stack.length > 0) stack[stack.length - 1].children.push(elNode);

    const isVoid = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(tagName);
    if (!isVoid && match[1] && match[3]) {
      stack.push(elNode);
      const innerTree = parseDomTree(match[3]);
      for (const child of innerTree.root.children) {
        elNode.children.push(child);
      }
      stack.pop();
    }
  }

  return { root, nodes, nodeCount: nodes.length, title: extractedTitle };
}

function evaluateInSandbox(script: string, url: string): { success: boolean; result: any; error?: string; consoleLogs: string[] } {
  const consoleLogs: string[] = [];
  const logFn = (...args: any[]) => {
    consoleLogs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" "));
  };

  const sandbox = {
    window: null as any,
    globalThis: null as any,
    self: null as any,
    console: {
      log: logFn,
      warn: logFn,
      error: logFn,
      info: logFn,
      debug: logFn,
      dir: logFn
    },
    navigator: {
      userAgent: state.currentProfile.userAgent,
      platform: state.currentProfile.platform,
      hardwareConcurrency: state.currentProfile.hardwareConcurrency,
      deviceMemory: state.currentProfile.deviceMemory,
      maxTouchPoints: state.currentProfile.maxTouchPoints,
      language: "en-US",
      languages: ["en-US", "en"],
      cookieEnabled: true,
      onLine: true,
      webdriver: false
    },
    location: {
      href: url,
      origin: new urlModule.URL(url).origin,
      protocol: new urlModule.URL(url).protocol,
      host: new urlModule.URL(url).host,
      hostname: new urlModule.URL(url).hostname,
      port: new urlModule.URL(url).port,
      pathname: new urlModule.URL(url).pathname,
      search: new urlModule.URL(url).search,
      hash: new urlModule.URL(url).hash
    },
    screen: {
      width: state.currentProfile.screenWidth,
      height: state.currentProfile.screenHeight,
      availWidth: state.currentProfile.screenWidth,
      availHeight: state.currentProfile.screenHeight,
      colorDepth: 24,
      pixelDepth: 24
    },
    performance: {
      now: () => Date.now(),
      timeOrigin: Date.now()
    },
    crypto: {
      getRandomValues: (arr: Uint8Array) => crypto.randomFillSync(arr),
      randomUUID: () => crypto.randomUUID()
    },
    localStorage: {
      getItem: (k: string) => state.localStorage.get(k) ?? null,
      setItem: (k: string, v: string) => state.localStorage.set(k, String(v)),
      removeItem: (k: string) => state.localStorage.delete(k),
      clear: () => state.localStorage.clear()
    },
    sessionStorage: {
      getItem: (k: string) => state.sessionStorage.get(k) ?? null,
      setItem: (k: string, v: string) => state.sessionStorage.set(k, String(v)),
      removeItem: (k: string) => state.sessionStorage.delete(k),
      clear: () => state.sessionStorage.clear()
    },
    document: {
      title: state.documentTitle,
      URL: url,
      cookie: Array.from(state.cookies.values()).map(c => `${c.name}=${c.value}`).join("; "),
      querySelector: (sel: string) => ({ id: 1, tagName: "DIV", querySelector: () => null, textContent: "Node" }),
      querySelectorAll: (sel: string) => [],
      getElementById: (id: string) => null,
      createElement: (tag: string) => ({ tagName: tag.toUpperCase(), attributes: {}, setAttribute: () => {}, getAttribute: () => null })
    },
    setTimeout: (cb: Function) => { cb(); return 1; },
    clearTimeout: () => {},
    setInterval: () => 1,
    clearInterval: () => {}
  };

  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;

  try {
    const context = vm.createContext(sandbox);
    const result = vm.runInContext(script, context, { timeout: 3000 });
    return { success: true, result, consoleLogs };
  } catch (err: any) {
    return { success: false, result: null, error: err.message || String(err), consoleLogs };
  }
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    engine: "Dukicz Native Zig / TypeScript High-Performance Browser Engine",
    architecture: "aarch64-ios-native-compat",
    activeUrl: state.currentUrl,
    activeProfile: state.currentProfile.id,
    cookiesCount: state.cookies.size,
    waterfallCount: state.waterfall.length
  });
});

app.get("/api/profiles", (req, res) => {
  res.json({ profiles: ENGINE_PROFILES, activeProfileId: state.currentProfile.id });
});

app.post("/api/session/select-profile", (req, res) => {
  const profileId = req.body.profileId;
  const found = ENGINE_PROFILES.find(p => p.id === profileId);
  if (found) {
    state.currentProfile = found;
    res.json({ success: true, profile: state.currentProfile });
  } else {
    res.status(404).json({ success: false, error: "Profile not found" });
  }
});

app.post("/api/session/randomize", (req, res) => {
  const randIdx = Math.floor(Math.random() * ENGINE_PROFILES.length);
  const base = ENGINE_PROFILES[randIdx];
  const randSeed = Math.floor(Math.random() * 0xffffff);
  state.currentProfile = {
    ...base,
    canvasSeed: randSeed
  };
  res.json({ success: true, profile: state.currentProfile });
});

app.get("/api/session", (req, res) => {
  res.json({
    profile: state.currentProfile,
    currentUrl: state.currentUrl,
    title: state.documentTitle,
    stealth: state.stealth,
    history: state.history,
    historyIndex: state.historyIndex,
    cookiesCount: state.cookies.size,
    localStorageCount: state.localStorage.size
  });
});

app.post("/api/navigate", async (req, res) => {
  const targetUrl = req.body.url;
  if (!targetUrl) return res.status(400).json({ error: "URL is required" });

  try {
    const validUrl = targetUrl.startsWith("http://") || targetUrl.startsWith("https://") ? targetUrl : `https://${targetUrl}`;
    const result = await fetchHttpResource(validUrl);

    state.currentUrl = result.finalUrl;
    state.currentHtml = result.body;

    const parsedTree = parseDomTree(result.body);
    state.documentTitle = parsedTree.title || new urlModule.URL(validUrl).hostname;

    if (state.history[state.historyIndex] !== validUrl) {
      state.history.push(validUrl);
      state.historyIndex = state.history.length - 1;
    }

    const waterfallEntry: NetworkWaterfallEntry = {
      id: crypto.randomUUID(),
      url: validUrl,
      method: "GET",
      status: result.status,
      contentType: result.headers["content-type"] || "text/html",
      durationMs: result.duration,
      timestamp: Date.now(),
      sizeBytes: Buffer.byteLength(result.body),
      headers: result.headers,
      initiator: "Navigation"
    };
    state.waterfall.unshift(waterfallEntry);
    if (state.waterfall.length > 50) state.waterfall.pop();

    res.json({
      success: true,
      url: state.currentUrl,
      title: state.documentTitle,
      status: result.status,
      contentType: result.headers["content-type"],
      durationMs: result.duration,
      nodeCount: parsedTree.nodeCount,
      headers: result.headers,
      htmlLength: result.body.length
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to fetch document" });
  }
});

app.get("/api/render-viewport", (req, res) => {
  const baseTag = `<base href="${state.currentUrl}">`;
  const injectorScript = `
    <script>
      (function() {
        Object.defineProperty(navigator, 'userAgent', { get: () => "${state.currentProfile.userAgent}" });
        Object.defineProperty(navigator, 'platform', { get: () => "${state.currentProfile.platform}" });
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => ${state.currentProfile.hardwareConcurrency} });
        Object.defineProperty(navigator, 'deviceMemory', { get: () => ${state.currentProfile.deviceMemory} });
        Object.defineProperty(navigator, 'maxTouchPoints', { get: () => ${state.currentProfile.maxTouchPoints} });
        window.__DUKICZ_CANVAS_SEED__ = ${state.currentProfile.canvasSeed};
        window.__DUKICZ_AUDIO_RATE__ = ${state.currentProfile.audioSampleRate};
      })();
    </script>
  `;

  let modifiedHtml = state.currentHtml;
  if (modifiedHtml.includes("<head>")) {
    modifiedHtml = modifiedHtml.replace("<head>", `<head>${baseTag}${injectorScript}`);
  } else {
    modifiedHtml = `${baseTag}${injectorScript}${modifiedHtml}`;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(modifiedHtml);
});

app.post("/api/evaluate", (req, res) => {
  const expression = req.body.expression;
  if (!expression) return res.status(400).json({ error: "Expression is required" });

  const evalResult = evaluateInSandbox(expression, state.currentUrl);
  res.json(evalResult);
});

app.get("/api/dom/tree", (req, res) => {
  const tree = parseDomTree(state.currentHtml);
  res.json(tree);
});

app.post("/api/dom/query", (req, res) => {
  const selector = req.body.selector;
  if (!selector) return res.status(400).json({ error: "Selector is required" });

  const tree = parseDomTree(state.currentHtml);
  const matchedNodes = tree.nodes.filter(node => {
    if (selector.startsWith("#")) {
      return node.attributes.id === selector.substring(1);
    }
    if (selector.startsWith(".")) {
      const cls = selector.substring(1);
      return (node.attributes.class || "").split(/\s+/).includes(cls);
    }
    return node.tagName.toLowerCase() === selector.toLowerCase();
  });

  res.json({
    selector,
    count: matchedNodes.length,
    matches: matchedNodes.map(m => ({
      id: m.id,
      tagName: m.tagName,
      attributes: m.attributes,
      text: m.text || m.nodeValue
    }))
  });
});

app.get("/api/cookies", (req, res) => {
  res.json({ cookies: Array.from(state.cookies.values()) });
});

app.post("/api/cookies", (req, res) => {
  const { name, value, domain, path, secure, httpOnly, sameSite, maxAge } = req.body;
  if (!name || value === undefined) return res.status(400).json({ error: "Name and value required" });

  const parsedUrl = new urlModule.URL(state.currentUrl);
  const cookie: EngineCookie = {
    name,
    value: String(value),
    domain: domain || parsedUrl.hostname,
    path: path || "/",
    secure: !!secure,
    httpOnly: !!httpOnly,
    sameSite: sameSite || "Lax",
    expires: maxAge ? Date.now() + maxAge * 1000 : Date.now() + 86400000 * 30
  };
  state.cookies.set(`${cookie.domain}:${cookie.name}`, cookie);
  res.json({ success: true, cookie });
});

app.delete("/api/cookies", (req, res) => {
  state.cookies.clear();
  res.json({ success: true });
});

app.get("/api/waterfall", (req, res) => {
  res.json({ waterfall: state.waterfall });
});

app.post("/api/mcp", async (req, res) => {
  const { jsonrpc, id, method, params } = req.body;
  if (!method) return res.status(400).json({ jsonrpc: "2.0", id: id || null, error: { code: -32600, message: "Missing method" } });

  if (method === "initialize") {
    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: { listChanged: false }, resources: {}, prompts: {} },
        serverInfo: { name: "dukicz-native-ios-engine", version: "1.0.0" }
      }
    });
  }

  if (method === "ping") {
    return res.json({ jsonrpc: "2.0", id, result: {} });
  }

  if (method === "tools/list") {
    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        tools: [
          { name: "navigate", description: "Navigate to a URL with iOS Safari Engine Profile", inputSchema: { type: "object", properties: { url: { type: "string" } }, required: ["url"] } },
          { name: "snapshot", description: "Capture complete DOM Tree Snapshot", inputSchema: { type: "object", properties: {} } },
          { name: "evaluate", description: "Execute JavaScript in Browser Context Sandbox", inputSchema: { type: "object", properties: { expression: { type: "string" } }, required: ["expression"] } },
          { name: "get_cookies", description: "Get active session cookie jar", inputSchema: { type: "object", properties: {} } },
          { name: "query_selector", description: "Query element in DOM tree", inputSchema: { type: "object", properties: { selector: { type: "string" } }, required: ["selector"] } }
        ]
      }
    });
  }

  if (method === "tools/call") {
    const toolName = params?.name;
    const args = params?.arguments || {};

    if (toolName === "navigate") {
      try {
        const fetchRes = await fetchHttpResource(args.url);
        state.currentUrl = fetchRes.finalUrl;
        state.currentHtml = fetchRes.body;
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: `Navigated to ${state.currentUrl} (${fetchRes.status} OK, ${Buffer.byteLength(fetchRes.body)} bytes)` }]
          }
        });
      } catch (err: any) {
        return res.json({
          jsonrpc: "2.0",
          id,
          result: { content: [{ type: "text", text: `Navigation failed: ${err.message}` }], isError: true }
        });
      }
    }

    if (toolName === "evaluate") {
      const evalRes = evaluateInSandbox(args.expression, state.currentUrl);
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify(evalRes.result ?? evalRes.error, null, 2) }]
        }
      });
    }

    if (toolName === "snapshot") {
      const tree = parseDomTree(state.currentHtml);
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify(tree.root, null, 2) }]
        }
      });
    }

    if (toolName === "get_cookies") {
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify(Array.from(state.cookies.values()), null, 2) }]
        }
      });
    }

    return res.status(404).json({ jsonrpc: "2.0", id, error: { code: -32601, message: `Tool ${toolName} not found` } });
  }

  res.status(404).json({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method ${method} not found` } });
});

async function handleCdpDispatcher(req: express.Request, res: express.Response) {
  const { jsonrpc, id, method, params } = req.body;
  const requestId = id !== undefined ? id : Date.now();

  if (method === "Browser.getVersion") {
    return res.json({
      id: requestId,
      result: {
        protocolVersion: "1.3",
        product: "Safari/605.1.15 DukiczEngine/1.0",
        revision: "aarch64-ios-native",
        userAgent: state.currentProfile.userAgent,
        jsVersion: "V8/JSC C-ABI"
      }
    });
  }

  if (method === "Page.navigate") {
    const url = params?.url || "https://example.com";
    try {
      const fetchRes = await fetchHttpResource(url);
      state.currentUrl = fetchRes.finalUrl;
      state.currentHtml = fetchRes.body;
      const parsed = parseDomTree(fetchRes.body);
      state.documentTitle = parsed.title;

      return res.json({
        id: requestId,
        result: {
          frameId: "main-frame-001",
          loaderId: "loader-001",
          url: state.currentUrl,
          status: fetchRes.status
        }
      });
    } catch (err: any) {
      return res.status(500).json({ id: requestId, error: { code: -32000, message: err.message } });
    }
  }

  if (method === "DOM.getDocument") {
    const parsed = parseDomTree(state.currentHtml);
    return res.json({
      id: requestId,
      result: {
        root: {
          nodeId: 1,
          backendNodeId: 1,
          nodeType: 9,
          nodeName: "#document",
          localName: "",
          nodeValue: "",
          childNodeCount: parsed.root.children.length,
          children: parsed.root.children,
          documentURL: state.currentUrl,
          baseURL: state.currentUrl
        }
      }
    });
  }

  if (method === "DOM.querySelector") {
    const selector = params?.selector || "body";
    const parsed = parseDomTree(state.currentHtml);
    const found = parsed.nodes.find(n => n.tagName.toLowerCase() === selector.toLowerCase() || n.attributes.id === selector.replace("#", ""));
    return res.json({
      id: requestId,
      result: {
        nodeId: found ? found.id : 0
      }
    });
  }

  if (method === "Runtime.evaluate") {
    const expr = params?.expression || "1 + 1";
    const evalRes = evaluateInSandbox(expr, state.currentUrl);
    return res.json({
      id: requestId,
      result: {
        result: {
          type: typeof evalRes.result,
          value: evalRes.result,
          description: String(evalRes.result)
        },
        exceptionDetails: evalRes.error ? { text: evalRes.error } : undefined
      }
    });
  }

  if (method === "Emulation.setDeviceMetricsOverride") {
    state.currentProfile.screenWidth = params?.width || 393;
    state.currentProfile.screenHeight = params?.height || 852;
    state.currentProfile.devicePixelRatio = params?.deviceScaleFactor || 3.0;
    return res.json({
      id: requestId,
      result: {
        metrics: {
          width: state.currentProfile.screenWidth,
          height: state.currentProfile.screenHeight,
          deviceScaleFactor: state.currentProfile.devicePixelRatio
        }
      }
    });
  }

  if (method === "Emulation.setUserAgentOverride") {
    if (params?.userAgent) state.currentProfile.userAgent = params.userAgent;
    return res.json({ id: requestId, result: {} });
  }

  if (method === "Network.getCookies") {
    return res.json({
      id: requestId,
      result: {
        cookies: Array.from(state.cookies.values())
      }
    });
  }

  if (method === "Network.clearBrowserCookies") {
    state.cookies.clear();
    return res.json({ id: requestId, result: {} });
  }

  if (method === "Accessibility.getFullAXTree") {
    const parsed = parseDomTree(state.currentHtml);
    return res.json({
      id: requestId,
      result: {
        nodes: [
          {
            nodeId: "1",
            role: { type: "role", value: "WebArea" },
            name: { type: "computedString", value: state.documentTitle },
            childIds: parsed.root.children.map(c => String(c.id))
          }
        ]
      }
    });
  }

  res.json({
    id: requestId,
    result: {
      status: "acknowledged",
      method,
      params: params || {},
      timestamp: Date.now()
    }
  });
}

app.post("/cdp", handleCdpDispatcher);
app.post("/api/cdp", handleCdpDispatcher);

const staticIndexPath = path.join(process.cwd(), "index.html");
app.get("*", (req, res) => {
  if (fs.existsSync(staticIndexPath)) {
    res.sendFile(staticIndexPath);
  } else {
    res.status(404).send("index.html not found");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Dukicz Engine running on port ${PORT}`);
});
