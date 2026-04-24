"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typed, setTyped] = useState("");
  const [cursorPos, setCursorPos] = useState({ x: -300, y: -300 });
  const words = ["taskbars.", "mockups.", "timelines.", "screenshots."];
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const word = words[wordIdx];
    const delay = deleting ? 55 : charIdx === word.length ? 1400 : 75;
    const t = setTimeout(() => {
      if (!deleting && charIdx < word.length) { setTyped(word.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }
      else if (!deleting) { setDeleting(true); }
      else if (deleting && charIdx > 0) { setTyped(word.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }
      else { setDeleting(false); setWordIdx(i => (i + 1) % words.length); }
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const DOTS = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.4,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const d of DOTS) {
        d.x = (d.x + d.vx + W) % W; d.y = (d.y + d.vy + H) % H;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(245,158,11,0.3)"; ctx.fill();
      }
      for (let i = 0; i < DOTS.length; i++) for (let j = i+1; j < DOTS.length; j++) {
        const dx = DOTS[i].x-DOTS[j].x, dy = DOTS[i].y-DOTS[j].y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 110) {
          ctx.beginPath(); ctx.moveTo(DOTS[i].x, DOTS[i].y); ctx.lineTo(DOTS[j].x, DOTS[j].y);
          ctx.strokeStyle = `rgba(245,158,11,${0.07*(1-dist/110)})`; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  // Real icon paths from the app's public folder
  const WIN7_ICONS = [
    "/w7-assets/icons/shell32_1.webp",
    "/w7-assets/icons/shell32_2.webp",
    "/w7-assets/icons/shell32_3.webp",
    "/w7-assets/icons/shell32_15.webp",
    "/w7-assets/icons/shell32_21.webp",
    "/w7-assets/icons/shell32_23.webp",
    "/w7-assets/icons/imageres_3.webp",
    "/w7-assets/icons/imageres_15.webp",
  ];
  const BROWSER_ICONS = [
    { src: "/browser-icons/chrome.png", name: "Chrome" },
    { src: "/browser-icons/firefox.png", name: "Firefox" },
    { src: "/browser-icons/edge.png", name: "Edge" },
  ];
  const MS_ICONS = [
    { src: "/ms-icons/word.svg", name: "Word" },
    { src: "/ms-icons/excel.svg", name: "Excel" },
    { src: "/ms-icons/outlook.svg", name: "Outlook" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { cursor: none !important; }
        .cur-dot { position:fixed; pointer-events:none; z-index:9999; width:7px; height:7px; border-radius:50%; background:#f59e0b; transform:translate(-50%,-50%); mix-blend-mode:difference; }
        .cur-ring { position:fixed; pointer-events:none; z-index:9998; width:32px; height:32px; border-radius:50%; border:1px solid rgba(245,158,11,0.35); transform:translate(-50%,-50%); transition:left .1s ease,top .1s ease; }
        .root { min-height:100vh; background:#070709; color:#e8e4db; font-family:'DM Sans',sans-serif; overflow-x:hidden; position:relative; }
        .root::before { content:''; position:fixed; inset:0; z-index:1; pointer-events:none; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px); }
        canvas.pts { position:fixed; inset:0; z-index:0; pointer-events:none; }

        /* NAV */
        .nav { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:0 48px; height:58px; border-bottom:1px solid rgba(245,158,11,0.07); background:rgba(7,7,9,0.75); backdrop-filter:blur(20px); }
        .nav-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:14px; letter-spacing:-.03em; }
        .nav-logo em { color:#f59e0b; font-style:normal; }
        .nav-pill { font-family:'Syne',sans-serif; font-weight:700; font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:#f59e0b; border:1px solid rgba(245,158,11,0.35); padding:7px 18px; border-radius:2px; text-decoration:none; transition:background .15s,color .15s; }
        .nav-pill:hover { background:#f59e0b; color:#070709; }

        /* HERO */
        .hero { position:relative; z-index:2; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:130px 48px 100px; text-align:center; }
        .eyebrow { font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:300; letter-spacing:.2em; text-transform:uppercase; color:rgba(245,158,11,.65); margin-bottom:28px; display:flex; align-items:center; gap:16px; }
        .eyebrow::before,.eyebrow::after { content:''; display:block; height:1px; width:44px; background:rgba(245,158,11,.2); }
        .h1 { font-family:'Syne',sans-serif; font-weight:800; font-size:clamp(46px,8.5vw,104px); line-height:.95; letter-spacing:-.05em; margin-bottom:14px; }
        .h1-outline { display:block; color:transparent; -webkit-text-stroke:1px rgba(245,158,11,.5); }
        .h1-typed { display:block; color:#f59e0b; min-height:1.05em; }
        .blink { display:inline-block; width:3px; height:.75em; background:#f59e0b; margin-left:4px; vertical-align:middle; animation:blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity:0; } }
        .sub { font-family:'DM Sans',sans-serif; font-size:16px; font-weight:300; color:rgba(232,228,219,.38); max-width:480px; margin:26px auto 44px; line-height:1.75; }
        .hero-btns { display:flex; align-items:center; gap:14px; justify-content:center; flex-wrap:wrap; }
        .btn-a { font-family:'Syne',sans-serif; font-weight:700; font-size:12px; letter-spacing:.07em; text-transform:uppercase; text-decoration:none; background:#f59e0b; color:#070709; padding:13px 34px; border-radius:2px; display:inline-flex; align-items:center; gap:10px; box-shadow:0 0 48px rgba(245,158,11,.18); transition:transform .15s,box-shadow .15s; }
        .btn-a:hover { transform:translateY(-2px); box-shadow:0 8px 48px rgba(245,158,11,.3); }
        .btn-b { font-family:'JetBrains Mono',monospace; font-size:12px; color:rgba(232,228,219,.35); text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:color .2s; }
        .btn-b:hover { color:rgba(232,228,219,.75); }

        /* DESKTOP MOCKUP */
        .mockup-wrap { position:relative; z-index:2; padding:0 48px 100px; max-width:1100px; margin:0 auto; }
        .mono-label { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:rgba(232,228,219,.18); margin-bottom:32px; }
        .screen { background:#101014; border:1px solid rgba(255,255,255,.07); border-radius:12px; overflow:hidden; }
        .desktop-bg { height:260px; background:linear-gradient(135deg,#1a2a4a 0%,#0d1830 55%,#070a14 100%); display:flex; align-items:center; justify-content:center; position:relative; }
        .desktop-hint { font-family:'JetBrains Mono',monospace; font-size:11px; color:rgba(255,255,255,.1); letter-spacing:.12em; text-transform:uppercase; }
        .desk-clock { position:absolute; top:20px; right:28px; text-align:right; }
        .desk-clock-time { font-family:'Syne',sans-serif; font-weight:300; font-size:32px; letter-spacing:-.04em; }
        .desk-clock-date { font-size:12px; color:rgba(255,255,255,.4); margin-top:2px; font-family:'DM Sans',sans-serif; }

        /* Win11 taskbar in mockup */
        .tb11 { height:48px; background:rgba(28,28,32,.95); border-top:1px solid rgba(255,255,255,.07); display:flex; align-items:center; justify-content:center; position:relative; gap:4px; }
        .tb11-weather { position:absolute; left:0; height:100%; display:flex; align-items:center; gap:8px; padding:0 16px; border-right:1px solid rgba(255,255,255,.05); font-size:12px; font-family:'DM Sans',sans-serif; }
        .tb11-icon { width:40px; height:40px; display:flex; align-items:center; justify-content:center; border-radius:6px; position:relative; }
        .tb11-icon img { width:24px; height:24px; object-fit:contain; }
        .tb11-dot { position:absolute; bottom:3px; left:50%; transform:translateX(-50%); width:4px; height:3px; border-radius:50%; background:#60cdff; }
        .tb11-dot.wide { width:14px; border-radius:2px; }
        .tb11-search { height:30px; padding:0 12px; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.09); border-radius:20px; display:flex; align-items:center; gap:6px; font-size:12px; color:rgba(255,255,255,.45); font-family:'DM Sans',sans-serif; min-width:155px; }
        .tb11-tray { position:absolute; right:0; height:100%; display:flex; align-items:center; gap:8px; padding:0 16px; font-size:12px; font-family:'DM Sans',sans-serif; }
        .tb11-tray-clock { text-align:right; line-height:1.3; }
        .tb11-tray-clock .t { font-weight:500; font-size:12px; }
        .tb11-tray-clock .d { font-size:10px; opacity:.45; }

        /* USE CASES */
        .usecases { position:relative; z-index:2; max-width:1100px; margin:0 auto; padding:0 48px 100px; }
        .section-head { margin-bottom:52px; }
        .section-eyebrow { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:rgba(245,158,11,.45); margin-bottom:12px; }
        .section-title { font-family:'Syne',sans-serif; font-weight:800; font-size:clamp(26px,4vw,46px); letter-spacing:-.04em; line-height:1.05; }
        .uc-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:1px; background:rgba(245,158,11,.05); border:1px solid rgba(245,158,11,.06); }
        .uc-card { background:#070709; padding:36px 30px; position:relative; overflow:hidden; transition:background .2s; }
        .uc-card:hover { background:rgba(245,158,11,.025); }
        .uc-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:transparent; transition:background .3s; }
        .uc-card:hover::before { background:rgba(245,158,11,.35); }
        .uc-num { font-family:'JetBrains Mono',monospace; font-size:10px; color:rgba(245,158,11,.25); letter-spacing:.1em; margin-bottom:16px; }
        .uc-title { font-family:'Syne',sans-serif; font-weight:700; font-size:17px; letter-spacing:-.03em; margin-bottom:10px; }
        .uc-desc { font-size:13px; line-height:1.75; color:rgba(232,228,219,.38); font-weight:300; }
        .uc-tag { display:inline-block; margin-top:14px; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.08em; color:rgba(245,158,11,.55); border:1px solid rgba(245,158,11,.15); padding:3px 10px; border-radius:2px; }

        /* ICON GALLERY */
        .gallery { position:relative; z-index:2; max-width:1100px; margin:0 auto; padding:0 48px 100px; }
        .icon-row { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px; }
        .icon-chip { display:flex; align-items:center; justify-content:center; width:44px; height:44px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.06); border-radius:8px; transition:background .15s,border-color .15s; }
        .icon-chip:hover { background:rgba(245,158,11,.08); border-color:rgba(245,158,11,.2); }
        .icon-chip img { width:26px; height:26px; object-fit:contain; }

        /* STATS */
        .stats { position:relative; z-index:2; max-width:1100px; margin:0 auto; padding:0 48px 100px; }
        .stats-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); border:1px solid rgba(245,158,11,.07); }
        .stat { padding:36px 28px; border-right:1px solid rgba(245,158,11,.07); }
        .stat:last-child { border-right:none; }
        .stat-n { font-family:'Syne',sans-serif; font-weight:800; font-size:50px; letter-spacing:-.05em; color:#f59e0b; line-height:1; margin-bottom:6px; }
        .stat-l { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:rgba(232,228,219,.28); }

        /* NOTICE */
        .notice { position:relative; z-index:2; max-width:1100px; margin:0 auto; padding:0 48px 80px; }
        .notice-inner { border:1px solid rgba(245,158,11,.12); padding:24px 28px; display:flex; gap:16px; align-items:flex-start; }
        .notice-icon { font-family:'JetBrains Mono',monospace; font-size:11px; color:#f59e0b; flex-shrink:0; margin-top:1px; }
        .notice-text { font-size:13px; color:rgba(232,228,219,.4); line-height:1.7; font-weight:300; }
        .notice-text strong { color:rgba(232,228,219,.65); font-weight:500; }

        /* CTA */
        .cta { position:relative; z-index:2; text-align:center; padding:60px 48px 60px; border-top:1px solid rgba(245,158,11,.05); }
        .cta-pre { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:rgba(232,228,219,.18); margin-bottom:20px; }
        .cta-h { font-family:'Syne',sans-serif; font-weight:800; font-size:clamp(28px,5vw,60px); letter-spacing:-.04em; line-height:1; margin-bottom:36px; }
        .cta-h span { color:#f59e0b; }

        /* FOOTER */
        .footer { position:relative; z-index:2; border-top:1px solid rgba(245,158,11,.05); padding:20px 48px; display:flex; align-items:center; justify-content:space-between; }
        .footer-l { font-family:'JetBrains Mono',monospace; font-size:10px; color:rgba(232,228,219,.18); }
        .footer-r a { font-family:'JetBrains Mono',monospace; font-size:10px; color:rgba(232,228,219,.18); text-decoration:none; transition:color .2s; }
        .footer-r a:hover { color:#f59e0b; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .a1{animation:fadeUp .65s ease both}
        .a2{animation:fadeUp .65s .1s ease both}
        .a3{animation:fadeUp .65s .18s ease both}
        .a4{animation:fadeUp .65s .26s ease both}
        .a5{animation:fadeUp .65s .34s ease both}
      `}</style>

      <div className="cur-dot" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="cur-ring" style={{ left: cursorPos.x, top: cursorPos.y }} />

      <div className="root">
        <canvas ref={canvasRef} className="pts" />

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">Taskbar<em>.</em>Builder</div>
          <Link href="/builder" className="nav-pill">Open Builder →</Link>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="eyebrow a1">Windows 7 · 10 · 11</div>
          <h1 className="h1">
            <span className="a2">Build your own</span>
            <span className="h1-outline a3">Windows</span>
            <span className="h1-typed a4">{typed}<span className="blink" /></span>
          </h1>
          <p className="sub a4">
            Design accurate Windows taskbars for any scenario. Pick a version, add real icons,
            set a custom date and time — export at native pixel resolution.
          </p>
          <div className="hero-btns a5">
            <Link href="/builder" className="btn-a">
              Launch Builder
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#070709" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <a href="https://github.com/KshitijKoranne/Win-taskbar" target="_blank" rel="noopener noreferrer" className="btn-b">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.929.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.373-12-12-12z"/></svg>
              GitHub
            </a>
          </div>
        </section>

        {/* DESKTOP MOCKUP */}
        <div className="mockup-wrap">
          <div className="mono-label" style={{textAlign:"center"}}>Live preview</div>
          <div className="screen">
            <div className="desktop-bg">
              <div className="desktop-hint">Your wallpaper</div>
              <div className="desk-clock">
                <div className="desk-clock-time">10:30</div>
                <div className="desk-clock-date">Tuesday, 21 April</div>
              </div>
            </div>
            {/* Win11 taskbar with real icons */}
            <div className="tb11">
              <div className="tb11-weather">
                <span style={{fontSize:18}}>⛅</span>
                <div><div style={{fontWeight:500}}>24°C</div><div style={{fontSize:10,opacity:.45}}>Partly Cloudy</div></div>
              </div>
              {/* Center group */}
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                {/* Win11 start */}
                <div className="tb11-icon">
                  <svg viewBox="0 0 88 88" width="20" height="20">
                    <defs><linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00BCF2"/><stop offset="100%" stopColor="#0078D4"/></linearGradient></defs>
                    <rect x="0" y="0" width="40" height="40" rx="2" fill="url(#wg)"/>
                    <rect x="48" y="0" width="40" height="40" rx="2" fill="url(#wg)"/>
                    <rect x="0" y="48" width="40" height="40" rx="2" fill="url(#wg)"/>
                    <rect x="48" y="48" width="40" height="40" rx="2" fill="url(#wg)"/>
                  </svg>
                </div>
                {/* Search */}
                <div className="tb11-search">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  Search
                </div>
                {/* Real icons */}
                {[
                  { src: "/browser-icons/chrome.png", dot: true, wide: false },
                  { src: "/ms-icons/word.svg", dot: true, wide: true },
                  { src: "/browser-icons/edge.png", dot: false, wide: false },
                  { src: "/ms-icons/excel.svg", dot: false, wide: false },
                  { src: "/w7-assets/icons/imageres_3.webp", dot: false, wide: false },
                ].map((ic, i) => (
                  <div key={i} className="tb11-icon">
                    <img src={ic.src} alt="" />
                    {ic.dot && <div className={`tb11-dot${ic.wide ? " wide" : ""}`} />}
                  </div>
                ))}
              </div>
              {/* Tray */}
              <div className="tb11-tray">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity={.5}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity={.5}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                <div className="tb11-tray-clock"><div className="t">10:30</div><div className="d">24/04/26</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* USE CASES */}
        <section className="usecases">
          <div className="section-head">
            <div className="section-eyebrow">What it's for</div>
            <h2 className="section-title">More useful than it looks.</h2>
          </div>
          <div className="uc-grid">
            {[
              {
                n:"01", t:"Recreate a moment in time",
                d:"Need to show what a desktop looked like on a specific date? Set any custom time, date, and running apps. Layer the exported taskbar over a screenshot or wallpaper to reconstruct an accurate desktop timeline.",
                tag:"Forensics · Timelines · Documentation"
              },
              {
                n:"02", t:"Educational use",
                d:"Teach students what a Windows interface looks like without needing a live machine. Create clean, distraction-free taskbar visuals for presentations, textbooks, or eLearning content.",
                tag:"Training · Classrooms · eLearning"
              },
              {
                n:"03", t:"Design mockups",
                d:"Designing a Windows app, tutorial, or UI concept? Export a pixel-perfect taskbar at the exact target resolution and drop it straight into your mockup — no Photoshop gymnastics needed.",
                tag:"UI Design · Presentations"
              },
              {
                n:"04", t:"Tutorial screenshots",
                d:"Creating how-to guides or documentation? Build a clean, distraction-free taskbar strip — no personal icons, no notification clutter — exactly how you want it to look for the reader.",
                tag:"Docs · YouTube · Blogging"
              },
            ].map((u, i) => (
              <div key={i} className="uc-card">
                <div className="uc-num">{u.n}</div>
                <div className="uc-title">{u.t}</div>
                <div className="uc-desc">{u.d}</div>
                <div className="uc-tag">{u.tag}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ICON GALLERY */}
        <section className="gallery">
          <div className="section-head">
            <div className="section-eyebrow">Icon library</div>
            <h2 className="section-title">350+ icons. Real ones.</h2>
          </div>
          <p style={{fontSize:13,color:"rgba(232,228,219,.35)",marginBottom:28,fontWeight:300,lineHeight:1.7}}>
            283 native shell32 and imageres icons extracted directly from Windows 7 DLLs. Plus browsers, MS Office, and icons across dev, social, gaming, and creative tools.
          </p>
          {/* Win7 icons row */}
          <div style={{marginBottom:6}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(245,158,11,.3)",marginBottom:10}}>Windows 7 native</div>
            <div className="icon-row">
              {WIN7_ICONS.map((src, i) => (
                <div key={i} className="icon-chip"><img src={src} alt="" /></div>
              ))}
            </div>
          </div>
          {/* Browser + MS row */}
          <div style={{marginTop:20}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(245,158,11,.3)",marginBottom:10}}>Browsers · MS Office</div>
            <div className="icon-row">
              {[...BROWSER_ICONS,...MS_ICONS].map((ic, i) => (
                <div key={i} className="icon-chip"><img src={ic.src} alt={ic.name} /></div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats">
          <div className="stats-row">
            {[
              {n:"350+",l:"Native icons"},
              {n:"3",   l:"Windows versions"},
              {n:"11",  l:"Resolution presets"},
              {n:"8K",  l:"Max export"},
            ].map((s,i) => (
              <div key={i} className="stat">
                <div className="stat-n">{s.n}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* EDUCATIONAL NOTICE */}
        <section className="notice">
          <div className="notice-inner">
            <div className="notice-icon">NOTE</div>
            <div className="notice-text">
              <strong>For educational and reference use only.</strong> This tool is intended for documentation, design mockups, tutorials, and learning purposes. All Windows UI elements, icon assets, and visual styles are the intellectual property of Microsoft Corporation. This project has no affiliation with Microsoft.
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="cta-pre">Free · No account · Runs in browser</div>
          <h2 className="cta-h">Open the builder.<br /><span>It's free.</span></h2>
          <Link href="/builder" className="btn-a">
            Start Building
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#070709" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-l">© 2025 KJR Labs · Taskbar Builder</div>
          <div className="footer-r">
            <a href="https://github.com/KshitijKoranne/Win-taskbar" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
        </footer>
      </div>
    </>
  );
}
