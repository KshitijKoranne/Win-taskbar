"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typed, setTyped] = useState("");
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const words = ["taskbars.", "mockups.", "screenshots.", "nostalgia."];
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Cursor follower
  useEffect(() => {
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Typewriter
  useEffect(() => {
    const word = words[wordIdx];
    const delay = deleting ? 60 : charIdx === word.length ? 1200 : 80;
    const t = setTimeout(() => {
      if (!deleting && charIdx < word.length) {
        setTyped(word.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      } else if (!deleting && charIdx === word.length) {
        setDeleting(true);
      } else if (deleting && charIdx > 0) {
        setTyped(word.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      } else {
        setDeleting(false);
        setWordIdx(i => (i + 1) % words.length);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx]);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    const DOTS = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const d of DOTS) {
        d.x = (d.x + d.vx + W) % W;
        d.y = (d.y + d.vy + H) % H;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(245,158,11,0.35)";
        ctx.fill();
      }
      for (let i = 0; i < DOTS.length; i++) {
        for (let j = i + 1; j < DOTS.length; j++) {
          const dx = DOTS[i].x - DOTS[j].x, dy = DOTS[i].y - DOTS[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(DOTS[i].x, DOTS[i].y);
            ctx.lineTo(DOTS[j].x, DOTS[j].y);
            ctx.strokeStyle = `rgba(245,158,11,${0.08 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { cursor: none !important; }

        .cursor-dot {
          position: fixed; pointer-events: none; z-index: 9999;
          width: 8px; height: 8px; border-radius: 50%;
          background: #f59e0b;
          transform: translate(-50%, -50%);
          transition: transform 0.08s ease;
          mix-blend-mode: difference;
        }
        .cursor-ring {
          position: fixed; pointer-events: none; z-index: 9998;
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid rgba(245,158,11,0.4);
          transform: translate(-50%, -50%);
          transition: left 0.12s ease, top 0.12s ease;
        }

        .land-root {
          min-height: 100vh;
          background: #070709;
          color: #e8e6df;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* scanline overlay */
        .land-root::before {
          content: '';
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.04) 2px,
            rgba(0,0,0,0.04) 4px
          );
        }

        /* noise grain */
        .land-root::after {
          content: '';
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        canvas.particles { position: fixed; inset: 0; z-index: 0; pointer-events: none; }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px; height: 60px;
          border-bottom: 1px solid rgba(245,158,11,0.08);
          background: rgba(7,7,9,0.7);
          backdrop-filter: blur(20px);
        }
        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 15px;
          letter-spacing: -0.03em;
          color: #e8e6df;
        }
        .nav-logo span { color: #f59e0b; }
        .nav-cta {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 12px;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #f59e0b;
          border: 1px solid rgba(245,158,11,0.4);
          padding: 8px 20px; border-radius: 2px;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .nav-cta:hover { background: #f59e0b; color: #070709; }

        /* HERO */
        .hero {
          position: relative; z-index: 2;
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 120px 48px 80px;
          text-align: center;
        }

        .hero-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 300;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(245,158,11,0.7);
          margin-bottom: 28px;
          display: flex; align-items: center; gap: 16px;
        }
        .hero-eyebrow::before, .hero-eyebrow::after {
          content: '';
          display: block; height: 1px; width: 48px;
          background: rgba(245,158,11,0.3);
        }

        .hero-h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(48px, 8vw, 100px);
          line-height: 0.95;
          letter-spacing: -0.05em;
          margin-bottom: 16px;
        }
        .hero-h1-line2 {
          display: block;
          color: transparent;
          -webkit-text-stroke: 1px rgba(245,158,11,0.6);
        }

        .hero-typed {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(48px, 8vw, 100px);
          line-height: 0.95;
          letter-spacing: -0.05em;
          color: #f59e0b;
          display: block;
          min-height: 1.1em;
        }
        .hero-cursor {
          display: inline-block;
          width: 3px; height: 0.8em;
          background: #f59e0b;
          margin-left: 4px;
          vertical-align: middle;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }

        .hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 300;
          color: rgba(232,230,223,0.4);
          max-width: 460px; margin: 28px auto 48px;
          line-height: 1.7;
          letter-spacing: 0.01em;
        }

        .hero-buttons {
          display: flex; align-items: center; gap: 16px;
          justify-content: center; flex-wrap: wrap;
        }
        .btn-primary {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 13px;
          letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none;
          background: #f59e0b; color: #070709;
          padding: 14px 36px; border-radius: 2px;
          display: inline-flex; align-items: center; gap: 10px;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 0 48px rgba(245,158,11,0.2);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 48px rgba(245,158,11,0.35); }
        .btn-ghost {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; font-weight: 400;
          color: rgba(232,230,223,0.4);
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 0;
          transition: color 0.2s;
        }
        .btn-ghost:hover { color: rgba(232,230,223,0.8); }

        /* Floating taskbar strips */
        .taskbar-showcase {
          position: relative; z-index: 2;
          padding: 0 0 120px; overflow: hidden;
        }
        .showcase-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(232,230,223,0.2);
          text-align: center; margin-bottom: 48px;
        }

        .tb-strip-wrap {
          overflow: hidden; position: relative;
          margin-bottom: 12px;
        }
        .tb-strip {
          display: flex; align-items: center; gap: 0;
          animation: scroll-left 30s linear infinite;
          width: max-content;
        }
        .tb-strip.reverse { animation: scroll-right 35s linear infinite; }
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .tb-strip-wrap:hover .tb-strip { animation-play-state: paused; }

        /* W11 taskbar chip */
        .tb-chip-w11 {
          height: 48px;
          background: rgba(32,32,32,0.9);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          display: inline-flex; align-items: center;
          padding: 0 20px; gap: 6px;
          margin: 0 8px; flex-shrink: 0;
          font-family: 'Segoe UI', sans-serif;
          font-size: 12px; color: rgba(255,255,255,0.85);
          white-space: nowrap;
        }
        /* W10 chip */
        .tb-chip-w10 {
          height: 40px;
          background: #1b1b1b;
          border: 1px solid rgba(255,255,255,0.04);
          display: inline-flex; align-items: center;
          padding: 0 16px; gap: 6px;
          margin: 0 8px; flex-shrink: 0;
          font-size: 12px; color: rgba(255,255,255,0.7);
          white-space: nowrap;
        }
        /* W7 chip */
        .tb-chip-w7 {
          height: 40px;
          background: linear-gradient(180deg, rgba(70,115,182,0.4) 0%, rgba(20,40,100,0.7) 100%);
          border: 1px solid rgba(120,160,230,0.25);
          border-radius: 3px;
          display: inline-flex; align-items: center;
          padding: 0 12px; gap: 6px;
          margin: 0 6px; flex-shrink: 0;
          font-size: 12px; color: rgba(255,255,255,0.8);
          white-space: nowrap;
        }
        .ic-dot { width: 4px; height: 4px; border-radius: 50%; background: #60cdff; }
        .ic-dot.act { width: 14px; border-radius: 2px; }
        .ic-block { width: 20px; height: 20px; border-radius: 3px; flex-shrink: 0; }
        .ic-run-bar { width: 2px; height: 16px; background: #005fb8; }
        .orb { width: 28px; height: 28px; background: radial-gradient(circle at 40% 35%, #5ea0e0, #1a4fa0); border-radius: 50%; }
        .win11-logo { flex-shrink: 0; }

        /* FEATURES GRID */
        .features { position: relative; z-index: 2; padding: 0 48px 120px; max-width: 1200px; margin: 0 auto; }
        .feat-header {
          display: flex; align-items: baseline; gap: 20px; margin-bottom: 56px;
        }
        .feat-title {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(28px, 4vw, 48px); letter-spacing: -0.04em;
        }
        .feat-num {
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          color: rgba(245,158,11,0.5); letter-spacing: 0.1em;
        }
        .feat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1px; background: rgba(245,158,11,0.06);
          border: 1px solid rgba(245,158,11,0.06);
        }
        .feat-card {
          background: #070709; padding: 36px 32px;
          transition: background 0.2s;
          position: relative; overflow: hidden;
        }
        .feat-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px; background: transparent;
          transition: background 0.3s;
        }
        .feat-card:hover { background: rgba(245,158,11,0.03); }
        .feat-card:hover::before { background: rgba(245,158,11,0.4); }
        .feat-index {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: rgba(245,158,11,0.3);
          letter-spacing: 0.1em; margin-bottom: 20px;
        }
        .feat-card-title {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 18px; letter-spacing: -0.03em;
          margin-bottom: 12px;
        }
        .feat-card-desc {
          font-size: 13px; line-height: 1.7;
          color: rgba(232,230,223,0.4); font-weight: 300;
        }

        /* STATS */
        .stats { position: relative; z-index: 2; padding: 0 48px 120px; max-width: 1200px; margin: 0 auto; }
        .stats-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0; border: 1px solid rgba(245,158,11,0.08);
        }
        .stat-cell {
          padding: 40px 32px; border-right: 1px solid rgba(245,158,11,0.08);
          position: relative;
        }
        .stat-cell:last-child { border-right: none; }
        .stat-num {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 52px; letter-spacing: -0.05em;
          color: #f59e0b; line-height: 1;
          margin-bottom: 8px;
        }
        .stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(232,230,223,0.3);
        }

        /* CTA BOTTOM */
        .cta-bottom {
          position: relative; z-index: 2;
          text-align: center; padding: 80px 48px 60px;
          border-top: 1px solid rgba(245,158,11,0.06);
        }
        .cta-bottom-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(232,230,223,0.2); margin-bottom: 24px;
        }
        .cta-bottom-title {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(32px, 5vw, 64px);
          letter-spacing: -0.04em; margin-bottom: 40px;
          line-height: 1;
        }
        .cta-bottom-title span { color: #f59e0b; }

        /* FOOTER */
        .footer {
          position: relative; z-index: 2;
          border-top: 1px solid rgba(245,158,11,0.06);
          padding: 24px 48px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .footer-left { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(232,230,223,0.2); }
        .footer-right a {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: rgba(232,230,223,0.2); text-decoration: none;
          transition: color 0.2s;
        }
        .footer-right a:hover { color: #f59e0b; }

        /* entrance anims */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.7s ease both; }
        .anim-2 { animation: fadeUp 0.7s 0.1s ease both; }
        .anim-3 { animation: fadeUp 0.7s 0.2s ease both; }
        .anim-4 { animation: fadeUp 0.7s 0.3s ease both; }
        .anim-5 { animation: fadeUp 0.7s 0.4s ease both; }
      `}</style>

      {/* Custom cursor */}
      <div className="cursor-dot" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="cursor-ring" style={{ left: cursorPos.x, top: cursorPos.y }} />

      <div className="land-root">
        <canvas ref={canvasRef} className="particles" />

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">Taskbar<span>.</span></div>
          <Link href="/builder" className="nav-cta">Open Builder →</Link>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-eyebrow anim-1">Windows 7 · 10 · 11</div>
          <h1 className="hero-h1">
            <span className="anim-2">Build your</span>
            <span className="hero-h1-line2 anim-3">own</span>
            <span className="hero-typed anim-4">{typed}<span className="hero-cursor" /></span>
          </h1>
          <p className="hero-sub anim-4">
            Design pixel-perfect Windows taskbars. Load icons, set the clock,
            configure the tray — export at native resolution. No Photoshop required.
          </p>
          <div className="hero-buttons anim-5">
            <Link href="/builder" className="btn-primary">
              Launch Builder
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#070709" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <a href="https://github.com/KshitijKoranne/Win-taskbar" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.929.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.373-12-12-12z"/></svg>
              View on GitHub
            </a>
          </div>
        </section>

        {/* SCROLLING TASKBAR STRIPS */}
        <section className="taskbar-showcase">
          <div className="showcase-label">Live previews</div>

          {/* Win11 strip */}
          <div className="tb-strip-wrap">
            <div className="tb-strip">
              {[...Array(2)].map((_, rep) => (
                <div key={rep} style={{ display: "flex", gap: 0 }}>
                  {[
                    { icons: ["#4fc3f7","#ffb74d","#ef5350","#66bb6a","#ab47bc"], active: [0,1] },
                    { icons: ["#29b6f6","#ff7043","#42a5f5","#26c6da"], active: [2] },
                    { icons: ["#ec407a","#26a69a","#7e57c2","#ef5350","#ffa726","#78909c"], active: [0,1,2] },
                    { icons: ["#42a5f5","#66bb6a","#ffd54f"], active: [] },
                    { icons: ["#ff7043","#5c6bc0","#26c6da","#ef5350","#ab47bc"], active: [3] },
                  ].map((group, gi) => (
                    <div key={gi} className="tb-chip-w11">
                      {/* Win11 logo */}
                      <svg className="win11-logo" viewBox="0 0 88 88" width="18" height="18">
                        <defs><linearGradient id={`g${rep}${gi}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00BCF2"/><stop offset="100%" stopColor="#0078D4"/></linearGradient></defs>
                        <rect x="0" y="0" width="40" height="40" rx="2" fill={`url(#g${rep}${gi})`}/>
                        <rect x="48" y="0" width="40" height="40" rx="2" fill={`url(#g${rep}${gi})`}/>
                        <rect x="0" y="48" width="40" height="40" rx="2" fill={`url(#g${rep}${gi})`}/>
                        <rect x="48" y="48" width="40" height="40" rx="2" fill={`url(#g${rep}${gi})`}/>
                      </svg>
                      {/* Search */}
                      <div style={{ height:28, padding:"0 10px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, display:"flex", alignItems:"center", gap:5, fontSize:11, color:"rgba(255,255,255,0.4)" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        Search
                      </div>
                      {group.icons.map((c, i) => (
                        <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                          <div className="ic-block" style={{ background: c }} />
                          {group.active.includes(i) && <div className={`ic-dot ${group.active.length > 1 && i === group.active[0] ? "act" : ""}`} />}
                        </div>
                      ))}
                      <div style={{ marginLeft:"auto", fontSize:10, textAlign:"right", opacity:.6, lineHeight:1.3 }}>
                        <div>10:3{gi}</div><div style={{opacity:.5}}>Apr 21</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Win10 strip */}
          <div className="tb-strip-wrap">
            <div className="tb-strip reverse">
              {[...Array(2)].map((_, rep) => (
                <div key={rep} style={{ display: "flex", gap: 0 }}>
                  {[
                    ["#4fc3f7","#ffb74d","#ef5350","#66bb6a","#ab47bc","#ffa726"],
                    ["#29b6f6","#ff7043","#42a5f5","#26c6da","#ec407a"],
                    ["#7e57c2","#ef5350","#ffd54f","#78909c","#42a5f5","#66bb6a","#ff7043"],
                    ["#5c6bc0","#26c6da","#ab47bc"],
                    ["#ef5350","#ffa726","#42a5f5","#66bb6a"],
                  ].map((cols, gi) => (
                    <div key={gi} className="tb-chip-w10">
                      {/* Win10 start */}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="2" width="9" height="9" fill="white" opacity=".9"/>
                        <rect x="13" y="2" width="9" height="9" fill="white" opacity=".9"/>
                        <rect x="2" y="13" width="9" height="9" fill="white" opacity=".9"/>
                        <rect x="13" y="13" width="9" height="9" fill="white" opacity=".9"/>
                      </svg>
                      <div style={{ display:"flex", alignItems:"center", background:"rgba(255,255,255,0.05)", padding:"3px 12px", borderRadius:1, gap:6, height:28 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity={0.4}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <span style={{ fontSize:11, opacity:.4 }}>Search Windows</span>
                      </div>
                      {cols.map((c, i) => (
                        <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", borderBottom: i < 2 ? "2px solid #005fb8" : "none", paddingBottom:2 }}>
                          <div className="ic-block" style={{ background: c, borderRadius:2 }} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Win7 strip */}
          <div className="tb-strip-wrap">
            <div className="tb-strip">
              {[...Array(2)].map((_, rep) => (
                <div key={rep} style={{ display: "flex", gap: 0 }}>
                  {[
                    ["#4fc3f7","#ffb74d","#ef5350","#66bb6a"],
                    ["#29b6f6","#ff7043","#42a5f5","#26c6da","#ec407a"],
                    ["#7e57c2","#ef5350","#ffd54f","#78909c"],
                    ["#5c6bc0","#26c6da","#ab47bc","#ffa726"],
                    ["#ef5350","#ffa726","#42a5f5","#66bb6a","#ff7043"],
                  ].map((cols, gi) => (
                    <div key={gi} className="tb-chip-w7">
                      <div className="orb" />
                      {cols.map((c, i) => (
                        <div key={i} style={{
                          display:"flex", alignItems:"center", justifyContent:"center",
                          width:34, height:32,
                          background: i===0 ? "rgba(255,255,255,0.12)" : "transparent",
                          borderRadius:2,
                          boxShadow: i===0 ? "inset 0 0 8px rgba(160,200,255,0.3)" : "none",
                        }}>
                          <div className="ic-block" style={{ background: c, width:18, height:18, borderRadius:2 }} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="stats">
          <div className="stats-grid">
            {[
              { num: "350+", label: "Native icons" },
              { num: "3",    label: "Windows versions" },
              { num: "11",   label: "Resolution presets" },
              { num: "8K",   label: "Max export resolution" },
            ].map((s, i) => (
              <div key={i} className="stat-cell">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <section className="features">
          <div className="feat-header">
            <span className="feat-num">Features</span>
            <h2 className="feat-title">Everything you need.</h2>
          </div>
          <div className="feat-grid">
            {[
              { n:"01", t:"Three Windows versions", d:"Win7 with real Luna Blue assets and Aero glass texture. Win10 flat dark. Win11 centered icons, gradient logo, pill search, and weather widget." },
              { n:"02", t:"350+ native icons", d:"283 real shell32 and imageres icons straight from Windows 7. Plus browsers, MS Office, dev tools, social, gaming — across 9 categories." },
              { n:"03", t:"Drag, click, configure", d:"Drag icons to reorder them. Click to toggle running and active states. Set the clock, tray indicators, and the Win11 weather widget independently." },
              { n:"04", t:"Export at exact resolution", d:"11 presets from 720p to 8K. PNG or JPG at OS-accurate pixel dimensions. No upscaling, no blur, no artifacts." },
              { n:"05", t:"Save presets", d:"Build multiple configurations and save them. Switch between setups instantly. Everything persists in your browser — no account needed." },
              { n:"06", t:"Custom icon upload", d:"Not finding the icon you need? Upload any PNG or SVG. It drops straight into your taskbar alongside the native library." },
            ].map((f, i) => (
              <div key={i} className="feat-card">
                <div className="feat-index">{f.n}</div>
                <div className="feat-card-title">{f.t}</div>
                <div className="feat-card-desc">{f.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BOTTOM */}
        <section className="cta-bottom">
          <div className="cta-bottom-label">Free · No signup · Runs in your browser</div>
          <h2 className="cta-bottom-title">Ready to build?<br /><span>Start now.</span></h2>
          <Link href="/builder" className="btn-primary">
            Open the Builder
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="#070709" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-left">© 2025 KJR Labs · Taskbar Builder</div>
          <div className="footer-right">
            <a href="https://github.com/KshitijKoranne/Win-taskbar" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
        </footer>
      </div>
    </>
  );
}
