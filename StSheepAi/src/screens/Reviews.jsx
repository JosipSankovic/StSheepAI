import React from 'react'
import { Icon } from '../icons.jsx'
import { Card, ScreenHeader } from '../ui.jsx'

/* Review Intelligence — mobile-first.
   - Big search bar
   - Toggle: List view  ⇄  Map view
   - Tap a result/pin → detail sheet
*/

const PLACES = [
  {
    id: "matejuska",
    name: "Konoba Matejuška",
    type: "Konoba · Seafood",
    where: "Veli Varoš · 0.4 km",
    pos: { x: 30, y: 62 },
    price: "€€",
    trust: 87, risk: "low",
    reviews: 1842, rating: 4.6,
    tags: ["Locals welcome", "Fresh catch", "Cash preferred"],
    advice: "Go. Book ahead, bring cash. Order whatever's grilled that day.",
    summary: "A Veli Varoš seafood konoba locals still trust. Grilled fish is the move; the bill stays honest if you ask the per-kilo price first.",
    ratings: { food: 4.7, service: 4.2, atmosphere: 4.5, price: 4.4, booking: 3.3 },
    pros: ["Fresh daily catch", "Fair, transparent bills", "Real Dalmatian atmosphere", "Locals come here too"],
    cons: ["Cash strongly preferred", "40-min wait without booking", "Tight indoor seating"],
    positives: 906, warnings: 92,
    headline: { tone: "good", text: "Locals still eat here" },
  },
  {
    id: "diocletian-grill",
    name: "Diocletian Grill House",
    type: "Restaurant · Tourist",
    where: "Peristyle · 20 m",
    pos: { x: 58, y: 42 },
    price: "€€€",
    trust: 38, risk: "high",
    reviews: 2103, rating: 3.2,
    tags: ["Photo menu", "Hawkers", "Hidden service"],
    advice: "Walk past. Eat 4 minutes away instead.",
    summary: "Classic central-square tourist trap. Photo menus, pushy hosts, surprise charges — and a documented bill-argument pattern over the last 8 months.",
    ratings: { food: 2.4, service: 2.0, atmosphere: 3.4, price: 1.6, booking: 4.5 },
    pros: ["Right on the Peristyle", "Immediate seating", "English-speaking staff"],
    cons: ["Hidden 12% service charge", "Bills don't match the menu", "Aggressive street hosts", "Slow once the bill arrives", "Heavily overpriced"],
    positives: 709, warnings: 1376,
    headline: { tone: "bad", text: "Hidden 12% service charge" },
  },
  {
    id: "fife",
    name: "Konoba Fife",
    type: "Konoba · Dalmatian",
    where: "Matejuška · 0.5 km",
    pos: { x: 34, y: 64 },
    price: "€",
    trust: 79, risk: "low",
    reviews: 3104, rating: 4.4,
    tags: ["Cheap", "Hearty", "Shared tables"],
    advice: "Go hungry. Order the daily chalkboard. Brusque, fast, honest.",
    summary: "A Split institution near Matejuška. Cheap, hearty Dalmatian classics, brusque-but-fast service, and the lowest bill-to-portion ratio in town.",
    ratings: { food: 4.3, service: 3.4, atmosphere: 4.0, price: 4.9, booking: 4.6 },
    pros: ["Unbeatable value", "Large portions", "Daily chalkboard menu", "Locals at every table"],
    cons: ["No reservations — expect a wait", "Brusque service", "Shared tables"],
    positives: 1274, warnings: 276,
    headline: { tone: "good", text: "€8 pašticada — best deal in town" },
  },
  {
    id: "bokeria",
    name: "Bokeria Kitchen & Wine",
    type: "Bistro · Modern Dalmatian",
    where: "Domaldova · 0.2 km",
    pos: { x: 48, y: 48 },
    price: "€€€",
    trust: 74, risk: "low",
    reviews: 2210, rating: 4.5,
    tags: ["Trendy", "Wine list", "Reservation"],
    advice: "Book a day ahead. The tasting menu is worth it.",
    summary: "Modern Dalmatian bistro inside an old gourmet hall. Strong wine list, beautifully plated tapas-style mains — book one day ahead.",
    ratings: { food: 4.6, service: 4.3, atmosphere: 4.7, price: 3.2, booking: 2.5 },
    pros: ["Stunning interior", "Croatian-focused wine list", "Inventive plating", "Attentive service"],
    cons: ["Pricier than konobas", "Hard to book in summer", "Portions are small for the price"],
    positives: 1198, warnings: 312,
    headline: { tone: "good", text: "Excellent wine list — locally sourced" },
  },
  {
    id: "paradox",
    name: "Paradox Wine Bar",
    type: "Wine bar · Tapas",
    where: "Poljana Tina Ujevića",
    pos: { x: 54, y: 36 },
    price: "€€",
    trust: 82, risk: "low",
    reviews: 1404, rating: 4.7,
    tags: ["Croatian wine", "Cheese boards"],
    advice: "Croatian-wine flight is the way. Order tapas to share.",
    summary: "Cosy little wine bar with an all-Croatian list. Friendly sommeliers, generous tapas boards, and prices that don't make you wince.",
    ratings: { food: 4.4, service: 4.6, atmosphere: 4.7, price: 4.2, booking: 3.8 },
    pros: ["Excellent wine knowledge", "All Croatian by the glass", "Warm, cosy atmosphere", "Reasonable prices"],
    cons: ["Small space fills fast", "Mostly tapas — not a full dinner"],
    positives: 802, warnings: 122,
    headline: { tone: "good", text: "Only Croatian wine — by the glass" },
  },
];

export default function Reviews() {
  const [view, setView] = React.useState("list"); // list | map
  const [q, setQ] = React.useState("");
  const [openId, setOpenId] = React.useState(null);

  const filtered = q
    ? PLACES.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.type.toLowerCase().includes(q.toLowerCase()) ||
        p.where.toLowerCase().includes(q.toLowerCase())
      )
    : PLACES;

  return (
    <div>
      <ScreenHeader
        kicker="Review Intelligence"
        title={<>Trust before<br/>you sit down.</>}
        sub="Search any restaurant or bar in Split — we read the room for you."
      />

      {/* Search */}
      <div style={{ padding: "0 18px", position: "sticky", top: 0, zIndex: 4 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: 16,
          padding: "12px 14px",
          boxShadow: "0 8px 22px -16px rgba(13,28,44,0.3)",
        }}>
          <Icon.Search style={{ color: "var(--ink-mute)" }}/>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search place, neighbourhood, type…"
            style={{
              flex: 1, border: 0, outline: 0, background: "transparent",
              fontSize: 15, padding: "2px 0", color: "var(--ink)",
            }}
          />
          {q && (
            <button onClick={() => setQ("")} style={{
              border: 0, background: "transparent", color: "var(--ink-mute)",
              cursor: "pointer", padding: 0, fontSize: 18,
            }}>×</button>
          )}
        </div>

        {/* View toggle */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          background: "#fff", borderRadius: 14, padding: 4,
          border: "1px solid var(--line)", marginTop: 12,
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 4, bottom: 4,
            left: view === "list" ? 4 : "50%",
            right: view === "list" ? "50%" : 4,
            background: "var(--sea-deep)", borderRadius: 11,
            transition: "all .25s cubic-bezier(.2,.8,.2,1)",
          }}/>
          {[
            { id: "list", label: "List", icon: <Icon.List/> },
            { id: "map",  label: "Map",  icon: <Icon.Map/> },
          ].map(opt => (
            <button key={opt.id} onClick={() => setView(opt.id)} style={{
              position: "relative",
              border: 0, background: "transparent",
              padding: "9px 0", cursor: "pointer",
              color: view === opt.id ? "#fff" : "var(--ink-soft)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontWeight: 600, fontSize: 13, fontFamily: "inherit",
              transition: "color .2s",
            }}>{opt.icon}{opt.label}</button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="fade">
        {view === "list" ? (
          <ListView places={filtered} onOpen={setOpenId} q={q}/>
        ) : (
          <MapView places={filtered} onOpen={setOpenId}/>
        )}
      </div>

      {/* Detail sheet */}
      {openId && (
        <DetailSheet place={PLACES.find(p => p.id === openId)} onClose={() => setOpenId(null)}/>
      )}
    </div>
  );
}

/* ── List ───────────────────────────────────────────────────────────── */

function ListView({ places, onOpen, q }) {
  return (
    <div style={{ padding: "8px 18px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
      {places.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-mute)" }}>
          <div className="serif" style={{ fontSize: 26, color: "var(--ink)" }}>No matches.</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Try a different name or neighbourhood.</div>
        </div>
      )}
      {places.map((p, i) => (
        <PlaceCard key={p.id} place={p} onOpen={onOpen} delay={i * 60} q={q}/>
      ))}
    </div>
  );
}

function PlaceCard({ place, onOpen, delay = 0, q }) {
  const riskColor = place.risk === "low" ? "var(--good)" : place.risk === "high" ? "var(--bad)" : "var(--warn)";
  const riskBg    = place.risk === "low" ? "rgba(42,138,74,0.10)" : place.risk === "high" ? "rgba(176,58,46,0.10)" : "rgba(201,132,16,0.10)";

  return (
    <button
      onClick={() => onOpen(place.id)}
      className="fade-up"
      style={{
        animationDelay: `${delay}ms`,
        background: "#fff",
        border: "1px solid var(--line)",
        borderRadius: 20,
        padding: 14,
        display: "block", textAlign: "left",
        cursor: "pointer", fontFamily: "inherit", color: "inherit",
        width: "100%",
        boxShadow: "0 1px 0 rgba(13,28,44,0.02), 0 8px 18px -16px rgba(13,28,44,0.2)",
        transition: "transform .15s",
      }}
      onTouchStart={(e)=>e.currentTarget.style.transform = "scale(0.985)"}
      onTouchEnd={(e)=>e.currentTarget.style.transform = "scale(1)"}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
        {/* Trust ring */}
        <TrustDial value={place.trust} risk={place.risk}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <Highlight text={place.name} q={q}/>
            </div>
            <div style={{
              fontSize: 11, fontWeight: 700,
              padding: "3px 8px", borderRadius: 999,
              color: riskColor, background: riskBg,
              whiteSpace: "nowrap",
            }}>
              {place.risk === "low" ? "TRUSTED" : place.risk === "high" ? "AVOID" : "CAUTION"}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 3 }}>
            {place.type} · {place.where} · {place.price}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontSize: 12, color: "var(--ink-soft)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--sun)" }}>
              <Icon.Star/> <span style={{ color: "var(--ink)", fontWeight: 600 }}>{place.rating}</span>
            </span>
            <span style={{ color: "var(--ink-mute)" }}>·</span>
            <span>{place.reviews.toLocaleString()} reviews</span>
          </div>
        </div>
      </div>

      {/* Headline signal */}
      <div style={{
        marginTop: 12,
        padding: "10px 12px",
        borderRadius: 12,
        background: place.headline.tone === "good" ? "rgba(42,138,74,0.08)"
                  : place.headline.tone === "bad"  ? "rgba(176,58,46,0.08)"
                  : "rgba(201,132,16,0.08)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: 999,
          background: place.headline.tone === "good" ? "var(--good)"
                    : place.headline.tone === "bad"  ? "var(--bad)" : "var(--warn)",
        }}/>
        <span style={{ fontSize: 13, fontWeight: 600 }}>
          {place.headline.tone === "good" ? "" : "▲ "}{place.headline.text}
        </span>
      </div>
    </button>
  );
}

function Highlight({ text, q }) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark style={{ background: "var(--sun-soft)", color: "inherit", padding: "0 2px", borderRadius: 4 }}>
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  );
}

function TrustDial({ value, risk }) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    let raf, start;
    const tick = (t) => {
      start ??= t;
      const e = Math.min(1, (t - start) / 900);
      setN(Math.round(value * (1 - Math.pow(1 - e, 3))));
      if (e < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const size = 56, r = (size - 8) / 2, c = 2 * Math.PI * r;
  const dash = c * (n / 100);
  const color = risk === "low" ? "var(--good)" : risk === "high" ? "var(--bad)" : "var(--warn)";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--paper-2)" strokeWidth="5"/>
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Instrument Serif, serif",
        fontSize: 22, lineHeight: 1, color: "var(--ink)",
      }}>{n}</div>
    </div>
  );
}

/* ── Map ───────────────────────────────────────────────────────────── */

function MapView({ places, onOpen }) {
  const [hover, setHover] = React.useState(places[0]?.id);
  const active = places.find(p => p.id === hover) || places[0];

  return (
    <div style={{ padding: "0 18px 24px" }}>
      <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", border: "1px solid var(--line)" }}>
        <SplitMiniMap places={places} activeId={hover} onPick={setHover}/>

        {/* Bottom info card */}
        {active && (
          <button
            onClick={() => onOpen(active.id)}
            className="fade-up"
            key={active.id}
            style={{
              position: "absolute",
              left: 12, right: 12, bottom: 12,
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: 18,
              padding: "12px 14px",
              textAlign: "left", fontFamily: "inherit",
              boxShadow: "0 14px 30px -16px rgba(13,28,44,0.4)",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: 12,
            }}
          >
            <TrustDial value={active.trust} risk={active.risk}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{active.name}</div>
              <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>
                {active.type} · {active.where}
              </div>
            </div>
            <Icon.ArrowRight style={{ color: "var(--ink-mute)" }}/>
          </button>
        )}

        {/* Top chip */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid var(--line)",
          borderRadius: 999,
          padding: "6px 12px",
          fontSize: 11,
          fontFamily: "JetBrains Mono, monospace",
          letterSpacing: 1,
          color: "var(--ink-soft)",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <Icon.Map style={{ width: 12, height: 12 }}/> SPLIT · OLD TOWN
        </div>

        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(13,59,102,0.92)",
          color: "#fff",
          borderRadius: 999, padding: "6px 10px",
          fontSize: 11, fontFamily: "JetBrains Mono, monospace",
          letterSpacing: 1,
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "#7ad17a",
            boxShadow: "0 0 0 4px rgba(122,209,122,0.25)" }}/>
          LIVE
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: "var(--ink-mute)", textAlign: "center" }}>
        Tap a pin to inspect · {places.length} venues
      </div>
    </div>
  );
}

function SplitMiniMap({ places, activeId, onPick }) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf, s;
    const tick = n => { s ??= n; setT(((n - s) / 1800) % 1); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const pulseR = 14 + t * 16;
  const pulseO = 0.5 * (1 - t);

  const W = 400, H = 460;
  const toX = p => p / 100 * W;
  const toY = p => p / 100 * H;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", background: "#efe3c8" }}>
      <defs>
        <pattern id="dotgrid2" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="rgba(140,130,110,0.4)"/>
        </pattern>
        <linearGradient id="seaG2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9ec9d6"/>
          <stop offset="1" stopColor="#6ea6b6"/>
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="#efe3c8"/>
      <rect width={W} height={H} fill="url(#dotgrid2)" opacity="0.5"/>

      {/* Marjan */}
      <path d="M0 40 L160 30 L130 120 L60 170 L0 150 Z" fill="#c5d3a4"/>
      <text x="60" y="100" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="2" fill="#5e6b32">MARJAN</text>

      {/* Sea */}
      <path d={`M0 ${H*0.7} Q${W*0.3} ${H*0.66} ${W*0.6} ${H*0.7} T${W} ${H*0.72} L${W} ${H} L0 ${H} Z`} fill="url(#seaG2)"/>
      <g stroke="#5b94a5" strokeWidth="0.8" fill="none" opacity="0.5">
        {[H*0.76, H*0.82, H*0.88].map((y,i)=>(
          <path key={i} d={`M0 ${y} q 30 -6 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0`}/>
        ))}
      </g>

      {/* Streets */}
      <g stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M80 220 L380 230"/>
        <path d="M210 60 L210 260"/>
        <path d="M80 280 L380 290"/>
      </g>
      <g stroke="#e3d6b2" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M120 130 L220 230"/>
        <path d="M260 130 L260 280"/>
        <path d="M310 200 L380 200"/>
      </g>

      {/* Riva ribbon */}
      <path d="M90 305 L370 308" stroke="#d96a3c" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
      <text x="220" y="328" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="2" fill="#a06037" textAnchor="middle">RIVA</text>

      {/* Palace block */}
      <g>
        <rect x="190" y="190" width="100" height="80" rx="4" fill="#e6dcc6" stroke="#a99a72" strokeWidth="1.5"/>
        <rect x="200" y="200" width="22" height="22" fill="#cfb87a" opacity="0.8"/>
        <rect x="230" y="200" width="28" height="22" fill="#cfb87a" opacity="0.8"/>
        <rect x="200" y="230" width="38" height="32" fill="#cfb87a" opacity="0.8"/>
        <rect x="245" y="230" width="38" height="32" fill="#cfb87a" opacity="0.8"/>
        <rect x="246" y="205" width="10" height="20" fill="#d96a3c"/>
      </g>

      {/* Pins */}
      {places.map(p => {
        const isActive = p.id === activeId;
        const color = p.risk === "low" ? "#2a8a4a" : p.risk === "high" ? "#b03a2e" : "#c98410";
        return (
          <g key={p.id} style={{ cursor: "pointer" }} onClick={() => onPick(p.id)}>
            {isActive && (
              <circle cx={toX(p.pos.x)} cy={toY(p.pos.y)} r={pulseR} fill={color} opacity={pulseO}/>
            )}
            <g transform={`translate(${toX(p.pos.x)-13} ${toY(p.pos.y)-32})`}>
              <ellipse cx="13" cy="32" rx="7" ry="2" fill="rgba(0,0,0,0.2)"/>
              <path d="M13 0 C5 0 0 6 0 14 c0 10 13 20 13 20 s13-10 13-20 c0-8-5-14-13-14z"
                    fill={isActive ? color : "#fff"} stroke={color} strokeWidth="2.2"/>
              <circle cx="13" cy="14" r="4" fill={isActive ? "#fff" : color}/>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Detail sheet ───────────────────────────────────────────────────── */

function DetailSheet({ place, onClose }) {
  const riskColor = place.risk === "low" ? "var(--good)" : place.risk === "high" ? "var(--bad)" : "var(--warn)";

  // Compute weighted overall (food + atmosphere weighted higher)
  const r = place.ratings;
  const overall = (r.food * 0.3 + r.service * 0.2 + r.atmosphere * 0.2 + r.price * 0.2 + r.booking * 0.1);

  const RATING_ROWS = [
    { key: "food",       label: "Food",         emoji: "🍴" },
    { key: "service",    label: "Service",      emoji: "🤵" },
    { key: "atmosphere", label: "Atmosphere",   emoji: "✨" },
    { key: "price",      label: "Price",        emoji: "💶" },
    { key: "booking",    label: "Hard to book", emoji: "📅", inverted: true },
  ];

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(13,28,44,0.5)",
      zIndex: 30,
      animation: "fadeIn .2s ease both",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--paper)",
          width: "100%", maxWidth: 412,
          maxHeight: "90%",
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          overflowY: "auto",
          animation: "sheetUp .3s cubic-bezier(.2,.8,.2,1) both",
          paddingBottom: 32,
        }}
      >
        <div style={{
          padding: "10px 0", display: "flex", justifyContent: "center",
          position: "sticky", top: 0, background: "var(--paper)", zIndex: 2,
        }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--line)" }}/>
        </div>

        <div style={{ padding: "0 22px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="tag">{place.type}</div>
              <div className="serif" style={{ fontSize: 30, lineHeight: 1.05, marginTop: 4 }}>{place.name}</div>
              <div style={{ fontSize: 13, color: "var(--ink-mute)", marginTop: 4 }}>{place.where} · {place.price}</div>
            </div>
            <button onClick={onClose} style={{
              border: 0, background: "#fff", width: 36, height: 36, borderRadius: 999,
              color: "var(--ink)", cursor: "pointer", fontSize: 20, lineHeight: 1,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}>×</button>
          </div>

          {/* Overall rating */}
          <div style={{
            marginTop: 16,
            padding: "16px 16px",
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: 18,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <TrustDial value={place.trust} risk={place.risk}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="tag">Overall</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
                <span className="serif" style={{ fontSize: 32, lineHeight: 1, color: "var(--ink)" }}>
                  {overall.toFixed(1)}
                </span>
                <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>/ 5</span>
                <Stars n={overall}/>
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 4 }}>
                {place.reviews.toLocaleString()} reviews · {place.risk === "low" ? "Trusted by locals" : place.risk === "high" ? "Avoid" : "Caution"}
              </div>
            </div>
          </div>

          {/* Quick summary */}
          <div style={{ marginTop: 18 }}>
            <div className="tag">Quick summary</div>
            <div className="serif" style={{
              fontSize: 18, lineHeight: 1.35, marginTop: 6,
              color: "var(--ink)", textWrap: "pretty",
            }}>
              {place.summary}
            </div>
          </div>

          {/* Tourist advice */}
          <Card padding={14} tone={place.risk === "high" ? "sun" : "pale"} style={{ marginTop: 16 }}>
            <div className="tag" style={{ color: riskColor }}>● Tourist advice</div>
            <div className="serif" style={{ fontSize: 18, lineHeight: 1.25, marginTop: 4 }}>
              {place.advice}
            </div>
          </Card>

          {/* Category ratings */}
          <div style={{ marginTop: 22 }}>
            <div className="tag">Ratings</div>
            <div style={{
              marginTop: 10,
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: 16,
              overflow: "hidden",
            }}>
              {RATING_ROWS.map((row, i) => (
                <RatingRow
                  key={row.key}
                  emoji={row.emoji}
                  label={row.label}
                  value={place.ratings[row.key]}
                  inverted={row.inverted}
                  last={i === RATING_ROWS.length - 1}
                  delay={i * 60}
                />
              ))}
            </div>
          </div>

          {/* Pros & cons */}
          <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
            <ProConList kind="pros" items={place.pros}/>
            <ProConList kind="cons" items={place.cons}/>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 18 }}>
            {place.tags.map((tg, i) => (
              <span key={i} className="mono" style={{
                fontSize: 11, padding: "5px 10px",
                border: "1px solid var(--line)", borderRadius: 999,
                color: "var(--ink-soft)", background: "#fff",
              }}>{tg}</span>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        `}</style>
      </div>
    </div>
  );
}

/* ── Detail sheet helpers ───────────────────────────────────────────── */

function Stars({ n }) {
  return (
    <span style={{ display: "inline-flex", gap: 1, marginLeft: 4 }}>
      {[0, 1, 2, 3, 4].map(i => {
        const fill = Math.max(0, Math.min(1, n - i));
        return (
          <span key={i} style={{ position: "relative", width: 12, height: 12, display: "inline-block" }}>
            <span style={{ position: "absolute", inset: 0, color: "var(--line)" }}>
              <Icon.Star/>
            </span>
            <span style={{ position: "absolute", inset: 0, color: "var(--sun)", width: `${fill * 100}%`, overflow: "hidden" }}>
              <Icon.Star/>
            </span>
          </span>
        );
      })}
    </span>
  );
}

function RatingRow({ emoji, label, value, inverted, last, delay = 0 }) {
  /* For inverted metrics (e.g. "Hard to book") a high rating = a problem,
     so we show the "difficulty" — and color it accordingly. */
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    let raf, s;
    const tick = (t) => {
      s ??= t;
      const e = Math.min(1, (t - s) / 700);
      setV(value * (1 - Math.pow(1 - e, 3)));
      if (e < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const score = inverted ? (5 - value) : value;
  const color = score >= 4   ? "var(--good)"
              : score >= 3   ? "#79b246"
              : score >= 2   ? "var(--warn)"
              :                "var(--bad)";

  return (
    <div className="fade-up" style={{
      animationDelay: `${delay}ms`,
      padding: "12px 14px",
      borderBottom: last ? 0 : "1px solid var(--line)",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{label}</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)" }}>
            {value.toFixed(1)}{inverted ? " / 5" : ""}
          </span>
        </div>
        <div style={{
          height: 6, background: "var(--paper-2)", borderRadius: 999, overflow: "hidden",
        }}>
          <div style={{
            width: `${(v / 5) * 100}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
            transition: "width .5s cubic-bezier(.2,.7,.2,1)",
          }}/>
        </div>
      </div>
    </div>
  );
}

function ProConList({ kind, items }) {
  const isPros = kind === "pros";
  const color = isPros ? "var(--good)" : "var(--bad)";
  const bg    = isPros ? "rgba(42,138,74,0.06)" : "rgba(176,58,46,0.06)";
  return (
    <div style={{
      border: "1px solid var(--line)",
      background: bg,
      borderRadius: 16,
      padding: 14,
    }}>
      <div className="tag" style={{ color, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
          width: 16, height: 16, borderRadius: 999,
          background: color, color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, lineHeight: 1,
        }}>{isPros ? "+" : "−"}</span>
        {isPros ? "Pros" : "Cons"}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
        {items.map((s, i) => (
          <div key={i} className="fade-up" style={{
            animationDelay: `${i * 50}ms`,
            display: "flex", alignItems: "flex-start", gap: 8,
            fontSize: 14, color: "var(--ink)", lineHeight: 1.35,
          }}>
            <span style={{
              flexShrink: 0,
              width: 14, height: 14, marginTop: 3,
              borderRadius: 999,
              background: "#fff", border: `1.5px solid ${color}`,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color, fontSize: 10, fontWeight: 700, lineHeight: 1,
            }}>{isPros ? "✓" : "×"}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
