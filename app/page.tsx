"use client";

import { useEffect, useRef, useState } from "react";
import { toPng, toJpeg } from "html-to-image";
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors, closestCenter,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { ICON_LIBRARY, CATEGORIES, type LibraryIcon } from "@/lib/icons";
import {
  DEFAULT_CONFIG, loadPresets, savePresets,
  type Preset, type TaskbarConfig, type TaskbarIcon, type WinVersion, type WeatherConfig,
} from "@/lib/storage";
import { TaskbarXP } from "@/components/taskbars/TaskbarXP";
import { TaskbarW7 }  from "@/components/taskbars/TaskbarW7";
import { TaskbarW10 } from "@/components/taskbars/TaskbarW10";
import { TaskbarW11 } from "@/components/taskbars/TaskbarW11";
import { SortableIcon } from "@/components/SortableIcon";
import { Download, Save, Trash2, Upload } from "lucide-react";

const TASKBARS = { xp: TaskbarXP, w7: TaskbarW7, w10: TaskbarW10, w11: TaskbarW11 } as const;
const VERSION_LABELS: Record<WinVersion, string> = { xp: "Windows XP", w7: "Windows 7", w10: "Windows 10", w11: "Windows 11" };
const WEATHER_CONDITIONS = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Snowy", "Stormy", "Foggy"];
const WEATHER_ICONS = ["sun", "cloud", "cloud", "rain", "snow", "storm", "fog"] as const;

function Btn({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button onClick={onClick}
      className={`rounded-md border border-[var(--border)] px-3 py-2 text-sm transition hover:border-[var(--text-dim)] ${className}`}>
      {children}
    </button>
  );
}

export default function HomePage() {
  const [config, setConfig]           = useState<TaskbarConfig>(DEFAULT_CONFIG);
  const [presets, setPresets]         = useState<Preset[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [presetName, setPresetName]   = useState("");
  const [activeCategory, setActiveCategory] = useState<LibraryIcon["category"] | "all">("all");
  const [search, setSearch]           = useState("");
  const taskbarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPresets(loadPresets()); }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function addIconFromLibrary(libIcon: LibraryIcon) {
    const icon: TaskbarIcon = {
      uid: `${libIcon.id}-${Date.now()}`, iconId: libIcon.id,
      name: libIcon.name, svgDataUri: libIcon.svgDataUri,
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

  function handleCustomUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
    try {
      const fn = format === "png" ? toPng : toJpeg;
      const dataUrl = await fn(taskbarRef.current, {
        backgroundColor: format === "jpg" ? "#000000" : undefined,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `taskbar-${config.version}-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    }
  }

  function saveAsPreset() {
    if (!presetName.trim()) return;
    const preset: Preset = { id: `p-${Date.now()}`, name: presetName.trim(), config, createdAt: Date.now() };
    const next = [preset, ...presets];
    setPresets(next); savePresets(next); setPresetName("");
  }

  const TaskbarComp = TASKBARS[config.version];
  const activeIcon = activeDragId ? config.icons.find(i => i.uid === activeDragId) : null;

  const filteredIcons = ICON_LIBRARY
    .filter(i => activeCategory === "all" || i.category === activeCategory)
    .filter(i => !search.trim() || i.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Taskbar Builder</h1>
          <p className="text-sm text-[var(--text-dim)]">Build & export custom Windows taskbars</p>
        </div>
        <div className="flex gap-2">
          <Btn onClick={() => exportAs("png")} className="flex items-center gap-2 bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]">
            <Download size={14} /> PNG
          </Btn>
          <Btn onClick={() => exportAs("jpg")} className="flex items-center gap-2">
            <Download size={14} /> JPG
          </Btn>
        </div>
      </header>

      {/* === PREVIEW === */}
      <section className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-[var(--text-dim)]">
            Preview — {VERSION_LABELS[config.version]}
          </span>
          <span className="text-xs text-[var(--text-dim)]">{Math.round(config.scale * 100)}% scale</span>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[#111] p-8 overflow-auto"
          style={{ backgroundImage: "linear-gradient(45deg,#1a1a1a 25%,transparent 25%),linear-gradient(-45deg,#1a1a1a 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#1a1a1a 75%),linear-gradient(-45deg,transparent 75%,#1a1a1a 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0,0 10px,10px -10px,-10px 0" }}>
          <div ref={taskbarRef} style={{ minWidth: 800, transformOrigin: "left center", transform: `scale(${config.scale})`, transition: "transform 0.15s" }}>
            <TaskbarComp config={config} />
          </div>
        </div>
        <p className="mt-1 text-xs text-[var(--text-dim)]">
          Click icon in taskbar to cycle: idle → running → {config.version === "w11" ? "active → " : ""}remove
        </p>
      </section>

      {/* === DRAG / REORDER PANEL (below preview) === */}
      <section className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Icons in taskbar ({config.icons.length})</h2>
          {config.icons.length > 0 && (
            <button onClick={() => setConfig(c => ({ ...c, icons: [] }))}
              className="text-xs text-[var(--text-dim)] hover:text-red-400">Clear all</button>
          )}
        </div>
        {config.icons.length === 0
          ? <p className="text-xs text-[var(--text-dim)]">Add icons from the library below.</p>
          : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <SortableContext items={config.icons.map(i => i.uid)}>
                <div className="flex flex-wrap gap-2">
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
        <p className="mt-2 text-xs text-[var(--text-dim)]">Drag to reorder.</p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* === LEFT CONTROLS === */}
        <section className="space-y-4 lg:col-span-1">

          {/* Version */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold">Windows version</h2>
            <div className="grid grid-cols-2 gap-2">
              {(["xp","w7","w10","w11"] as WinVersion[]).map(v => (
                <button key={v} onClick={() => setConfig(c => ({ ...c, version: v }))}
                  className={`rounded-md border px-3 py-2 text-sm transition ${config.version === v ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : "border-[var(--border)] hover:border-[var(--text-dim)]"}`}>
                  {VERSION_LABELS[v]}
                </button>
              ))}
            </div>
          </div>

          {/* Scale */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold">Resolution / Scale</h2>
            <input type="range" min={0.5} max={2} step={0.05} value={config.scale}
              onChange={e => setConfig(c => ({ ...c, scale: parseFloat(e.target.value) }))}
              className="w-full accent-[var(--accent)]" />
            <div className="mt-1 flex justify-between text-xs text-[var(--text-dim)]">
              <span>50%</span><span className="text-[var(--accent)]">{Math.round(config.scale * 100)}%</span><span>200%</span>
            </div>
            <p className="mt-1 text-xs text-[var(--text-dim)]">Export captures at 2× pixel density regardless of scale.</p>
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

          {/* Weather (Win11 only) */}
          <div className={`rounded-lg border bg-[var(--panel)] p-4 transition ${config.version !== "w11" ? "opacity-40 pointer-events-none" : "border-[var(--border)]"}`}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Weather widget <span className="text-xs text-[var(--text-dim)]">(Win 11 only)</span></h2>
              <label className="flex items-center gap-2 text-xs">
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
                  const idx = WEATHER_CONDITIONS.indexOf(e.target.value);
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
              {(["showWifi","showVolume","showBattery","showLanguage"] as const).map(k => (
                <label key={k} className="flex items-center gap-2">
                  <input type="checkbox" checked={config.tray[k]}
                    onChange={e => setConfig(c => ({ ...c, tray: { ...c.tray, [k]: e.target.checked } }))} />
                  {k.replace("show", "")}
                </label>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold">Presets</h2>
            <div className="mb-2 flex gap-2">
              <input value={presetName} onChange={e => setPresetName(e.target.value)}
                placeholder="Preset name" onKeyDown={e => e.key === "Enter" && saveAsPreset()}
                className="flex-1 rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm" />
              <Btn onClick={saveAsPreset} className="flex items-center gap-1"><Save size={14} /> Save</Btn>
            </div>
            <div className="max-h-48 space-y-1 overflow-auto">
              {presets.length === 0 && <p className="text-xs text-[var(--text-dim)]">No saved presets.</p>}
              {presets.map(p => (
                <div key={p.id} className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm">
                  <button onClick={() => setConfig(p.config)} className="flex-1 text-left hover:text-[var(--accent)]">{p.name}</button>
                  <button onClick={() => { const n = presets.filter(x => x.id !== p.id); setPresets(n); savePresets(n); }}
                    className="text-[var(--text-dim)] hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === ICON LIBRARY === */}
        <section className="lg:col-span-2">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Icon library</h2>
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 rounded-md border border-[var(--border)] px-3 py-1.5 text-xs hover:border-[var(--accent)]">
                <Upload size={12} /> Upload custom
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleCustomUpload} />
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search icons…"
              className="mb-2 w-full rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm" />
            <div className="mb-3 flex flex-wrap gap-1">
              <button onClick={() => setActiveCategory("all")}
                className={`rounded-md px-2 py-1 text-xs transition ${activeCategory === "all" ? "bg-[var(--accent)] text-black" : "border border-[var(--border)] hover:border-[var(--text-dim)]"}`}>
                All
              </button>
              {CATEGORIES.map(c => (
                <button key={c.key} onClick={() => setActiveCategory(c.key)}
                  className={`rounded-md px-2 py-1 text-xs transition ${activeCategory === c.key ? "bg-[var(--accent)] text-black" : "border border-[var(--border)] hover:border-[var(--text-dim)]"}`}>
                  {c.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-9 max-h-[460px] overflow-auto">
              {filteredIcons.map(icon => (
                <button key={icon.id} onClick={() => addIconFromLibrary(icon)} className="lib-icon">
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
