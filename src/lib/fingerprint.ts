import {
  FingerprintProfile,
  UserAgentProfile,
  GpuInfo,
  CanvasFingerprint,
  AudioFingerprint,
  BatteryFingerprint,
  ScreenFingerprint,
  WebRtcFingerprint,
  SensorsFingerprint
} from '../types';

export const USER_AGENT_PROFILES: UserAgentProfile[] = [
  {
    id: 'ios-safari-iphone15pro',
    name: 'iPhone 15 Pro (iOS 17.5.1 / WebKit Safari)',
    platform: 'ios',
    browser: 'safari',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/605.1.15',
    appVersion: '5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/605.1.15',
    secChUa: '"Not/A)Brand";v="8", "Chromium";v="125", "Safari";v="605"',
    secChUaMobile: '?1',
    secChUaPlatform: '"iOS"',
    acceptLanguage: 'en-US,en;q=0.9,es-ES;q=0.8',
    hardwareConcurrency: 6,
    deviceMemory: 8
  },
  {
    id: 'ios-crios-iphone15promax',
    name: 'iPhone 15 Pro Max (iOS 17.5 / Chrome iOS CriOS)',
    platform: 'ios',
    browser: 'crios',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.6422.80 Mobile/15E148 Safari/604.1',
    appVersion: '5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.6422.80 Mobile/15E148 Safari/604.1',
    secChUa: '"Google Chrome";v="125", "Chromium";v="125", "Not=A?Brand";v="24"',
    secChUaMobile: '?1',
    secChUaPlatform: '"iOS"',
    acceptLanguage: 'en-US,en;q=0.9',
    hardwareConcurrency: 6,
    deviceMemory: 8
  },
  {
    id: 'ios-ipadpro-m2',
    name: 'iPad Pro 12.9" M2 (iPadOS 17.5 / Mobile Safari)',
    platform: 'ios',
    browser: 'safari',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/605.1.15',
    appVersion: '5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/605.1.15',
    secChUa: '"Not/A)Brand";v="8", "Chromium";v="125", "Safari";v="605"',
    secChUaMobile: '?1',
    secChUaPlatform: '"iPadOS"',
    acceptLanguage: 'en-US,en;q=0.9,fr-FR;q=0.8',
    hardwareConcurrency: 8,
    deviceMemory: 16
  },
  {
    id: 'macos-safari-m3max',
    name: 'MacBook Pro M3 Max (macOS 14.5 Sonoma / Safari 17.5)',
    platform: 'macos',
    browser: 'safari',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
    appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
    secChUa: '"Not/A)Brand";v="8", "Chromium";v="125", "Safari";v="605"',
    secChUaMobile: '?0',
    secChUaPlatform: '"macOS"',
    acceptLanguage: 'en-US,en;q=0.9,de-DE;q=0.7',
    hardwareConcurrency: 16,
    deviceMemory: 32
  },
  {
    id: 'macos-chrome-125',
    name: 'Mac Studio M2 Ultra (macOS 14.5 / Chrome 125)',
    platform: 'macos',
    browser: 'chrome',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    secChUa: '"Google Chrome";v="125", "Chromium";v="125", "Not=A?Brand";v="24"',
    secChUaMobile: '?0',
    secChUaPlatform: '"macOS"',
    acceptLanguage: 'en-US,en;q=0.9',
    hardwareConcurrency: 24,
    deviceMemory: 64
  },
  {
    id: 'windows-chrome-125',
    name: 'Windows 11 PC (x64 / Chrome 125 Native)',
    platform: 'windows',
    browser: 'chrome',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    secChUa: '"Google Chrome";v="125", "Chromium";v="125", "Not=A?Brand";v="24"',
    secChUaMobile: '?0',
    secChUaPlatform: '"Windows"',
    acceptLanguage: 'en-US,en;q=0.9',
    hardwareConcurrency: 12,
    deviceMemory: 16
  }
];

const APPLE_GPU_MODELS = [
  { vendor: 'Apple Inc.', renderer: 'Apple A17 Pro GPU' },
  { vendor: 'Apple Inc.', renderer: 'Apple A16 Bionic GPU' },
  { vendor: 'Apple Inc.', renderer: 'Apple M2 Max GPU' },
  { vendor: 'Apple Inc.', renderer: 'Apple M3 Pro GPU' },
  { vendor: 'Apple Inc.', renderer: 'Apple M3 Max GPU' },
  { vendor: 'Apple Inc.', renderer: 'ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)' },
  { vendor: 'Apple Inc.', renderer: 'ANGLE (Apple, Apple M2, OpenGL 4.1)' }
];

const NON_APPLE_GPUS = [
  { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4080 Direct3D11 vs_5_0 ps_5_0)' },
  { vendor: 'Google Inc. (AMD)', renderer: 'ANGLE (AMD, AMD Radeon RX 7900 XTX Direct3D11 vs_5_0 ps_5_0)' },
  { vendor: 'Google Inc. (Qualcomm)', renderer: 'ANGLE (Qualcomm, Adreno 740, OpenGL ES 3.2)' }
];

const SYSTEM_FONTS = [
  'SF Pro Display',
  'SF Pro Text',
  'SF Compact Display',
  'Helvetica Neue',
  'Helvetica',
  'Arial',
  'PingFang SC',
  'Hiragino Sans',
  'Courier New',
  'Times New Roman',
  'Menlo',
  'Monaco'
];

function generateRandomHex(length: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateRandomSessionFingerprint(profileOverride?: UserAgentProfile): FingerprintProfile {
  const profile = profileOverride || getRandomItem(USER_AGENT_PROFILES);
  const isIos = profile.platform === 'ios';
  const isMac = profile.platform === 'macos';

  // GPU Info selection based on platform
  const gpuSelection = (isIos || isMac) ? getRandomItem(APPLE_GPU_MODELS) : getRandomItem(NON_APPLE_GPUS);

  const gpuInfo: GpuInfo = {
    vendor: gpuSelection.vendor,
    renderer: gpuSelection.renderer,
    glslVersion: isIos ? 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)' : 'WebGL GLSL ES 3.00 (OpenGL ES GLSL ES 3.0 Chromium)',
    maxTextureSize: isIos ? 16384 : 32768,
    maxRenderbufferSize: isIos ? 16384 : 32768,
    maxViewportDimensions: isIos ? [16384, 16384] : [32768, 32768],
    extensionsCount: isIos ? 38 : 46,
    extensionsHash: 'ext_' + generateRandomHex(12)
  };

  // Canvas Noise Fingerprint
  const canvasSeed = Math.floor(Math.random() * 900000) + 100000;
  const canvasFingerprint: CanvasFingerprint = {
    noiseSeed: canvasSeed,
    dataUrlHash: 'cvs_' + generateRandomHex(16),
    renderingOffset: +(Math.random() * 0.00004).toFixed(8),
    textBaselineNoise: +(Math.random() * 0.00002).toFixed(8),
    blendModeParity: 'multiply-overlay-parity-ok'
  };

  // Audio Context Fingerprint
  const audioFingerprint: AudioFingerprint = {
    sampleRate: getRandomItem([44100, 48000]),
    channelCount: 2,
    baseLatency: +(0.005 + Math.random() * 0.003).toFixed(5),
    dynamicsCompressorHash: 'aud_dc_' + generateRandomHex(12),
    oscillatorFrequencyJitter: +(Math.random() * 0.0000001).toFixed(10),
    audioBufferHash: 'aud_buf_' + generateRandomHex(16)
  };

  // Battery API Randomization
  const batteryFingerprint: BatteryFingerprint = {
    charging: Math.random() > 0.4,
    chargingTime: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 1800),
    dischargingTime: Math.floor(Math.random() * 14400) + 3600,
    level: +(0.15 + Math.random() * 0.84).toFixed(2)
  };

  // Screen & Touch Dimensions
  let screenWidth = 1920;
  let screenHeight = 1080;
  let maxTouch = 0;
  let pixelRatio = 1.0;

  if (profile.id.includes('iphone15pro')) {
    screenWidth = 393;
    screenHeight = 852;
    maxTouch = 5;
    pixelRatio = 3.0;
  } else if (profile.id.includes('iphone15promax')) {
    screenWidth = 430;
    screenHeight = 932;
    maxTouch = 5;
    pixelRatio = 3.0;
  } else if (profile.id.includes('ipadpro')) {
    screenWidth = 1024;
    screenHeight = 1366;
    maxTouch = 5;
    pixelRatio = 2.0;
  } else if (isMac) {
    screenWidth = 2560;
    screenHeight = 1600;
    maxTouch = 0;
    pixelRatio = 2.0;
  } else {
    screenWidth = 1920;
    screenHeight = 1080;
    maxTouch = 0;
    pixelRatio = 1.0;
  }

  const screenFingerprint: ScreenFingerprint = {
    width: screenWidth,
    height: screenHeight,
    availWidth: screenWidth,
    availHeight: screenHeight - (isIos ? 47 : 40),
    colorDepth: 30,
    pixelDepth: 30,
    devicePixelRatio: pixelRatio,
    maxTouchPoints: maxTouch,
    orientation: screenWidth < screenHeight ? 'portrait-primary' : 'landscape-primary'
  };

  // WebRTC Candidate Protection
  const webRtcFingerprint: WebRtcFingerprint = {
    localIpCandidate: `192.168.1.${Math.floor(Math.random() * 180) + 20}.local`,
    stunCandidateMasking: true,
    mediaDevicesHash: 'media_' + generateRandomHex(12),
    audioInputsCount: isIos ? 1 : 2,
    videoInputsCount: isIos ? 2 : 1,
    audioOutputsCount: isIos ? 1 : 2
  };

  // Sensors API Randomization
  const sensorsFingerprint: SensorsFingerprint = {
    accelerometerNoise: +(Math.random() * 0.002).toFixed(6),
    gyroscopeOffset: +(Math.random() * 0.001).toFixed(6),
    ambientLightLux: Math.floor(Math.random() * 300) + 50,
    magnetometerHeading: +(Math.random() * 360).toFixed(2)
  };

  return {
    sessionId: 'sess_' + generateRandomHex(16),
    createdAt: new Date().toISOString(),
    uaProfile: profile,
    gpu: gpuInfo,
    canvas: canvasFingerprint,
    audio: audioFingerprint,
    battery: batteryFingerprint,
    screen: screenFingerprint,
    webRtc: webRtcFingerprint,
    sensors: sensorsFingerprint,
    fonts: SYSTEM_FONTS,
    pluginsHash: 'plg_' + generateRandomHex(10),
    overallConsistencyScore: 99.8
  };
}
