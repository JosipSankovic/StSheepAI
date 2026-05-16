import React from 'react'
import Hls from 'hls.js'
import { Icon } from '../icons.jsx'
import { ScreenHeader } from '../ui.jsx'

/* Beach Monitor — pick a beach, see if it's crowded.
   Animated 'crowd' dots that walk around showing density. */

const BEACHES = [
  {
    id: "bacvice",
    name: "Bačvice",
    type: "Sandy · shallow · family",
    distance: "0.8 km from Riva",
    walk: "10 min walk",
    tone: "sun",
    crowd: 88,           // 0-100 occupancy
    cap: 1200,           // est capacity
    here: 1056,
    water: 22,
    weather: "Sunny · 28°C",
    wait: "20+ min for chairs",
    note: "Famous for picigin — the locals' running splash-ball game.",
    parking: "Full",
    stream: "https://cdn-004.whatsupcams.com/hls/hr_splitbacvice01.m3u8",
  },
  {
    id: "kasjuni",
    name: "Kašjuni",
    type: "Pebble · clear water · scenic",
    distance: "3.2 km · Marjan",
    walk: "8 min taxi",
    tone: "sea",
    crowd: 42,
    cap: 600, here: 252,
    water: 21,
    weather: "Sunny · 27°C",
    wait: "Plenty of space",
    note: "South of Marjan — the prettiest cove inside the city.",
    parking: "Some spots",
  },
  {
    id: "bene",
    name: "Bene",
    type: "Pebble · pine shade · quiet",
    distance: "4.1 km · Marjan tip",
    walk: "30 min walk · scenic",
    tone: "stone",
    crowd: 18,
    cap: 400, here: 72,
    water: 21,
    weather: "Sunny · 26°C",
    wait: "Empty",
    note: "Hidden on Marjan's back side — locals know, tourists don't.",
    parking: "Easy",
  },
  {
    id: "znjan",
    name: "Žnjan",
    type: "Concrete plateau · large · clubs",
    distance: "2.6 km east",
    walk: "8 min bus",
    tone: "terra",
    crowd: 10,
    cap: 2000, here: 0,
    water: 23,
    weather: "Cloudy · light wind",
    wait: "Plenty of space",
    note: "Big, loud, lots of facilities. Pick the east end for calm.",
    parking: "Tight",
    stream: "https://cdn-006.whatsupcams.com/hls/hr_buildznjan01.m3u8",
    vlm: {
      timestamp: "2026-05-16T12:49:00Z",
      scene_type: "beach",
      weather: { condition: "cloudy", visibility: "good", wind_estimate: "light", precipitation_visible: false },
      people: { estimated_count: 0, estimated_range: { min: 0, max: 5 }, crowd_level: "low", crowd_score: 1 },
      notes: ["The beach area is mostly empty.", "Cloudy weather with no visible precipitation."],
    },
  },
];

export default function Beach() {
  const [openId, setOpenId] = React.useState("bacvice");
  const open = BEACHES.find(b => b.id === openId);

  return (
    <div>
      <ScreenHeader
        kicker="Beach Monitor"
        title={<>Where can I<br/>actually swim?</>}
        sub="Live crowd readings from Split's four main beaches. Updated every 10 minutes."
      />

      {/* Live banner */}
      <div style={{ padding: "0 18px 14px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px",
          background: "rgba(29,111,184,0.08)",
          border: "1px solid rgba(29,111,184,0.18)",
          borderRadius: 14,
          fontSize: 13,
          color: "var(--sea-deep)",
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: 999, background: "#2a8a4a",
            boxShadow: "0 0 0 4px rgba(42,138,74,0.2)",
            animation: "pulseDot 1.8s ease-in-out infinite",
          }}/>
          <div style={{ flex: 1, fontWeight: 600 }}>Live · last sync 2 min ago</div>
          <Icon.Refresh style={{ color: "var(--ink-mute)" }}/>
        </div>
        <style>{`@keyframes pulseDot { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }`}</style>
      </div>

      {/* Beach pills */}
      <div style={{
        padding: "0 18px 12px",
        display: "flex", gap: 8, overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {BEACHES.map(b => {
          const active = b.id === openId;
          const status = crowdInfo(b.crowd);
          return (
            <button key={b.id} onClick={() => setOpenId(b.id)} style={{
              border: active ? "1px solid var(--ink)" : "1px solid var(--line)",
              background: active ? "var(--ink)" : "#fff",
              color: active ? "#fff" : "var(--ink)",
              borderRadius: 999,
              padding: "9px 12px",
              cursor: "pointer", fontFamily: "inherit",
              fontSize: 13, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 8,
              whiteSpace: "nowrap",
              transition: "all .15s",
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: 999,
                background: status.color,
                boxShadow: active ? "0 0 0 3px rgba(255,255,255,0.2)" : "none",
              }}/>
              {b.name}
            </button>
          );
        })}
      </div>

      {/* Main beach card */}
      <div style={{ padding: "0 18px" }} key={open.id}>
        <BeachCard beach={open}/>
      </div>

      {/* Other beaches mini */}
      <div style={{ padding: "20px 18px 8px" }}>
        <div className="tag">Other beaches</div>
      </div>
      <div style={{ padding: "0 18px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {BEACHES.filter(b => b.id !== open.id).map((b, i) => (
          <MiniBeach key={b.id} b={b} onClick={() => setOpenId(b.id)} delay={i * 60}/>
        ))}
      </div>
    </div>
  );
}

/* ── crowd descriptor ───────────────────────────────────────────────── */

function crowdInfo(c) {
  if (c < 30) return { label: "Empty",     short: "Empty",      color: "#2a8a4a", text: "var(--good)", bg: "rgba(42,138,74,0.12)" };
  if (c < 55) return { label: "Comfortable", short: "Comfortable", color: "#79b246", text: "#3f6b22", bg: "rgba(121,178,70,0.15)" };
  if (c < 80) return { label: "Busy",      short: "Busy",       color: "var(--warn)", text: "var(--warn)", bg: "rgba(201,132,16,0.14)" };
  return        { label: "Packed",   short: "Packed",     color: "var(--bad)",  text: "var(--bad)", bg: "rgba(176,58,46,0.14)" };
}

/* ── Big beach card ─────────────────────────────────────────────────── */

function BeachCard({ beach }) {
  const status = crowdInfo(beach.crowd);

  // animated number
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    let raf, s;
    const tick = t => {
      s ??= t;
      const e = Math.min(1, (t - s) / 900);
      setPct(beach.crowd * (1 - Math.pow(1 - e, 3)));
      if (e < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [beach.id, beach.crowd]);

  return (
    <div className="fade-up" style={{
      background: "#fff",
      border: "1px solid var(--line)",
      borderRadius: 24,
      overflow: "hidden",
      boxShadow: "0 12px 30px -22px rgba(13,28,44,0.3)",
    }}>
      {beach.stream ? (
        <StreamPlayer src={beach.stream} height={180}/>
      ) : (
        <BeachScene crowd={beach.crowd} tone={beach.tone}/>
      )}

      <div style={{ padding: "18px 18px 4px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div className="serif" style={{ fontSize: 30, lineHeight: 1.0, letterSpacing: 0 }}>
              {beach.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 4 }}>
              {beach.type}
            </div>
          </div>
          <div style={{
            padding: "6px 12px",
            borderRadius: 999,
            background: status.bg,
            color: status.text,
            fontWeight: 700, fontSize: 12,
            whiteSpace: "nowrap",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: status.color }}/>
            {status.label.toUpperCase()}
          </div>
        </div>

        {/* Big crowd statement */}
        <div style={{
          marginTop: 16,
          padding: "16px 14px",
          background: status.bg,
          borderRadius: 16,
        }}>
          <div className="tag" style={{ color: status.text }}>Right now</div>
          <div className="serif" style={{ fontSize: 26, lineHeight: 1.2, marginTop: 4, color: "var(--ink)", textWrap: "balance" }}>
            {crowdHeadline(beach.crowd)}
          </div>

          {/* progress */}
          <div style={{ marginTop: 14 }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 11, color: "var(--ink-soft)", marginBottom: 6,
              fontFamily: "JetBrains Mono, monospace", letterSpacing: 1,
            }}>
              <span>{Math.round(pct)}% FULL</span>
              <span>{beach.here.toLocaleString()} / {beach.cap.toLocaleString()}</span>
            </div>
            <div style={{ height: 8, background: "rgba(0,0,0,0.06)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{
                width: `${pct}%`,
                height: "100%",
                background: status.color,
                borderRadius: 999,
                transition: "width .6s cubic-bezier(.2,.7,.2,1)",
              }}/>
            </div>
          </div>
        </div>

        {/* meta grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 0,
          marginTop: 14,
          background: "var(--paper)",
          border: "1px solid var(--line)",
          borderRadius: 14,
          overflow: "hidden",
        }}>
          <MetaCell k="Water" v={`${beach.water}°C`} ic="🌊"/>
          <MetaCell k="Weather" v={beach.weather} ic="☀"/>
          <MetaCell k="Distance" v={beach.distance} ic="📍" last/>
          <MetaCell k="Wait" v={beach.wait} ic="⏱" last/>
        </div>

        {/* tip */}
        <div style={{
          marginTop: 14,
          padding: "12px 14px",
          background: "var(--paper)",
          borderRadius: 14,
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <Icon.Info style={{ color: "var(--sea)", marginTop: 2, flexShrink: 0 }}/>
          <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.4 }}>
            {beach.note}
          </div>
        </div>

        {/* VLM analysis */}
        {beach.vlm && <VlmBlock vlm={beach.vlm}/>}
      </div>
    </div>
  );
}

function VlmBlock({ vlm }) {
  const weatherIcon = {
    sunny: "☀️", partly_cloudy: "⛅", cloudy: "☁️", rainy: "🌧️", foggy: "🌫️",
  }[vlm.weather.condition] || "🌤️";

  const ts = new Date(vlm.timestamp);
  const timeStr = ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{
      marginTop: 14, marginBottom: 18,
      border: "1px solid var(--line)",
      borderRadius: 16,
      overflow: "hidden",
      background: "#fff",
    }}>
      {/* header */}
      <div style={{
        padding: "10px 14px",
        borderBottom: "1px solid var(--line)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div className="tag">AI camera analysis</div>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink-mute)" }}>{timeStr}</div>
      </div>

      {/* chips row */}
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap",
        padding: "12px 14px",
        borderBottom: "1px solid var(--line)",
      }}>
        <Chip label="Scene" value={vlm.scene_type} icon="📍"/>
        <Chip label="Weather" value={`${weatherIcon} ${vlm.weather.condition}`} icon={null}/>
        <Chip label="Wind" value={vlm.weather.wind_estimate} icon="💨"/>
        <Chip
          label="People"
          value={vlm.people.estimated_count === 0
            ? `~0–${vlm.people.estimated_range.max}`
            : `~${vlm.people.estimated_count}`}
          icon="👥"
        />
      </div>

      {/* notes */}
      <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        {vlm.notes.map((n, i) => (
          <div key={i} style={{
            fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.4,
            display: "flex", gap: 8, alignItems: "flex-start",
          }}>
            <span style={{ color: "var(--ink-mute)", flexShrink: 0 }}>—</span>
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

function Chip({ label, value, icon }) {
  return (
    <div style={{
      display: "inline-flex", flexDirection: "column", gap: 2,
      padding: "6px 10px",
      background: "var(--paper)",
      border: "1px solid var(--line)",
      borderRadius: 10,
    }}>
      <div className="tag" style={{ fontSize: 9 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", textTransform: "capitalize" }}>
        {icon && <span style={{ marginRight: 4 }}>{icon}</span>}{value}
      </div>
    </div>
  );
}

function MetaCell({ k, v, ic, last }) {
  return (
    <div style={{
      padding: "10px 14px",
      borderBottom: last ? 0 : "1px solid var(--line)",
      borderRight: "1px solid var(--line)",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ fontSize: 16 }}>{ic}</span>
      <div>
        <div className="tag">{k}</div>
        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{v}</div>
      </div>
    </div>
  );
}

function crowdHeadline(c) {
  if (c < 30) return "Practically empty — you'll have your pick of spots.";
  if (c < 55) return "Comfortable. Easy to find a good spot.";
  if (c < 80) return "Busy — go now or wait until after 6 pm.";
  return "Packed. Try a different beach today.";
}

/* ── Mini beach card ────────────────────────────────────────────────── */

function MiniBeach({ b, onClick, delay = 0 }) {
  const status = crowdInfo(b.crowd);
  return (
    <button onClick={onClick} className="fade-up" style={{
      animationDelay: `${delay}ms`,
      padding: 0, border: "1px solid var(--line)", borderRadius: 16,
      background: "#fff", overflow: "hidden",
      cursor: "pointer", fontFamily: "inherit", textAlign: "left",
      transition: "transform .15s",
    }}
    onTouchStart={(e)=>e.currentTarget.style.transform = "scale(0.98)"}
    onTouchEnd={(e)=>e.currentTarget.style.transform = "scale(1)"}
    >
      <div style={{ position: "relative", height: 80, overflow: "hidden" }}>
        <BeachScene crowd={b.crowd} tone={b.tone} mini/>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{b.name}</div>
          <span style={{
            width: 8, height: 8, borderRadius: 999, background: status.color, flexShrink: 0,
          }}/>
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 2 }}>
          {status.label} · {b.water}°C
        </div>
      </div>
    </button>
  );
}

/* ── Animated beach scene ───────────────────────────────────────────── */

function BeachScene({ crowd, tone, mini }) {
  // wave animation
  const [phase, setPhase] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const tick = (n) => { setPhase(n / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // crowd density mapped to dot count
  const count = Math.round(mini ? crowd / 14 : crowd / 4);
  // generate stable random positions (only re-randomize on crowd change)
  const dots = React.useMemo(() => {
    const rng = mulberry(crowd * 991 + (mini ? 1 : 0));
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: rng() * 100,
        y: 50 + rng() * 36, // beach band (sand area)
        d: rng() * Math.PI * 2,
        s: 0.3 + rng() * 0.5,
      });
    }
    return arr;
  }, [count, crowd, mini]);

  const status = crowdInfo(crowd);

  const sandTone = {
    sun:  "#f0d896",
    sea:  "#e8d5a8",
    stone:"#d9cdb1",
    terra:"#e6c4a0",
  }[tone] || "#e8d5a8";

  const H = mini ? 80 : 180;

  return (
    <div style={{
      position: "relative",
      height: H,
      background: `linear-gradient(180deg, #b8def0 0%, #6fb8e3 40%, #2d8db8 75%, ${sandTone} 75.1%, ${sandTone} 100%)`,
      overflow: "hidden",
    }}>
      {/* Sun (top right) */}
      {!mini && (
        <div style={{
          position: "absolute",
          top: 18, right: 22,
          width: 38, height: 38, borderRadius: 999,
          background: "var(--sun)",
          boxShadow: "0 0 30px rgba(245,184,30,0.6)",
        }}/>
      )}

      {/* Waves SVG */}
      <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <linearGradient id="waveG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.7"/>
            <stop offset="1" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0, 1, 2].map(i => {
          const off = i * 12;
          const a = 4 + i * 2;
          const yBase = 130 + i * 6;
          const path = makeWavePath(phase + i * 0.7, a, yBase, off);
          return <path key={i} d={path} fill="none" stroke="url(#waveG)" strokeWidth={1.8 - i * 0.3} opacity={0.7 - i * 0.15}/>;
        })}
        {/* shore foam */}
        <path d={makeWavePath(phase * 1.3, 3, 150, 0) + " L 400 200 L 0 200 Z"} fill="rgba(255,255,255,0.4)"/>
      </svg>

      {/* Beach dots — people */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {dots.map((p, i) => {
          // small bobbing motion
          const dx = Math.sin(phase * 2 + p.d) * (mini ? 0.6 : 1.4);
          const dy = Math.cos(phase * 1.6 + p.d * 0.7) * (mini ? 0.4 : 1);
          const sz = mini ? 3 : 5 * p.s + 3;
          return (
            <div key={i} style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: sz, height: sz,
              borderRadius: 999,
              background: i % 5 === 0 ? "var(--terracotta)" : i % 3 === 0 ? "var(--sea-deep)" : "#3d4c5c",
              transform: `translate(${dx}px, ${dy}px)`,
              boxShadow: mini ? "none" : "0 2px 4px rgba(0,0,0,0.15)",
            }}/>
          );
        })}
      </div>

      {/* Umbrellas (less when crowded actually they're MORE) */}
      {!mini && Array.from({ length: Math.min(6, Math.floor(crowd / 18)) }).map((_, i) => {
        const x = 12 + (i * 14) + ((i * 31) % 7);
        const y = 55 + (i * 4) % 18;
        const cols = ["#d96a3c", "#f5b81e", "#1d6fb8", "#d96a3c", "#1d6fb8", "#f5b81e"];
        return (
          <div key={i} style={{
            position: "absolute", left: `${x}%`, top: `${y}%`,
            width: 0, height: 0,
            transform: "translate(-50%, -100%)",
          }}>
            <div style={{
              width: 22, height: 11,
              background: cols[i % cols.length],
              borderRadius: "22px 22px 0 0",
              position: "absolute",
              top: -11, left: -11,
            }}/>
            <div style={{
              width: 1, height: 16,
              background: "rgba(0,0,0,0.35)",
              position: "absolute", left: -0.5, top: -1,
            }}/>
          </div>
        );
      })}

      {/* status overlay */}
      <div style={{
        position: "absolute",
        right: mini ? 6 : 14, bottom: mini ? 6 : 12,
        padding: mini ? "3px 7px" : "5px 10px",
        background: "rgba(13,28,44,0.7)",
        backdropFilter: "blur(6px)",
        color: "#fff",
        borderRadius: 999,
        fontSize: mini ? 9 : 11,
        fontFamily: "JetBrains Mono, monospace",
        letterSpacing: 1,
        display: "inline-flex", alignItems: "center", gap: 5,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: 999, background: status.color }}/>
        {status.label.toUpperCase()}
      </div>
    </div>
  );
}

/* ── Live stream player ─────────────────────────────────────────────── */

function StreamPlayer({ src, height = 180 }) {
  const videoRef = React.useRef(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setError(false);

    if (Hls.isSupported()) {
      const hls = new Hls({ lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) setError(true);
      });
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.onerror = () => setError(true);
    } else {
      setError(true);
    }
  }, [src]);

  if (error) {
    return (
      <div style={{
        height, background: "#1a2a3a",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 6,
      }}>
        <Icon.Refresh style={{ color: "rgba(255,255,255,0.3)", width: 24, height: 24 }}/>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono, monospace", letterSpacing: 1 }}>
          STREAM UNAVAILABLE
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height, background: "#000", overflow: "hidden" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div style={{
        position: "absolute", top: 10, right: 10,
        background: "rgba(13,28,44,0.75)",
        backdropFilter: "blur(6px)",
        color: "#fff",
        borderRadius: 999,
        padding: "5px 10px",
        fontSize: 10,
        fontFamily: "JetBrains Mono, monospace",
        letterSpacing: 1,
        display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: 999, background: "#2a8a4a",
          boxShadow: "0 0 0 3px rgba(42,138,74,0.3)",
          animation: "pulseDot 1.8s ease-in-out infinite",
        }}/>
        LIVE
      </div>
    </div>
  );
}

function makeWavePath(phase, amp, yBase, off) {
  let d = `M 0 ${yBase + Math.sin(phase) * amp}`;
  for (let x = 20; x <= 400; x += 20) {
    const y = yBase + Math.sin(phase + (x + off) / 30) * amp;
    d += ` L ${x} ${y}`;
  }
  return d;
}

/* tiny seeded rng */
function mulberry(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
