import type { TaskbarConfig } from "@/lib/storage";
import { Volume2, Wifi, Battery, Languages } from "lucide-react";

export function TaskbarXP({ config }: { config: TaskbarConfig }) {
  const running = config.icons.filter(i => i.isRunning);
  return (
    <div className="tb-xp">
      <div className="tb-xp-start">start</div>
      <div className="tb-xp-pinned">
        {config.icons.filter(i => !i.isRunning).slice(0, 4).map(i => (
          <img key={i.uid} src={i.svgDataUri} alt={i.name} className="tb-icon" />
        ))}
      </div>
      <div className="tb-xp-running">
        {running.map(i => (
          <div key={i.uid} className="tb-xp-app">
            <img src={i.svgDataUri} alt={i.name} style={{ width: 16, height: 16 }} />
            <span>{i.name}</span>
          </div>
        ))}
      </div>
      <div className="tb-xp-tray">
        {config.tray.showVolume && <Volume2 size={14} />}
        {config.tray.showWifi && <Wifi size={14} />}
        {config.tray.showBattery && <Battery size={14} />}
        {config.tray.showLanguage && <Languages size={14} />}
        <div className="tb-xp-clock">{config.time}</div>
      </div>
    </div>
  );
}
