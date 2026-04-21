import type { TaskbarConfig } from "@/lib/storage";
import { Volume2, Wifi, Battery } from "lucide-react";

export function TaskbarXP({ config }: { config: TaskbarConfig }) {
  const running = config.icons.filter(i => i.isRunning);
  const pinned = config.icons.filter(i => !i.isRunning);

  return (
    <div style={{
      height: 30,
      display: "flex",
      alignItems: "stretch",
      backgroundImage: "url(/xp-assets/TaskbarBackground.png)",
      backgroundRepeat: "repeat-x",
      backgroundSize: "auto 100%",
      fontFamily: "Tahoma, 'Segoe UI', sans-serif",
      fontSize: 11,
      color: "white",
      position: "relative",
    }}>
      {/* Start button — real XP sprite (99x99 sprite sheet: 3 states vertically) */}
      <div style={{
        width: 95,
        height: 30,
        backgroundImage: "url(/xp-assets/StartButton.png)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 0",
        backgroundSize: "95px 90px",
        cursor: "pointer",
        flexShrink: 0,
      }} title="Start" />

      {/* Pinned + quick launch icons */}
      {pinned.length > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 4, padding: "0 6px",
          borderRight: "1px solid rgba(255,255,255,0.15)",
        }}>
          {pinned.slice(0, 5).map(i => (
            <img key={i.uid} src={i.svgDataUri} alt={i.name}
              style={{ width: 20, height: 20, imageRendering: "pixelated" }} />
          ))}
        </div>
      )}

      {/* Running apps */}
      <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 6px", flex: 1 }}>
        {running.map(i => (
          <div key={i.uid} style={{
            display: "flex", alignItems: "center", gap: 5,
            height: 22, padding: "0 8px",
            background: "linear-gradient(to bottom, #2b68cc 0%, #1a4fa0 100%)",
            border: "1px solid #1443a0",
            borderRadius: 3,
            maxWidth: 150,
            overflow: "hidden",
          }}>
            <img src={i.svgDataUri} alt={i.name} style={{ width: 16, height: 16, flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>
              {i.name}
            </span>
          </div>
        ))}
      </div>

      {/* System tray — real XP tray background */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, padding: "0 10px",
        backgroundImage: "url(/xp-assets/TaskbarTray.png)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center",
        backgroundSize: "auto 100%",
        paddingRight: 14,
        flexShrink: 0,
      }}>
        {config.tray.showVolume   && <Volume2 size={13} />}
        {config.tray.showWifi     && <Wifi    size={13} />}
        {config.tray.showBattery  && <Battery size={13} />}
        <span style={{ fontSize: 11, lineHeight: 1.2, textAlign: "right", paddingLeft: 6 }}>
          {config.time}
        </span>
      </div>
    </div>
  );
}
