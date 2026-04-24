"use client";
import type { TaskbarConfig } from "@/lib/storage";
import { Volume2, Wifi, Battery, Search } from "lucide-react";

const WEATHER_ICONS: Record<string, string> = {
  sun: "☀️", cloud: "⛅", rain: "🌧️", snow: "❄️", storm: "⛈️", fog: "🌫️",
};

export function TaskbarW11({ config, width, height }: { config: TaskbarConfig; width: number; height: number }) {
  return (
    <div className="tb-w11" style={{ width, height, minWidth: "unset" }}>
      {/* Weather — absolute far left */}
      {config.weather.show && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          display: "flex", alignItems: "center", gap: 8, padding: "0 14px",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          cursor: "default",
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
        {/* Start button — real Win11 four-pane logo with gradient */}
        <div className="tb-w11-icon tb-w11-start">
          <svg viewBox="0 0 88 88" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="w11g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00BCF2"/>
                <stop offset="100%" stopColor="#0078D4"/>
              </linearGradient>
            </defs>
            <rect x="0"  y="0"  width="40" height="40" rx="2" fill="url(#w11g)"/>
            <rect x="48" y="0"  width="40" height="40" rx="2" fill="url(#w11g)"/>
            <rect x="0"  y="48" width="40" height="40" rx="2" fill="url(#w11g)"/>
            <rect x="48" y="48" width="40" height="40" rx="2" fill="url(#w11g)"/>
          </svg>
        </div>

        {/* Search bar */}
        {config.tray.showSearch && (
          <div className="tb-w11-search">
            <Search size={13} style={{ opacity: 0.6, flexShrink: 0 }} />
            <span>Search</span>
          </div>
        )}

        {config.icons.map(i => (
          <div key={i.uid} className={`tb-w11-icon ${i.isRunning ? "running" : ""} ${i.isActive ? "active" : ""}`}>
            <img src={i.svgDataUri} alt={i.name} />
          </div>
        ))}
      </div>

      {/* Tray — absolute far right */}
      <div className="tb-w11-tray">
        {config.tray.showLanguage && <span style={{ fontSize: 11 }}>ENG</span>}
        <div style={{ display: "flex", gap: 6 }}>
          {config.tray.showWifi     && <Wifi    size={14} />}
          {config.tray.showVolume   && <Volume2 size={14} />}
          {config.tray.showBattery  && <Battery size={14} />}
        </div>
        <div className="tb-w11-clock">
          <div>{config.time}</div>
          <div style={{ opacity: 0.7 }}>{config.date}</div>
        </div>
      </div>
    </div>
  );
}
