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

export type TaskbarConfig = {
  version: WinVersion;
  icons: TaskbarIcon[];
  date: string;
  time: string;
  tray: TrayConfig;
  weather: WeatherConfig;
  scale: number;
};

export type Preset = {
  id: string;
  name: string;
  config: TaskbarConfig;
  createdAt: number;
};

export const STORAGE_KEY = "taskbar-builder-presets-v2";

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
  scale: 1,
};
