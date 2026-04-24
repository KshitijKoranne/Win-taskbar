import Link from "next/link";

export default function LandingPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#ededed",
      fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif",
      overflowX: "hidden",
    }}>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 56,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
      }}>
        <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em" }}>
          Taskbar Builder
        </span>
        <Link href="/builder" style={{
          background: "#f59e0b", color: "#0a0a0a",
          padding: "8px 20px", borderRadius: 6,
          fontWeight: 600, fontSize: 13, textDecoration: "none",
          letterSpacing: "-0.01em",
        }}>
          Open Builder
        </Link>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: 900, margin: "0 auto",
        padding: "100px 48px 64px",
        textAlign: "center",
      }}>
        {/* Version badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: 20, padding: "4px 14px",
          fontSize: 12, color: "#f59e0b", marginBottom: 32,
          letterSpacing: "0.02em",
        }}>
          Win7 · Win10 · Win11
        </div>

        <h1 style={{
          fontSize: "clamp(40px, 7vw, 72px)",
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
          margin: "0 0 24px",
        }}>
          Build pixel-perfect<br />
          <span style={{ color: "#f59e0b" }}>Windows taskbars.</span>
        </h1>

        <p style={{
          fontSize: 18, color: "rgba(237,237,237,0.55)",
          maxWidth: 520, margin: "0 auto 48px",
          lineHeight: 1.6, letterSpacing: "-0.01em",
        }}>
          Pick a Windows version, drop in icons, set the clock — export a clean PNG
          at native screen resolution. No Photoshop. No VM.
        </p>

        <Link href="/builder" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "#f59e0b", color: "#0a0a0a",
          padding: "14px 32px", borderRadius: 8,
          fontWeight: 700, fontSize: 15, textDecoration: "none",
          letterSpacing: "-0.02em",
          boxShadow: "0 0 40px rgba(245,158,11,0.25)",
        }}>
          Launch Builder
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </section>

      {/* Taskbar preview strip — Win11 mockup */}
      <section style={{ padding: "0 0 80px", overflow: "hidden" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 24px",
        }}>
          {/* Screen frame */}
          <div style={{
            background: "#161616",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            overflow: "hidden",
          }}>
            {/* Fake desktop */}
            <div style={{
              height: 260,
              background: "linear-gradient(135deg, #1a2a4a 0%, #0d1a30 50%, #0a0f1e 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <div style={{
                fontSize: 13, color: "rgba(255,255,255,0.15)",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                Your wallpaper here
              </div>
              {/* Clock on desktop */}
              <div style={{
                position: "absolute", top: 20, right: 24,
                textAlign: "right",
              }}>
                <div style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em" }}>10:30</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Monday, April 21</div>
              </div>
            </div>

            {/* Win11 Taskbar */}
            <div style={{
              height: 48, background: "rgba(32,32,32,0.95)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", gap: 4,
            }}>
              {/* Weather left */}
              <div style={{
                position: "absolute", left: 0,
                display: "flex", alignItems: "center", gap: 6,
                padding: "0 16px", height: "100%",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                fontSize: 12,
              }}>
                <span style={{ fontSize: 16 }}>⛅</span>
                <div>
                  <div style={{ fontWeight: 500 }}>24°C</div>
                  <div style={{ fontSize: 10, opacity: 0.5 }}>Partly Cloudy</div>
                </div>
              </div>

              {/* Center: Start + Search + Icons */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {/* Start */}
                <div style={{
                  width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 6,
                }}>
                  <svg viewBox="0 0 88 88" width="20" height="20">
                    <defs>
                      <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00BCF2"/>
                        <stop offset="100%" stopColor="#0078D4"/>
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="40" height="40" rx="2" fill="url(#lg)"/>
                    <rect x="48" y="0" width="40" height="40" rx="2" fill="url(#lg)"/>
                    <rect x="0" y="48" width="40" height="40" rx="2" fill="url(#lg)"/>
                    <rect x="48" y="48" width="40" height="40" rx="2" fill="url(#lg)"/>
                  </svg>
                </div>

                {/* Search */}
                <div style={{
                  height: 32, padding: "0 12px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 12, color: "rgba(255,255,255,0.5)",
                  minWidth: 160,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  Search
                </div>

                {/* Icons */}
                {[
                  { color: "#4fc3f7", label: "E" },
                  { color: "#ffb74d", label: "F" },
                  { color: "#ef5350", label: "C" },
                  { color: "#66bb6a", label: "N" },
                ].map((ic, i) => (
                  <div key={i} style={{
                    width: 40, height: 40,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 6, position: "relative",
                  }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 4,
                      background: ic.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "#fff",
                    }}>{ic.label}</div>
                    {i < 2 && (
                      <div style={{
                        position: "absolute", bottom: 3,
                        width: i === 1 ? 14 : 4, height: 3,
                        borderRadius: 2, background: "#60cdff",
                        left: "50%", transform: "translateX(-50%)",
                      }}/>
                    )}
                  </div>
                ))}
              </div>

              {/* Tray right */}
              <div style={{
                position: "absolute", right: 0,
                display: "flex", alignItems: "center", gap: 8,
                padding: "0 16px", height: "100%", fontSize: 12,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity={0.6}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity={0.6}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                <div style={{ textAlign: "right", lineHeight: 1.3 }}>
                  <div style={{ fontWeight: 500 }}>10:30</div>
                  <div style={{ opacity: 0.5, fontSize: 10 }}>24/04/26</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 100px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 1,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {[
            {
              icon: "◈",
              title: "Three Windows versions",
              desc: "Win7 with real Luna Blue assets and Aero glass. Win10 flat dark. Win11 with centered icons and the gradient logo."
            },
            {
              icon: "⊞",
              title: "350+ native icons",
              desc: "283 real shell32 + imageres icons from Windows 7. Plus browsers, MS Office, and categories for dev, social, gaming and more."
            },
            {
              icon: "◎",
              title: "Drag, click, configure",
              desc: "Drag icons to reorder. Click to toggle running and active states. Set the clock, tray indicators, and Win11 weather widget."
            },
            {
              icon: "↗",
              title: "Export at native resolution",
              desc: "11 presets from 720p to 8K. Exports PNG or JPG at exact OS-accurate dimensions — no upscaling, no blur."
            },
          ].map((f, i) => (
            <div key={i} style={{
              background: "#111",
              padding: "32px 28px",
            }}>
              <div style={{
                fontSize: 22, marginBottom: 14,
                color: "#f59e0b",
              }}>{f.icon}</div>
              <div style={{
                fontSize: 15, fontWeight: 600,
                letterSpacing: "-0.02em", marginBottom: 8,
              }}>{f.title}</div>
              <div style={{
                fontSize: 13, color: "rgba(237,237,237,0.45)",
                lineHeight: 1.6,
              }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section style={{
        textAlign: "center",
        padding: "0 48px 120px",
        maxWidth: 600, margin: "0 auto",
      }}>
        <div style={{
          fontSize: 13, color: "rgba(237,237,237,0.3)",
          letterSpacing: "0.05em", textTransform: "uppercase",
          marginBottom: 20,
        }}>Free · No signup · Runs in your browser</div>
        <Link href="/builder" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "#f59e0b", color: "#0a0a0a",
          padding: "14px 32px", borderRadius: 8,
          fontWeight: 700, fontSize: 15, textDecoration: "none",
          letterSpacing: "-0.02em",
        }}>
          Start Building
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontSize: 12, color: "rgba(237,237,237,0.25)",
      }}>
        <span>Taskbar Builder · KJR Labs</span>
        <a href="https://github.com/KshitijKoranne/Win-taskbar"
          style={{ color: "rgba(237,237,237,0.25)", textDecoration: "none" }}
          target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </footer>
    </main>
  );
}
