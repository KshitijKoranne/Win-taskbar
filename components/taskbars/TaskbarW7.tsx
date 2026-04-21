import type { TaskbarConfig } from "@/lib/storage";
import { Volume2, Wifi, Battery, Languages } from "lucide-react";

// Win7 start orb: glassy blue sphere with the 4-color windows flag inside
function StartOrb() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%", cursor: "pointer", position: "relative",
      background: "radial-gradient(circle at 38% 35%, #b8d8ff 0%, #5ba3e8 30%, #1a5bbf 60%, #0a2d6e 100%)",
      boxShadow: "0 0 12px rgba(80,160,255,0.7), inset 0 1px 2px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* Gloss overlay */}
      <div style={{
        position: "absolute", top: 2, left: 4, width: 28, height: 14,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 80%)",
      }} />
      {/* 4-color windows logo */}
      <svg viewBox="0 0 16 16" width="16" height="16" style={{ position: "relative", zIndex: 1 }}>
        <rect x="0" y="0" width="7" height="7" fill="rgba(255,255,255,0.9)" rx="0.5"/>
        <rect x="9" y="0" width="7" height="7" fill="rgba(255,255,255,0.9)" rx="0.5"/>
        <rect x="0" y="9" width="7" height="7" fill="rgba(255,255,255,0.9)" rx="0.5"/>
        <rect x="9" y="9" width="7" height="7" fill="rgba(255,255,255,0.9)" rx="0.5"/>
      </svg>
    </div>
  );
}

export function TaskbarW7({ config }: { config: TaskbarConfig }) {
  return (
    <div className="tb-w7">
      <div className="tb-w7-start"><StartOrb /></div>
      <div className="tb-w7-icons">
        {config.icons.map(i => (
          <div key={i.uid} className={`tb-w7-icon ${i.isRunning ? "running" : ""}`}>
            <img src={i.svgDataUri} alt={i.name} />
          </div>
        ))}
      </div>
      <div className="tb-w7-tray">
        {config.tray.showLanguage && <Languages size={14} />}
        {config.tray.showVolume   && <Volume2 size={14} />}
        {config.tray.showWifi     && <Wifi    size={14} />}
        {config.tray.showBattery  && <Battery size={14} />}
        <div className="tb-w7-clock">
          <div>{config.time}</div>
          <div style={{ fontSize: 10, opacity: 0.8 }}>{config.date}</div>
        </div>
      </div>
    </div>
  );
}
