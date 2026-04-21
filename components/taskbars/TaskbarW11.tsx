import type { TaskbarConfig } from "@/lib/storage";
import { Volume2, Wifi, Battery, Languages } from "lucide-react";

export function TaskbarW11({ config }: { config: TaskbarConfig }) {
  return (
    <div className="tb-w11">
      <div className="tb-w11-center">
        <div className="tb-w11-icon tb-w11-start">
          <svg viewBox="0 0 24 24">
            <path d="M3 5l8-1v8H3zm9-1l9-1v9h-9zM3 13h8v8l-8-1zm9 0h9v9l-9-1z"/>
          </svg>
        </div>
        {config.icons.map((i, idx) => (
          <div key={i.uid} className={`tb-w11-icon ${i.isRunning ? "running" : ""} ${i.isActive ? "active" : ""}`}>
            <img src={i.svgDataUri} alt={i.name} />
          </div>
        ))}
      </div>
      <div className="tb-w11-tray">
        {config.tray.showLanguage && <span style={{ fontSize: 11 }}>ENG</span>}
        <div style={{ display: "flex", gap: 6 }}>
          {config.tray.showWifi && <Wifi size={14} />}
          {config.tray.showVolume && <Volume2 size={14} />}
          {config.tray.showBattery && <Battery size={14} />}
        </div>
        <div className="tb-w11-clock">
          <div>{config.time}</div>
          <div style={{ opacity: 0.8 }}>{config.date}</div>
        </div>
      </div>
    </div>
  );
}
