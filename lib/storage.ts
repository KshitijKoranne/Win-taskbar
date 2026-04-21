export type WinVersion = "xp" | "w7" | "w10" | "w11";

export type TaskbarIcon = {
  uid: string;          // unique instance id
  iconId: string;       // refs library id, OR "custom:<dataUri>"
  name: string;
  svgDataUri: string;
  isRunning: boolean;
  isActive: boolean;    // for Win11 active app indicator
};

export type TrayConfig = {
  showWifi: boolean;
  showVolume: boolean;
  showBattery: boolean;
  showLanguage: boolean;
};

export type TaskbarConfig = {
  version: WinVersion;
  icons: TaskbarIcon[];
  date: string;        // user-typed
  time: string;        // user-typed
  tray: TrayConfig;
};

export type Preset = {
  id: string;
  name: string;
  config: TaskbarConfig;
  createdAt: number;
};

export const STORAGE_KEY = "taskbar-builder-presets-v1";

export function loadPresets(): Preset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
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
};
