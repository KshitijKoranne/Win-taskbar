"use client";
import type { TaskbarConfig } from "@/lib/storage";
import { Volume2, Wifi, Battery, Languages } from "lucide-react";

const WEATHER_ICONS: Record<string, string> = {
  sun:   "☀️",
  cloud: "⛅",
  rain:  "🌧️",
  snow:  "❄️",
  storm: "⛈️",
  fog:   "🌫️",
};

export function TaskbarW11({ config }: { config: TaskbarConfig }) {
  return (
    <div className="tb-w11">
      {/* Weather widget — far left, Win11 style */}
      {config.weather.show && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "0 14px",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          cursor: "default", flexShrink: 0,
        }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>{WEATHER_ICONS[config.weather.icon]}</span>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{config.weather.temp}</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>{config.weather.condition}</div>
          </div>
        </div>
      )}

      {/* Center icons */}
      <div className="tb-w11-center">
        <div className="tb-w11-icon tb-w11-start">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <rect x="2"  y="2"  width="9" height="9" fill="#0078D4"/>
            <rect x="13" y="2"  width="9" height="9" fill="#0078D4"/>
            <rect x="2"  y="13" width="9" height="9" fill="#0078D4"/>
            <rect x="13" y="13" width="9" height="9" fill="#0078D4"/>
          </svg>
        </div>
        {config.icons.map(i => (
          <div key={i.uid} className={`tb-w11-icon ${i.isRunning ? "running" : ""} ${i.isActive ? "active" : ""}`}>
            <img src={i.svgDataUri} alt={i.name} />
          </div>
        ))}
      </div>

      {/* Tray — far right */}
      <div className="tb-w11-tray">
        {config.tray.showLanguage && <span style={{ fontSize: 11 }}>ENG</span>}
        <div style={{ display: "flex", gap: 6 }}>
          {config.tray.showWifi     && <Wifi     size={14} />}
          {config.tray.showVolume   && <Volume2  size={14} />}
          {config.tray.showBattery  && <Battery  size={14} />}
        </div>
        <div className="tb-w11-clock">
          <div>{config.time}</div>
          <div style={{ opacity: 0.7 }}>{config.date}</div>
        </div>
      </div>
    </div>
  );
}
