"use client";

import { useEffect, useRef, useState } from "react";
import { toPng, toJpeg } from "html-to-image";
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors, closestCenter,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { ICON_LIBRARY, CATEGORIES, type LibraryIcon } from "@/lib/icons";
import {
  DEFAULT_CONFIG, loadPresets, savePresets, RESOLUTIONS,
  type Preset, type TaskbarConfig, type TaskbarIcon, type WinVersion,
} from "@/lib/storage";
import { TaskbarW7 }  from "@/components/taskbars/TaskbarW7";
import { TaskbarW10 } from "@/components/taskbars/TaskbarW10";
import { TaskbarW11 } from "@/components/taskbars/TaskbarW11";
import { SortableIcon } from "@/components/SortableIcon";
import { Download, Save, Trash2, Upload } from "lucide-react";

const TASKBARS = { w7: TaskbarW7, w10: TaskbarW10, w11: TaskbarW11 } as const;
const VERSION_LABELS: Record<WinVersion, string> = {
  w7: "Windows 7", w10: "Windows 10", w11: "Windows 11",
};
const WEATHER_CONDITIONS = ["Sunny","Partly Cloudy","Cloudy","Rainy","Snowy","Stormy","Foggy"] as const;
const WEATHER_ICONS       = ["sun","cloud","cloud","rain","snow","storm","fog"] as const;

const FOLDER_ICON: LibraryIcon = {
  id: "folder", name: "Folder", color: "#FFD700", category: "win7",
  svgDataUri: "/w7-assets/icons/imageres_3.webp",
};

// Width of the preview container in the UI (CSS px)
const PREVIEW_WIDTH = 900;

export default function HomePage() {
  const [config, setConfig]             = useState<TaskbarConfig>(DEFAULT_CONFIG);
  const [presets, setPresets]           = useState<Preset[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [presetName, setPresetName]     = useState("");
  const [activeCategory, setActiveCategory] = useState<LibraryIcon["category"] | "all">("all");
  const [search, setSearch]             = useState("");
  const [exporting, setExporting]       = useState(false);

  // Single ref — the preview IS the export source
  const taskbarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPresets(loadPresets()); }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const res = RESOLUTIONS[config.resolutionIdx];
  const tbHeight = res.taskbarHeight[config.version as keyof typeof res.taskbarHeight] ?? 48;
  const taskbarEdges = config.taskbarEdges ?? "square";
  const edgeRadius = taskbarEdges === "rounded" ? 8 : 0;

  // Scale factor for the preview: fit PREVIEW_WIDTH
  const previewScale = PREVIEW_WIDTH / res.w;
  const previewHeight = tbHeight * previewScale;

  function addIcon(lib: LibraryIcon) {
    const icon: TaskbarIcon = {
      uid: `${lib.id}-${Date.now()}`, iconId: lib.id,
      name: lib.name, svgDataUri: lib.svgDataUri,
      isRunning: false, isActive: false,
    };
    setConfig(c => ({ ...c, icons: [...c.icons, icon] }));
  }

  function handleIconClick(uid: string) {
    setConfig(c => {
      const icons = [...c.icons];
      const idx = icons.findIndex(i => i.uid === uid);
      if (idx === -1) return c;
      const ic = icons[idx];
      if (!ic.isRunning) icons[idx] = { ...ic, isRunning: true };
      else if (!ic.isActive && c.version === "w11") icons[idx] = { ...ic, isActive: true };
      else icons.splice(idx, 1);
      return { ...c, icons };
    });
  }

  function handleDragStart(e: DragStartEvent) { setActiveDragId(e.active.id as string); }
  function handleDragEnd(e: DragEndEvent) {
    setActiveDragId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setConfig(c => {
      const o = c.icons.findIndex(i => i.uid === active.id);
      const n = c.icons.findIndex(i => i.uid === over.id);
      return o === -1 || n === -1 ? c : { ...c, icons: arrayMove(c.icons, o, n) };
    });
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const icon: TaskbarIcon = {
        uid: `custom-${Date.now()}`, iconId: `custom:${Date.now()}`,
        name: file.name.replace(/\.[^.]+$/, ""),
        svgDataUri: ev.target?.result as string,
        isRunning: false, isActive: false,
      };
      setConfig(c => ({ ...c, icons: [...c.icons, icon] }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function exportAs(format: "png" | "jpg") {
    if (!taskbarRef.current) return;
    setExporting(true);
    try {
      // Clone the visible node
      const clone = taskbarRef.current.cloneNode(true) as HTMLElement;

      // Remove transform and set exact native dimensions
      clone.style.transform = "none";
      clone.style.transformOrigin = "top left";
      clone.style.width = `${res.w}px`;
      clone.style.height = `${tbHeight}px`;
      clone.style.position = "fixed";
      clone.style.top = "0";
      clone.style.left = "0";
      clone.style.zIndex = "99999";
      clone.style.overflow = "hidden";
      clone.style.borderRadius = `${edgeRadius}px`;

      // Append to body so it's visible and fully painted
      document.body.appendChild(clone);

      // Inline all <img> src and CSS background-image to base64
      // so html-to-image doesn't need to re-fetch anything
      const imgs = Array.from(clone.querySelectorAll("img")) as HTMLImageElement[];
      await Promise.all(imgs.map(async (img) => {
        if (!img.src || img.src.startsWith("data:")) return;
        try {
          const res2 = await fetch(img.src);
          const blob = await res2.blob();
          img.src = await new Promise<string>((ok, err) => {
            const r = new FileReader();
            r.onloadend = () => ok(r.result as string);
            r.onerror = err;
            r.readAsDataURL(blob);
          });
        } catch { /* leave as-is */ }
      }));

      // Inline CSS background-image urls
      const allEls = Array.from(clone.querySelectorAll("*")) as HTMLElement[];
      await Promise.all(allEls.map(async (el) => {
        try {
          const bg = window.getComputedStyle(el).backgroundImage;
          const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
          if (match?.[1] && !match[1].startsWith("data:")) {
            const r = await fetch(match[1]);
            const blob = await r.blob();
            const b64 = await new Promise<string>((ok, er) => {
              const rd = new FileReader();
              rd.onloadend = () => ok(rd.result as string);
              rd.onerror = er;
              rd.readAsDataURL(blob);
            });
            el.style.backgroundImage = `url("${b64}")`;
          }
        } catch { /* skip */ }
      }));

      // Two frames for paint to settle
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      const fn = format === "png" ? toPng : toJpeg;
      const url = await fn(clone, {
        backgroundColor: format === "jpg" ? "#000000" : undefined,
        pixelRatio: 1,
        width: res.w,
        height: tbHeight,
        cacheBust: false,
      });

      document.body.removeChild(clone);

      const a = document.createElement("a");
      a.download = `taskbar-${config.version}-${res.w}x${tbHeight}.${format}`;
      a.href = url;
      a.click();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. See console for details.");
    } finally {
      setExporting(false);
    }
  }

  function savePreset() {
    if (!presetName.trim()) return;
    const p: Preset = { id: `p-${Date.now()}`, name: presetName.trim(), config, createdAt: Date.now() };
    const next = [p, ...presets];
    setPresets(next); savePresets(next); setPresetName("");
  }

  const TaskbarComp = TASKBARS[config.version as keyof typeof TASKBARS] ?? TaskbarW11;
  const activeIcon = activeDragId ? config.icons.find(i => i.uid === activeDragId) : null;
  const filteredIcons = [FOLDER_ICON, ...ICON_LIBRARY]
    .filter(i => activeCategory === "all" || i.category === activeCategory)
    .filter(i => !search.trim() || i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen p-6">

      {/* HEADER */}
      <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Taskbar Builder</h1>
          <p className="text-sm text-[var(--text-dim)]">Build & export custom Windows taskbars at native resolution</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input value={presetName} onChange={e => setPresetName(e.target.value)}
            placeholder="Preset name…" onKeyDown={e => e.key === "Enter" && savePreset()}
            className="rounded-md border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm w-36" />
          <button onClick={savePreset}
            className="flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm hover:border-[var(--accent)]">
            <Save size={14} /> Save
          </button>
          <button onClick={() => exportAs("png")} disabled={exporting}
            className="flex items-center gap-1 rounded-md border border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-2 text-sm hover:bg-[var(--accent)]/20 disabled:opacity-50">
            <Download size={14} /> {exporting ? "Exporting…" : "PNG"}
          </button>
          <button onClick={() => exportAs("jpg")} disabled={exporting}
            className="flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm hover:border-[var(--text-dim)] disabled:opacity-50">
            <Download size={14} /> JPG
          </button>
        </div>
      </header>


      {/* PREVIEW — centered */}
      <section className="mb-4 flex flex-col items-center">
        <div className="mb-2 flex items-center justify-between text-xs text-[var(--text-dim)] w-full max-w-[900px]">
          <span className="uppercase tracking-wider">
            {VERSION_LABELS[config.version]} — {res.label} — {res.w}×{tbHeight}px
          </span>
          <span>export is exact {res.w}px wide</span>
        </div>
        <div className="rounded-lg border border-[var(--border)] overflow-hidden"
          style={{
            width: PREVIEW_WIDTH,
            height: previewHeight,
            background: "repeating-conic-gradient(#1a1a1a 0% 25%, #111 0% 50%) 0 0 / 20px 20px",
          }}>
          <div
            ref={taskbarRef}
            style={{
              width: res.w,
              height: tbHeight,
              transform: `scale(${previewScale})`,
              transformOrigin: "top left",
              borderRadius: edgeRadius,
              overflow: "hidden",
            }}
          >
            <TaskbarComp config={config} width={res.w} height={tbHeight} edgeRadius={edgeRadius} />
          </div>
        </div>
        <p className="mt-1 text-xs text-[var(--text-dim)] w-full max-w-[900px]">
          Click icon in taskbar to cycle: idle → running → {config.version === "w11" ? "active → " : ""}remove
        </p>
      </section>



      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* CONTROLS */}
        <section className="space-y-4 lg:col-span-1">

          {/* Version */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold">Windows version</h2>
            <div className="grid grid-cols-1 gap-2">
              {(["w7","w10","w11"] as WinVersion[]).map(v => (
                <button key={v} onClick={() => setConfig(c => ({ ...c, version: v }))}
                  className={`rounded-md border px-3 py-2 text-sm transition text-left ${config.version === v ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : "border-[var(--border)] hover:border-[var(--text-dim)]"}`}>
                  {VERSION_LABELS[v]}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold">Taskbar edges</h2>
            <div className="grid grid-cols-2 gap-2">
              {(["square", "rounded"] as const).map(edge => (
                <button key={edge} onClick={() => setConfig(c => ({ ...c, taskbarEdges: edge }))}
                  className={`rounded-md border px-3 py-2 text-sm capitalize transition ${taskbarEdges === edge ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : "border-[var(--border)] hover:border-[var(--text-dim)]"}`}>
                  {edge}
                </button>
              ))}
            </div>
          </div>

          {/* Icons in taskbar — compact */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Taskbar icons ({config.icons.length})</h2>
              {config.icons.length > 0 && (
                <button onClick={() => setConfig(c => ({ ...c, icons: [] }))}
                  className="text-xs text-[var(--text-dim)] hover:text-red-400">Clear all</button>
              )}
            </div>
            {config.icons.length === 0
              ? <p className="text-xs text-[var(--text-dim)]">Click icons in the library →</p>
              : (
                <DndContext sensors={sensors} collisionDetection={closestCenter}
                  onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <SortableContext items={config.icons.map(i => i.uid)}>
                    <div className="flex flex-wrap gap-1.5">
                      {config.icons.map(icon => (
                        <SortableIcon key={icon.uid} icon={icon} onClick={handleIconClick} />
                      ))}
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {activeIcon && (
                      <div className="lib-icon drag-overlay">
                        <img src={activeIcon.svgDataUri} alt={activeIcon.name} />
                        <span>{activeIcon.name}</span>
                      </div>
                    )}
                  </DragOverlay>
                </DndContext>
              )}
            <p className="mt-2 text-xs text-[var(--text-dim)]">Drag to reorder · click to cycle state</p>
          </div>

          {/* Resolution */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold">Screen resolution</h2>
            <p className="mb-2 text-xs text-[var(--text-dim)]">
              Taskbar export will be exactly <strong className="text-[var(--text)]">{res.w}×{tbHeight}px</strong> — native size for {res.label}.
            </p>
            <div className="space-y-1 max-h-72 overflow-auto">
              {RESOLUTIONS.map((r, i) => (
                <button key={r.label} onClick={() => setConfig(c => ({ ...c, resolutionIdx: i }))}
                  className={`w-full text-left rounded-md border px-3 py-2 text-sm transition flex items-center justify-between ${config.resolutionIdx === i ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : "border-[var(--border)] hover:border-[var(--text-dim)]"}`}>
                  <span>{r.label}</span>
                  <span className="text-xs opacity-60">{r.w}px wide</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & time */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold">Date & time</h2>
            <div className="space-y-2">
              <input value={config.time} onChange={e => setConfig(c => ({ ...c, time: e.target.value }))}
                placeholder="10:30 AM"
                className="w-full rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm" />
              <input value={config.date} onChange={e => setConfig(c => ({ ...c, date: e.target.value }))}
                placeholder="Mon, Apr 21"
                className="w-full rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm" />
            </div>
          </div>

          {/* Weather */}
          <div className={`rounded-lg border bg-[var(--panel)] p-4 ${config.version !== "w11" ? "opacity-40 pointer-events-none" : ""} border-[var(--border)]`}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Weather <span className="text-xs text-[var(--text-dim)]">(Win 11)</span></h2>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={config.weather.show}
                  onChange={e => setConfig(c => ({ ...c, weather: { ...c.weather, show: e.target.checked } }))} />
                Show
              </label>
            </div>
            <div className="space-y-2">
              <input value={config.weather.temp}
                onChange={e => setConfig(c => ({ ...c, weather: { ...c.weather, temp: e.target.value } }))}
                placeholder="24°C"
                className="w-full rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm" />
              <select value={config.weather.condition}
                onChange={e => {
                  const idx = WEATHER_CONDITIONS.indexOf(e.target.value as typeof WEATHER_CONDITIONS[number]);
                  setConfig(c => ({ ...c, weather: { ...c.weather, condition: e.target.value, icon: WEATHER_ICONS[idx >= 0 ? idx : 0] } }));
                }}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm">
                {WEATHER_CONDITIONS.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
          </div>

          {/* Tray */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold">System tray</h2>
            <div className="space-y-2 text-sm">
              {(["showWifi","showVolume","showBattery","showLanguage","showSearch"] as const).map(k => (
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={config.tray[k]}
                    onChange={e => setConfig(c => ({ ...c, tray: { ...c.tray, [k]: e.target.checked } }))} />
                  {{"showWifi":"Wi-Fi","showVolume":"Volume","showBattery":"Battery","showLanguage":"Language","showSearch":"Search bar (Win11)"}[k]}
                </label>
              ))}
            </div>
          </div>

          {/* Saved presets */}
          {presets.length > 0 && (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
              <h2 className="mb-2 text-sm font-semibold">Saved presets</h2>
              <div className="max-h-48 space-y-1 overflow-auto">
                {presets.map(p => (
                  <div key={p.id} className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm">
                    <button onClick={() => setConfig(p.config)} className="flex-1 text-left hover:text-[var(--accent)]">{p.name}</button>
                    <button onClick={() => { const n = presets.filter(x => x.id !== p.id); setPresets(n); savePresets(n); }}
                      className="text-[var(--text-dim)] hover:text-red-400 ml-2"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ICON LIBRARY */}
        <section className="lg:col-span-2">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Icon library</h2>
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 rounded-md border border-[var(--border)] px-3 py-1.5 text-xs hover:border-[var(--accent)]">
                <Upload size={12} /> Upload custom
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleUpload} />
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              className="mb-2 w-full rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm" />
            <div className="mb-3 flex flex-wrap gap-1">
              {[{ key: "all" as const, label: "All" }, ...CATEGORIES.map(c => ({ key: c.key as "all" | LibraryIcon["category"], label: c.label }))].map(c => (
                <button key={c.key} onClick={() => setActiveCategory(c.key)}
                  className={`rounded-md px-2 py-1 text-xs transition ${activeCategory === c.key ? "bg-[var(--accent)] text-black" : "border border-[var(--border)] hover:border-[var(--text-dim)]"}`}>
                  {c.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-9 max-h-[480px] overflow-auto">
              {filteredIcons.map(icon => (
                <button key={icon.id} onClick={() => addIcon(icon)} className="lib-icon">
                  <img src={icon.svgDataUri} alt={icon.name} />
                  <span>{icon.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


