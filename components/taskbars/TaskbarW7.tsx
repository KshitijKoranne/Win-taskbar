"use client";
import { useState } from "react";
import type { TaskbarConfig } from "@/lib/storage";
import { Volume2, Wifi, Battery, Languages } from "lucide-react";

function StartOrb() {
  const [state, setState] = useState<"normal"|"hover"|"active">("normal");
  return (
    <div
      style={{
        width: 54, height: 54,
        backgroundImage: `url(/w7-assets/start-${state}.png)`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        cursor: "pointer",
        flexShrink: 0,
        marginTop: -7, // orb bleeds above taskbar bar like original
        zIndex: 10,
      }}
      onMouseEnter={() => setState("hover")}
      onMouseLeave={() => setState("normal")}
      onMouseDown={() => setState("active")}
      onMouseUp={() => setState("hover")}
      title="Start"
    />
  );
}

export function TaskbarW7({ config }: { config: TaskbarConfig }) {
  return (
    <div className="tb-w7">
      <StartOrb />
      <div className="tb-w7-icons">
        {config.icons.map(i => (
          <div key={i.uid} className={`tb-w7-icon ${i.isRunning ? "running" : ""}`}>
            <img src={i.svgDataUri} alt={i.name} />
          </div>
        ))}
      </div>
      <div className="tb-w7-tray">
        {config.tray.showLanguage && <Languages size={14} />}
        {config.tray.showVolume   && <Volume2   size={14} />}
        {config.tray.showWifi     && <Wifi       size={14} />}
        {config.tray.showBattery  && <Battery    size={14} />}
        <div className="tb-w7-clock">
          <div>{config.time}</div>
          <div style={{ fontSize: 10, opacity: 0.8 }}>{config.date}</div>
        </div>
      </div>
    </div>
  );
}
