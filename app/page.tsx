"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { ICON_LIBRARY, type LibraryIcon } from "@/lib/icons";
import {
  DEFAULT_CONFIG,
  loadPresets,
  savePresets,
  type Preset,
  type TaskbarConfig,
  type TaskbarIcon,
  type WinVersion,
} from "@/lib/storage";
import { TaskbarXP } from "@/components/taskbars/TaskbarXP";
import { TaskbarW7 } from "@/components/taskbars/TaskbarW7";
import { TaskbarW10 } from "@/components/taskbars/TaskbarW10";
import { TaskbarW11 } from "@/components/taskbars/TaskbarW11";
import { SortableIcon } from "@/components/SortableIcon";
import { Download, Save, Trash2, Upload, Plus } from "lucide-react";

const TASKBARS = {
  xp: TaskbarXP,
  w7: TaskbarW7,
  w10: TaskbarW10,
  w11: TaskbarW11,
} as const;

const VERSION_LABELS: Record<WinVersion, string> = {
  xp: "Windows XP",
  w7: "Windows 7",
  w10: "Windows 10",
  w11: "Windows 11",
};

export default function HomePage() {
  const [config, setConfig] = useState<TaskbarConfig>(DEFAULT_CONFIG);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [presetName, setPresetName] = useState("");
  const taskbarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPresets(loadPresets());
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function addIconFromLibrary(libIcon: LibraryIcon) {
    const newIcon: TaskbarIcon = {
      uid: `${libIcon.id}-${Date.now()}`,
      iconId: libIcon.id,
      name: libIcon.name,
      svgDataUri: libIcon.svgDataUri,
      isRunning: false,
      isActive: false,
    };
    setConfig(c => ({ ...c, icons: [...c.icons, newIcon] }));
  }

  function handleIconClick(uid: string) {
    // cycle: idle -> running -> active (w11 only) -> remove
    setConfig(c => {
      const icons = [...c.icons];
      const idx = icons.findIndex(i => i.uid === uid);
      if (idx === -1) return c;
      const ic = icons[idx];
      if (!ic.isRunning) {
        icons[idx] = { ...ic, isRunning: true };
      } else if (!ic.isActive && c.version === "w11") {
        icons[idx] = { ...ic, isActive: true };
      } else {
        icons.splice(idx, 1);
      }
      return { ...c, icons };
    });
  }

  function handleDragStart(e: DragStartEvent) {
    setActiveDragId(e.active.id as string);
  }
  function handleDragEnd(e: DragEndEvent) {
    setActiveDragId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setConfig(c => {
      const oldIdx = c.icons.findIndex(i => i.uid === active.id);
      const newIdx = c.icons.findIndex(i => i.uid === over.id);
      if (oldIdx === -1 || newIdx === -1) return c;
      return { ...c, icons: arrayMove(c.icons, oldIdx, newIdx) };
    });
  }

  function handleCustomUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUri = ev.target?.result as string;
      const newIcon: TaskbarIcon = {
        uid: `custom-${Date.now()}`,
        iconId: `custom:${Date.now()}`,
        name: file.name.replace(/\.[^.]+$/, ""),
        svgDataUri: dataUri,
        isRunning: false,
        isActive: false,
      };
      setConfig(c => ({ ...c, icons: [...c.icons, newIcon] }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function exportPng() {
    if (!taskbarRef.current) return;
    try {
      const dataUrl = await toPng(taskbarRef.current, {
        backgroundColor: undefined, // transparent
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `taskbar-${config.version}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Export failed. Check console.");
    }
  }

  function saveAsPreset() {
    if (!presetName.trim()) {
      alert("Give your preset a name first.");
      return;
    }
    const preset: Preset = {
      id: `preset-${Date.now()}`,
      name: presetName.trim(),
      config,
      createdAt: Date.now(),
    };
    const next = [preset, ...presets];
    setPresets(next);
    savePresets(next);
    setPresetName("");
  }

  function loadPreset(p: Preset) {
    setConfig(p.config);
  }
  function deletePreset(id: string) {
    const next = presets.filter(p => p.id !== id);
    setPresets(next);
    savePresets(next);
  }

  const TaskbarComp = TASKBARS[config.version];
  const activeIcon = activeDragId ? config.icons.find(i => i.uid === activeDragId) : null;

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Taskbar Builder</h1>
          <p className="text-sm text-[var(--text-dim)]">Build & export custom Windows taskbars</p>
        </div>
        <button onClick={exportPng}
          className="flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:opacity-90">
          <Download size={16} /> Export PNG
        </button>
      </header>

      {/* === PREVIEW === */}
      <section className="mb-6">
        <div className="mb-2 text-xs uppercase tracking-wider text-[var(--text-dim)]">
          Preview — {VERSION_LABELS[config.version]}
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[#1a1a1a] p-8"
          style={{ backgroundImage: "linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" }}>
          <div ref={taskbarRef} style={{ minWidth: 800 }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <SortableContext items={config.icons.map(i => i.uid)} strategy={horizontalListSortingStrategy}>
                <TaskbarComp config={config} />
              </SortableContext>
              <DragOverlay>
                {activeIcon ? (
                  <div className="lib-icon drag-overlay">
                    <img src={activeIcon.svgDataUri} alt={activeIcon.name} />
                    <span>{activeIcon.name}</span>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
        <p className="mt-2 text-xs text-[var(--text-dim)]">
          Tip: click an icon in the taskbar to cycle through states (idle → running → remove). Drag to reorder.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* === CONTROLS === */}
        <section className="space-y-4 lg:col-span-1">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold">Windows version</h2>
            <div className="grid grid-cols-2 gap-2">
              {(["xp", "w7", "w10", "w11"] as WinVersion[]).map(v => (
                <button key={v} onClick={() => setConfig(c => ({ ...c, version: v }))}
                  className={`rounded-md border px-3 py-2 text-sm transition ${
                    config.version === v
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "border-[var(--border)] hover:border-[var(--text-dim)]"
                  }`}>
                  {VERSION_LABELS[v]}
                </button>
              ))}
            </div>
          </div>

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

          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold">System tray</h2>
            <div className="space-y-2 text-sm">
              {(["showWifi", "showVolume", "showBattery", "showLanguage"] as const).map(k => (
                <label key={k} className="flex items-center gap-2">
                  <input type="checkbox" checked={config.tray[k]}
                    onChange={e => setConfig(c => ({ ...c, tray: { ...c.tray, [k]: e.target.checked } }))} />
                  {k.replace("show", "")}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold">Presets</h2>
            <div className="mb-2 flex gap-2">
              <input value={presetName} onChange={e => setPresetName(e.target.value)}
                placeholder="Preset name"
                className="flex-1 rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm" />
              <button onClick={saveAsPreset}
                className="flex items-center gap-1 rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--accent)]">
                <Save size={14} /> Save
              </button>
            </div>
            <div className="space-y-1 max-h-48 overflow-auto">
              {presets.length === 0 && <p className="text-xs text-[var(--text-dim)]">No saved presets yet.</p>}
              {presets.map(p => (
                <div key={p.id} className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm">
                  <button onClick={() => loadPreset(p)} className="flex-1 text-left hover:text-[var(--accent)]">{p.name}</button>
                  <button onClick={() => deletePreset(p.id)} className="text-[var(--text-dim)] hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
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
            <p className="mb-3 text-xs text-[var(--text-dim)]">Click to add to taskbar.</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
              {ICON_LIBRARY.map(icon => (
                <button key={icon.id} onClick={() => addIconFromLibrary(icon)} className="lib-icon">
                  <img src={icon.svgDataUri} alt={icon.name} />
                  <span>{icon.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold">Icons in taskbar ({config.icons.length})</h2>
            {config.icons.length === 0 ? (
              <p className="text-xs text-[var(--text-dim)]">Add icons from the library above.</p>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <SortableContext items={config.icons.map(i => i.uid)}>
                    {config.icons.map(icon => (
                      <SortableIcon key={icon.uid} icon={icon} onClick={handleIconClick} />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            )}
            <p className="mt-2 text-xs text-[var(--text-dim)]">
              Drag to reorder. Click cycles: idle → running → {config.version === "w11" ? "active → " : ""}remove.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
