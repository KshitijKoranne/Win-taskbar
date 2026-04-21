import type { TaskbarConfig } from "@/lib/storage";
import { Volume2, Wifi, Battery, Languages } from "lucide-react";

export function TaskbarW7({ config }: { config: TaskbarConfig }) {
  return (
    <div className="tb-w7">
      <div className="tb-w7-start">
        <div className="tb-w7-start-orb" />
      </div>
      <div className="tb-w7-icons">
        {config.icons.map(i => (
          <div key={i.uid} className={`tb-w7-icon ${i.isRunning ? "running" : ""}`}>
            <img src={i.svgDataUri} alt={i.name} />
          </div>
        ))}
      </div>
      <div className="tb-w7-tray">
        {config.tray.showLanguage && <Languages size={14} />}
        {config.tray.showVolume && <Volume2 size={14} />}
        {config.tray.showWifi && <Wifi size={14} />}
        {config.tray.showBattery && <Battery size={14} />}
        <div className="tb-w7-clock">
          <div>{config.time}</div>
          <div style={{ fontSize: 10, opacity: 0.8 }}>{config.date}</div>
        </div>
      </div>
    </div>
  );
}
