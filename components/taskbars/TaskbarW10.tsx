import type { TaskbarConfig } from "@/lib/storage";
import { Volume2, Wifi, Battery, Languages, Search } from "lucide-react";

export function TaskbarW10({ config, width, height, edgeRadius = 0 }: { config: TaskbarConfig; width: number; height: number; edgeRadius?: number }) {
  return (
    <div className="tb-w10" style={{ width, height, minWidth: "unset", overflow: "hidden", borderRadius: edgeRadius }}>
      <div className="tb-w10-start">
        <svg viewBox="0 0 24 24"><path d="M3 5l8-1v8H3zm9-1l9-1v9h-9zM3 13h8v8l-8-1zm9 0h9v9l-9-1z"/></svg>
      </div>
      <div className="tb-w10-search">
        <Search size={14} />
        <span>Type here to search</span>
      </div>
      <div className="tb-w10-icons" style={{ flex: 1 }}>
        {config.icons.map(i => (
          <div key={i.uid} className={`tb-w10-icon ${i.isRunning ? "running" : ""}`}>
            <img src={i.svgDataUri} alt={i.name} />
          </div>
        ))}
      </div>
      <div className="tb-w10-tray">
        {config.tray.showLanguage && <Languages size={14} />}
        {config.tray.showWifi     && <Wifi       size={14} />}
        {config.tray.showVolume   && <Volume2    size={14} />}
        {config.tray.showBattery  && <Battery    size={14} />}
        <div className="tb-w10-clock">
          <div>{config.time}</div>
          <div style={{ opacity: 0.8 }}>{config.date}</div>
        </div>
      </div>
    </div>
  );
}
