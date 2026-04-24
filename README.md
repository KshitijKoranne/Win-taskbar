# Taskbar Builder

A web app for building pixel-accurate Windows taskbar mockups — pick a Windows version, load it up with icons, set the clock and tray, and export a clean PNG or JPG at native screen resolution.

Built for designers, wallpaper makers, and anyone who needs a realistic Windows taskbar without firing up a VM.

---

## What it does

**Three Windows versions** — Windows 7, 10, and 11, each rendered authentically:
- Win7 uses real Luna Blue assets (start orb, Aero glass texture, native shell icons)
- Win10 is flat dark with the classic search bar and blue running indicator
- Win11 has centered icons, the gradient four-pane logo, a pill search bar, and the weather widget

**Icon library (~350 icons)** — 283 native Win7 shell icons (shell32 + imageres), MS Office suite, browser icons (Chrome, Firefox, Edge, Brave, Opera), and icons across dev, social, creative, media, productivity, and gaming categories.

**Drag to reorder** — rearrange pinned icons in the taskbar panel with drag-and-drop.

**Running & active states** — click an icon to cycle between idle, running, and active. Running apps show the Aero glow (Win7), blue underline (Win10), or dot indicator (Win11).

**Clock, tray, and weather** — set a custom date and time, toggle Wi-Fi / volume / battery / language indicators, and configure the Win11 weather widget (temp, condition, icon).

**Resolution presets** — 11 screen sizes from 720p to 8K, each with OS-accurate taskbar heights.

**Export at native resolution** — PNG or JPG at the exact pixel dimensions of the selected screen size. No upscaling, no blur.

**Presets** — save and restore full taskbar configurations.

---

## Stack

Next.js · TypeScript · Tailwind · Vercel

---

## Live

[win-taskbar.vercel.app](https://win-taskbar.vercel.app)
