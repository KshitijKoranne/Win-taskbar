export type WinVersion = "xp" | "w7" | "w10" | "w11";

export type TaskbarIcon = {
  uid: string;
  iconId: string;
  name: string;
  svgDataUri: string;
  isRunning: boolean;
  isActive: boolean;
};

export type TrayConfig = {
  showWifi: boolean;
  showVolume: boolean;
  showBattery: boolean;
  showLanguage: boolean;
};

export type WeatherConfig = {
  show: boolean;
  temp: string;
  condition: string;
  icon: "sun" | "cloud" | "rain" | "snow" | "storm" | "fog";
};

export type Resolution = {
  label: string;
  w: number;
  h: number;
  // Taskbar height Windows uses at this resolution (px, unscaled)
  taskbarHeight: { w7: number; w10: number; w11: number };
};

// All common screen resolutions + their accurate OS taskbar heights
export const RESOLUTIONS: Resolution[] = [
  { label: "1280 × 720 (HD)",        w: 1280,  h: 720,  taskbarHeight: { w7: 30, w10: 40, w11: 48 } },
  { label: "1366 × 768",             w: 1366,  h: 768,  taskbarHeight: { w7: 30, w10: 40, w11: 48 } },
  { label: "1440 × 900",             w: 1440,  h: 900,  taskbarHeight: { w7: 30, w10: 40, w11: 48 } },
  { label: "1600 × 900",             w: 1600,  h: 900,  taskbarHeight: { w7: 30, w10: 40, w11: 48 } },
  { label: "1920 × 1080 (FHD)",      w: 1920,  h: 1080, taskbarHeight: { w7: 40, w10: 40, w11: 48 } },
  { label: "2560 × 1080 (UW FHD)",   w: 2560,  h: 1080, taskbarHeight: { w7: 40, w10: 40, w11: 48 } },
  { label: "2560 × 1440 (QHD)",      w: 2560,  h: 1440, taskbarHeight: { w7: 48, w10: 48, w11: 56 } },
  { label: "3440 × 1440 (UW QHD)",   w: 3440,  h: 1440, taskbarHeight: { w7: 48, w10: 48, w11: 56 } },
  { label: "3840 × 2160 (4K UHD)",   w: 3840,  h: 2160, taskbarHeight: { w7: 56, w10: 56, w11: 64 } },
  { label: "5120 × 2880 (5K)",       w: 5120,  h: 2880, taskbarHeight: { w7: 64, w10: 64, w11: 72 } },
  { label: "7680 × 4320 (8K UHD)",   w: 7680,  h: 4320, taskbarHeight: { w7: 72, w10: 72, w11: 80 } },
];

export type TaskbarConfig = {
  version: WinVersion;
  icons: TaskbarIcon[];
  date: string;
  time: string;
  tray: TrayConfig;
  weather: WeatherConfig;
  resolutionIdx: number; // index into RESOLUTIONS
};

export type Preset = {
  id: string;
  name: string;
  config: TaskbarConfig;
  createdAt: number;
};

export const STORAGE_KEY = "taskbar-builder-presets-v3";

export function loadPresets(): Preset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function savePresets(presets: Preset[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export const DEFAULT_CONFIG: TaskbarConfig = {
  version: "w11",
  icons: [],
  date: "Mon, Apr 21",
  time: "10:30 AM",
  tray: { showWifi: true, showVolume: true, showBattery: true, showLanguage: false },
  weather: { show: true, temp: "24°C", condition: "Partly Cloudy", icon: "cloud" },
  resolutionIdx: 4, // 1920×1080 default
};
