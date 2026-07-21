export interface GpuInfo {
  vendor: string;
  renderer: string;
  glslVersion: string;
  maxTextureSize: number;
  maxRenderbufferSize: number;
  maxViewportDimensions: [number, number];
  extensionsCount: number;
  extensionsHash: string;
}

export interface CanvasFingerprint {
  noiseSeed: number;
  dataUrlHash: string;
  renderingOffset: number;
  textBaselineNoise: number;
  blendModeParity: string;
}

export interface AudioFingerprint {
  sampleRate: number;
  channelCount: number;
  baseLatency: number;
  dynamicsCompressorHash: string;
  oscillatorFrequencyJitter: number;
  audioBufferHash: string;
}

export interface BatteryFingerprint {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

export interface ScreenFingerprint {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  colorDepth: number;
  pixelDepth: number;
  devicePixelRatio: number;
  maxTouchPoints: number;
  orientation: string;
}

export interface WebRtcFingerprint {
  localIpCandidate: string;
  stunCandidateMasking: boolean;
  mediaDevicesHash: string;
  audioInputsCount: number;
  videoInputsCount: number;
  audioOutputsCount: number;
}

export interface SensorsFingerprint {
  accelerometerNoise: number;
  gyroscopeOffset: number;
  ambientLightLux: number;
  magnetometerHeading: number;
}

export interface UserAgentProfile {
  id: string;
  name: string;
  platform: 'ios' | 'macos' | 'windows' | 'android';
  browser: 'safari' | 'chrome' | 'crios';
  userAgent: string;
  appVersion: string;
  secChUa: string;
  secChUaMobile: string;
  secChUaPlatform: string;
  acceptLanguage: string;
  hardwareConcurrency: number;
  deviceMemory: number;
}

export interface FingerprintProfile {
  sessionId: string;
  createdAt: string;
  uaProfile: UserAgentProfile;
  gpu: GpuInfo;
  canvas: CanvasFingerprint;
  audio: AudioFingerprint;
  battery: BatteryFingerprint;
  screen: ScreenFingerprint;
  webRtc: WebRtcFingerprint;
  sensors: SensorsFingerprint;
  fonts: string[];
  pluginsHash: string;
  overallConsistencyScore: number;
}

export interface DetectorTestResult {
  id: string;
  name: string;
  category: string;
  status: 'passed' | 'warning' | 'failed' | 'running';
  score: string;
  details: string;
  trustScore: number;
  checks: { title: string; passed: boolean; note: string }[];
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  size?: string;
  content?: string;
}

export interface TestItem {
  id: string;
  name: string;
  status: 'passed' | 'failed';
  time: string;
  description: string;
}

export interface NetworkTiming {
  dns: number;
  connect: number;
  ssl: number;
  send: number;
  ttfb: number;
  download: number;
  total: number;
}

export interface NetworkRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
  status: number;
  statusText: string;
  type: 'document' | 'script' | 'stylesheet' | 'xhr' | 'image' | 'font';
  mimeType: string;
  size: string;
  transferredSize: string;
  startTime: number; // offset in ms from page start
  duration: number; // total duration in ms
  timing: NetworkTiming;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
  responsePayload: string;
}

