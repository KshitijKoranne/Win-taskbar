"use client";
import { useState } from "react";
import type { TaskbarConfig } from "@/lib/storage";
import { Volume2, Wifi, Battery, Languages } from "lucide-react";

function StartOrb() {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const state = active ? "active" : hover ? "hover" : "normal";
  return (
    <div style={{ width: 54, height: 54, flexShrink: 0, marginTop: -7, zIndex: 10, cursor: "pointer" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}>
      {/* Real <img> tag — gets properly inlined by our rasterize util before export */}
      <img src={`/w7-assets/start-${state}.png`} alt="Start"
        style={{ width: 54, height: 54, display: "block", pointerEvents: "none" }} />
    </div>
  );
}

export function TaskbarW7({ config, width, height, edgeRadius = 0 }: { config: TaskbarConfig; width: number; height: number; edgeRadius?: number }) {
  return (
    <div className="tb-w7" style={{ width, height: height, minWidth: "unset", overflow: "hidden", borderRadius: edgeRadius }}>
      <StartOrb />
      <div className="tb-w7-icons" style={{ flex: 1 }}>
        {config.icons.map(i => (
          <div key={i.uid} className={`tb-w7-icon ${i.isRunning ? "running" : ""}`}>
            <img src={i.svgDataUri} alt={i.name} />
          </div>
        ))}
      </div>
      <div className="tb-w7-tray">
        {config.tray.showLanguage && <Languages size={14} />}
        {config.tray.showVolume   && <Volume2   size={14} />}
        {config.tray.showWifi     && <Wifi      size={14} />}
        {config.tray.showBattery  && <Battery   size={14} />}
        <div className="tb-w7-clock">
          <div>{config.time}</div>
          <div style={{ fontSize: 10, opacity: 0.8 }}>{config.date}</div>
        </div>
      </div>
    </div>
  );
}
