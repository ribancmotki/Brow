// Headless Browser Engine V8 Bootstrap Runtime

(function () {
  'use strict';

  // Internal infrastructure
  const __dukicz_errors = [];
  globalThis.__dukicz_errors = __dukicz_errors;

  globalThis.onerror = function (msg, url, line, col, error) {
    __dukicz_errors.push({ msg, url, line, col, error: error ? error.stack : null });
  };
  globalThis.onunhandledrejection = function (e) {
    __dukicz_errors.push({ reason: e.reason });
  };

  // EventTarget base
  class EventTargetShim {
    constructor() {
      this._listeners = new Map();
    }
    addEventListener(type, listener, options = {}) {
      if (!this._listeners.has(type)) {
        this._listeners.set(type, []);
      }
      const list = this._listeners.get(type);
      const once = typeof options === 'object' ? !!options.once : false;
      const capture = typeof options === 'object' ? !!options.capture : !!options;
      list.push({ listener, once, capture });
    }
    removeEventListener(type, listener) {
      if (!this._listeners.has(type)) return;
      const list = this._listeners.get(type).filter(item => item.listener !== listener);
      this._listeners.set(type, list);
    }
    dispatchEvent(event) {
      event.target = this;
      event.currentTarget = this;
      if (!this._listeners.has(event.type)) return true;
      const list = [...this._listeners.get(event.type)];
      for (const item of list) {
        if (typeof item.listener === 'function') {
          item.listener.call(this, event);
        } else if (item.listener && typeof item.listener.handleEvent === 'function') {
          item.listener.handleEvent(event);
        }
        if (item.once) {
          this.removeEventListener(event.type, item.listener);
        }
      }
      return !event.defaultPrevented;
    }
  }

  globalThis.EventTarget = EventTargetShim;

  // Window / GlobalAliases
  globalThis.window = globalThis;
  globalThis.self = globalThis;
  globalThis.frames = globalThis;
  globalThis.top = globalThis;
  globalThis.parent = globalThis;

  // Navigator
  const navigatorShim = {
    userAgent: globalThis.__dukicz_ua || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
    platform: globalThis.__dukicz_platform || "Win32",
    language: "en-US",
    languages: ["en-US", "en"],
    onLine: true,
    cookieEnabled: true,
    hardwareConcurrency: 8,
    maxTouchPoints: 0,
    vendor: "Google Inc.",
    appName: "Netscape",
    appVersion: "5.0 (Windows NT 10.0; Win64; x64)",
    product: "Gecko",
    productSub: "20030107",
    doNotTrack: null,
    userAgentData: {
      brands: [
        { brand: "Not A(Brand", version: "99" },
        { brand: "Chromium", version: "145" },
        { brand: "Google Chrome", version: "145" }
      ],
      mobile: false,
      platform: "Windows",
    },
    geolocation: {
      getCurrentPosition(success) {
        success({
          coords: {
            latitude: globalThis.__dukicz_geo_lat || 52.52,
            longitude: globalThis.__dukicz_geo_lon || 13.405,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        });
      },
      watchPosition() { return 0; },
      clearWatch() {},
    },
    permissions: {
      query(obj) {
        return Promise.resolve({ state: "granted", onchange: null });
      },
    },
    clipboard: {
      writeText() { return Promise.resolve(); },
      readText() { return Promise.reject(new Error("NotAllowedError")); },
    },
  };
  globalThis.navigator = navigatorShim;

  // Screen
  globalThis.screen = {
    width: 1280,
    height: 720,
    availWidth: 1280,
    availHeight: 720,
    colorDepth: 24,
    pixelDepth: 24,
    orientation: { type: "landscape-primary", angle: 0 },
  };

  // NodeFilter constants
  function NodeFilter() {}
  NodeFilter.FILTER_ACCEPT = 1;
  NodeFilter.FILTER_REJECT = 2;
  NodeFilter.FILTER_SKIP = 3;
  NodeFilter.SHOW_ALL = 0xFFFFFFFF;
  NodeFilter.SHOW_ELEMENT = 1;
  NodeFilter.SHOW_TEXT = 4;
  NodeFilter.SHOW_COMMENT = 128;
  NodeFilter.SHOW_DOCUMENT = 256;
  NodeFilter.SHOW_DOCUMENT_TYPE = 512;
  NodeFilter.SHOW_DOCUMENT_FRAGMENT = 1024;
  globalThis.NodeFilter = NodeFilter;

  // TreeWalker
  class TreeWalker {
    constructor(root, whatToShow = NodeFilter.SHOW_ALL, filter = null) {
      this.root = root;
      this.currentNode = root;
      this.whatToShow = whatToShow;
      this.filter = filter;
    }
    nextNode() {
      let node = this.currentNode;
      while (node) {
        if (node.firstChild) {
          node = node.firstChild;
        } else if (node.nextSibling) {
          node = node.nextSibling;
        } else {
          while (node && !node.nextSibling && node !== this.root) {
            node = node.parentNode;
          }
          if (node && node !== this.root) {
            node = node.nextSibling;
          } else {
            node = null;
          }
        }
        if (!node) break;
        let accept = true;
        if (this.filter) {
          const res = typeof this.filter === 'function' ? this.filter(node) : this.filter.acceptNode(node);
          if (res === NodeFilter.FILTER_REJECT) continue;
          if (res === NodeFilter.FILTER_SKIP) continue;
        }
        this.currentNode = node;
        return node;
      }
      return null;
    }
  }
  globalThis.TreeWalker = TreeWalker;

  // DOM ImageShim
  class HTMLImageElementShim extends EventTargetShim {
    constructor(width, height) {
      super();
      this.width = width || 0;
      this.height = height || 0;
      this.complete = true;
      this.naturalWidth = width || 100;
      this.naturalHeight = height || 100;
      this._src = "";
    }
  }
  globalThis.HTMLImageElement = HTMLImageElementShim;
  globalThis.Image = function (w, h) {
    const img = new HTMLImageElementShim(w, h);
    try {
      Object.defineProperty(img, "src", {
        get() { return this._src; },
        set(v) {
          this._src = v;
          setTimeout(() => {
            if (typeof this.onload === 'function') this.onload();
          }, 0);
        },
        configurable: true,
      });
    } catch (e) {
      // Ignore if non-configurable prototype per issue test
    }
    return img;
  };

  // Structured Clone
  globalThis.structuredClone = function (value) {
    const map = new Map();
    function clone(v) {
      if (typeof v === 'function' || typeof v === 'symbol') {
        throw new Error("DataCloneError: Cannot clone functions or symbols");
      }
      if (v === null || typeof v !== 'object') return v;
      if (map.has(v)) return map.get(v);

      if (v instanceof Date) return new Date(v.getTime());
      if (v instanceof RegExp) return new RegExp(v.source, v.flags);
      if (v instanceof ArrayBuffer) return v.slice(0);
      if (v instanceof DataView) return new DataView(v.buffer.slice(0), v.byteOffset, v.byteLength);
      if (Array.isArray(v)) {
        const arr = [];
        map.set(v, arr);
        for (let i = 0; i < v.length; i++) arr[i] = clone(v[i]);
        return arr;
      }
      if (v instanceof Error) {
        const err = new Error(v.message);
        err.name = v.name;
        if (v.cause) err.cause = clone(v.cause);
        return err;
      }

      const res = {};
      map.set(v, res);
      for (const key of Object.keys(v)) {
        res[key] = clone(v[key]);
      }
      if (Object.prototype.hasOwnProperty.call(v, "__proto__")) {
        Object.defineProperty(res, "__proto__", Object.getOwnPropertyDescriptor(v, "__proto__"));
      }
      return res;
    }
    return clone(value);
  };

  // Crypto
  globalThis.crypto = {
    getRandomValues(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    randomUUID() {
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
        (c ^ Math.floor(Math.random() * 16) >> c / 4).toString(16)
      );
    },
    subtle: {
      generateKey() {
        return Promise.resolve({ type: "secret", extractable: true, algorithm: { name: "AES-GCM" } });
      },
      encrypt(algo, key, data) {
        return Promise.resolve(data.slice ? data.slice(0) : data);
      },
      decrypt(algo, key, data) {
        return Promise.resolve(data.slice ? data.slice(0) : data);
      },
      digest(algo, data) {
        return Promise.resolve(new ArrayBuffer(32));
      },
    },
  };

  // Performance
  globalThis.performance = {
    now() { return Date.now(); },
    timeOrigin: Date.now(),
    getEntries() { return []; },
  };

  // Microtasks / Timers
  globalThis.requestAnimationFrame = function (cb) {
    return setTimeout(cb, 16);
  };
  globalThis.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };

  // Stealth
  if (globalThis.__dukicz_stealth) {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined, configurable: false });
    navigator.plugins = [
      { name: "Chrome PDF Viewer" },
      { name: "PDF Viewer" },
    ];
    globalThis.chrome = { runtime: {} };
  }

  // Final init
  globalThis.__dukicz_init = function () {
    // Page init hook
  };
})();
