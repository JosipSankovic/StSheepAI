import React from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from '../icons.jsx'
import { Card, ScreenHeader } from '../ui.jsx'

/* Review Intelligence — mobile-first.
   - Big search bar
   - Toggle: List view  ⇄  Map view
   - Tap a result/pin → detail sheet
*/

// Seed data for places backed by the /restaurants API.
// All fields here serve as fallback if the backend is unreachable.
// Fields overridden by the API: name, type, price, trust, risk, summary, advice,
// pros, cons, rating, ratings.food/service/atmosphere.
const BACKEND_PLACES_FALLBACK = [
  {
    id: "c95165f4-5ca5-4c9f-9e3d-d0f3c50fea6c",
    name: "Pizzeria Sette Sorelle",
    type: "Italian · Neapolitan pizza",
    where: "Split · Riva",
    pos: { x: 52, y: 72 },
    coords: [43.5125, 16.43344],
    price: "€€",
    trust: 90, risk: "low",
    reviews: 1200, rating: 4.7,
    tags: ["Neapolitan pizza", "Book ahead", "Rooftop terrace"],
    advice: "Publicly gathered review data indicates a very reliable pizza-focused restaurant with unusually consistent praise. Main tourist cautions are practical rather than serious: book ahead, expect crowds, and do not expect a broad Italian menu.",
    summary: "Pizzeria Sette Sorelle appears to be one of Split's most consistently praised casual restaurants, especially for Neapolitan-style pizza. The main risks are queues, limited menu choice, and occasional rushed service at peak times rather than food quality or billing concerns.",
    ratings: { food: 4.8, service: 4.4, atmosphere: 4.5, price: 4.0, booking: 2.5 },
    pros: ["Extremely strong review profile across multiple sources", "Highly praised Neapolitan-style dough and crust", "Fresh premium ingredients", "Central location near Split Riva", "Rooftop/upstairs terrace frequently praised", "Good value for central Split"],
    cons: ["Long queues during peak season", "Small pizza-focused menu with limited non-pizza options", "Some reports of rushed seating when busy", "Desserts appear limited or unavailable"],
    positives: 980, warnings: 88,
    headline: { tone: "good", text: "Unusually consistent praise across all platforms" },
    why: ["Extremely consistent praise across public review platforms", "Many guests mention premium ingredients and good central value", "Warnings are mostly about queues, not billing or food quality"],
  },
  {
    id: "347982b2-e3f6-468e-b113-7e31ccefb4da",
    name: "Restoran Aspalathos",
    type: "Mediterranean · Croatian · Seafood",
    where: "Split · Old Town",
    pos: { x: 38, y: 50 },
    coords: [43.5105, 16.43544],
    price: "€€–€€€",
    trust: 74, risk: "medium",
    reviews: 820, rating: 3.4,
    tags: ["Black risotto", "Tourist area", "Outdoor seating"],
    advice: "Public review data suggests a convenient and sometimes very enjoyable central Split restaurant, but the gap between high Google-derived ratings and much weaker Tripadvisor feedback makes it a medium-risk choice, especially for breakfast or price-sensitive visitors.",
    summary: "Mixed but usable tourist-area restaurant: strong Google volume and many positive casual-dining experiences, but repeated Tripadvisor complaints about food execution, service inconsistency, and add-on pricing create meaningful caution.",
    ratings: { food: 3.3, service: 3.3, atmosphere: 3.8, price: 2.8, booking: 3.5 },
    pros: ["Central Split location near the historic core", "Large Google review volume with generally positive rating", "Frequently praised black risotto, grilled squid, sea bass, pizza and pasta", "Outdoor seating and casual tourist-friendly atmosphere"],
    cons: ["Highly polarized reviews across platforms — Google much stronger than Tripadvisor", "Repeated complaints about bland, cold, or poorly executed dishes", "Some complaints about bread charges, bottled water, and tipping pressure", "Service ranges from very friendly to rude or inattentive"],
    positives: 460, warnings: 310,
    headline: { tone: "warn", text: "Polarized reviews — Google vs Tripadvisor gap" },
    why: ["Google volume is strong, but Tripadvisor feedback is much weaker", "Repeated complaints mention bread charges, bottled water, and tipping pressure", "Safer for casual dishes than breakfast or whole fish"],
  },
];

function backendToPlace(api, seed) {
  const trust = Math.round(api.confidence * 100);
  const risk = trust >= 80 ? "low" : trust <= 50 ? "high" : "medium";
  const type = api.cuisine_type
    .split(/[,/]/)
    .slice(0, 3)
    .map(s => s.trim())
    .filter(Boolean)
    .join(" · ");
  return {
    ...seed,
    name: api.name,
    type,
    price: api.price_level,
    trust,
    risk,
    summary: api.summary,
    advice: api.reviewer_note,
    pros: api.pros,
    cons: api.cons,
    rating: +(api.overall_rating / 2).toFixed(1),
    ratings: {
      ...seed.ratings,
      food: +(api.food_rating / 2).toFixed(1),
      service: +(api.service_rating / 2).toFixed(1),
      atmosphere: +(api.ambiance_rating / 2).toFixed(1),
    },
  };
}

const PLACES = [
  {
    id: "matejuska",
    name: "Konoba Matejuška",
    type: "Konoba · Seafood",
    where: "Veli Varoš · 0.4 km",
    pos: { x: 30, y: 62 },
    coords: [43.5095, 16.4344],
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
    why: ["Many locals mention fresh seafood and honest bills", "Strong value for a central seafood konoba", "Main warning is operational: book ahead and ask per-kilo fish price"],
  },
  {
    id: "diocletian-grill",
    name: "Diocletian Grill House",
    type: "Restaurant · Tourist",
    where: "Peristyle · 20 m",
    pos: { x: 58, y: 42 },
    coords: [43.5081, 16.4402],
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
    why: ["Repeated complaints about hidden service charges", "Photo menus, hawkers, and bill disputes are tourist-trap patterns", "Food and service scores are both weak despite the location"],
  },
  {
    id: "fife",
    name: "Konoba Fife",
    type: "Konoba · Dalmatian",
    where: "Matejuška · 0.5 km",
    pos: { x: 34, y: 64 },
    coords: [43.5099, 16.4335],
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
    why: ["Reviewers repeatedly mention large portions and low prices", "Local institution with a long-running value reputation", "Warnings are mostly about brusque service and shared tables"],
  },
  {
    id: "bokeria",
    name: "Bokeria Kitchen & Wine",
    type: "Bistro · Modern Dalmatian",
    where: "Domaldova · 0.2 km",
    pos: { x: 48, y: 48 },
    coords: [43.5092, 16.4388],
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
    why: ["Strong wine and atmosphere signals across reviews", "Food quality is praised, but portions are often called small", "Good choice if you reserve and expect higher central prices"],
  },
  {
    id: "paradox",
    name: "Paradox Wine Bar",
    type: "Wine bar · Tapas",
    where: "Poljana Tina Ujevića",
    pos: { x: 54, y: 36 },
    coords: [43.5102, 16.4372],
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
    why: ["Guests repeatedly praise Croatian wine guidance", "Low warning volume compared with positive signals", "Best for drinks and tapas rather than a full dinner"],
  },
];

const DEMO_USER_LOCATION = [43.5096, 16.4378];

export default function Reviews() {
  const [view, setView] = React.useState("list"); // list | map
  const [q, setQ] = React.useState("");
  const [openId, setOpenId] = React.useState(null);
  const [scanState, setScanState] = React.useState("idle");
  const [scanMessage, setScanMessage] = React.useState("");
  const [userLocation, setUserLocation] = React.useState(null);
  const [liveBackend, setLiveBackend] = React.useState(BACKEND_PLACES_FALLBACK);

  React.useEffect(() => {
    const seedMap = Object.fromEntries(BACKEND_PLACES_FALLBACK.map(s => [s.name, s]));
    fetch("http://localhost:8000/restaurants")
      .then(r => r.ok ? r.json() : null)
      .then(items => {
        if (!items) return;
        const merged = items
          .map(api => {
            const seed = seedMap[api.name];
            return seed ? backendToPlace(api, seed) : null;
          })
          .filter(Boolean);
        if (merged.length) setLiveBackend(merged);
      })
      .catch(() => {});
  }, []);

  const placesWithDistance = React.useMemo(() => {
    const origin = userLocation || DEMO_USER_LOCATION;
    return [...liveBackend, ...PLACES].map(place => ({
      ...place,
      distanceMeters: place.coords ? distanceMeters(origin, place.coords) : null,
      scannedNearby: Boolean(userLocation),
    })).sort((a, b) => {
      if (!userLocation) return 0;
      return (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity);
    });
  }, [userLocation, liveBackend]);

  const filtered = q
    ? placesWithDistance.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.type.toLowerCase().includes(q.toLowerCase()) ||
        p.where.toLowerCase().includes(q.toLowerCase())
      )
    : placesWithDistance;

  function scanNearby() {
    setQ("");
    setView("map");
    setScanState("scanning");
    setScanMessage("Scanning restaurants around you...");

    const finishWith = (coords, message) => {
      setTimeout(() => {
        setUserLocation(coords);
        setScanState("done");
        setScanMessage(message);
      }, 800);
    };

    if (!("geolocation" in navigator)) {
      finishWith(DEMO_USER_LOCATION, "Demo scan near Split Old Town. Location is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        finishWith(
          [position.coords.latitude, position.coords.longitude],
          "Nearby scan complete. Restaurants are sorted by distance and trust score.",
        );
      },
      () => {
        finishWith(DEMO_USER_LOCATION, "Demo scan near Split Old Town. Allow location for a real nearby scan.");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 },
    );
  }

  return (
    <div>
      <ScreenHeader
        kicker="Review Intelligence"
        title={<>Trust before<br/>you sit down.</>}
        sub="Search any restaurant or bar in Split — we read the room for you."
      />

      {/* Search */}
      <div style={{ padding: "0 18px", position: "sticky", top: 0, zIndex: 4 }}>
        <button
          type="button"
          onClick={scanNearby}
          style={{
            width: "100%",
            border: 0,
            borderRadius: 18,
            padding: "13px 14px",
            marginBottom: 10,
            background: scanState === "scanning" ? "var(--sea-deep)" : "linear-gradient(135deg, var(--sea-deep), var(--sea))",
            color: "#fff",
            fontFamily: "inherit",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            cursor: "pointer",
            boxShadow: "0 14px 28px -18px rgba(13,59,102,0.65)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Icon.Map style={{ width: 16, height: 16 }}/>
            {scanState === "scanning" ? "Scanning nearby..." : "Scan restaurants around me"}
          </span>
          <span className="mono" style={{ fontSize: 10, opacity: 0.78 }}>
            AI TRUST MAP
          </span>
        </button>

        {scanMessage && (
          <div className="fade-up" style={{
            marginBottom: 10,
            padding: "9px 12px",
            borderRadius: 14,
            background: scanState === "done" ? "rgba(42,138,74,0.1)" : "rgba(29,111,184,0.1)",
            border: `1px solid ${scanState === "done" ? "rgba(42,138,74,0.18)" : "rgba(29,111,184,0.18)"}`,
            color: scanState === "done" ? "var(--good)" : "var(--sea-deep)",
            fontSize: 12,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: scanState === "done" ? "var(--good)" : "var(--sea)",
              animation: scanState === "scanning" ? "pulseDot 1.2s ease-in-out infinite" : "none",
            }}/>
            {scanMessage}
          </div>
        )}

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
          <MapView places={filtered} onOpen={setOpenId} userLocation={userLocation}/>
        )}
      </div>

      {/* Detail sheet */}
      {openId && (
        <DetailSheet place={placesWithDistance.find(p => p.id === openId)} onClose={() => setOpenId(null)}/>
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
            {place.distanceMeters != null && place.scannedNearby && (
              <>
                <span style={{ color: "var(--ink-mute)" }}>·</span>
                <span>{formatDistance(place.distanceMeters)}</span>
              </>
            )}
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

function distanceMeters(a, b) {
  const toRad = (value) => value * Math.PI / 180;
  const R = 6371000;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

function formatDistance(meters) {
  if (meters < 1000) return `${meters} m away`;
  return `${(meters / 1000).toFixed(1)} km away`;
}

/* ── Map ───────────────────────────────────────────────────────────── */

function MapView({ places, onOpen, userLocation }) {
  const [hover, setHover] = React.useState(places[0]?.id);
  const activeId = places.some(p => p.id === hover) ? hover : places[0]?.id;
  const active = places.find(p => p.id === activeId) || places[0];

  return (
    <div style={{ padding: "0 18px 24px" }}>
      <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", border: "1px solid var(--line)" }}>
        <SplitLeafletMap
          places={places}
          activeId={activeId}
          onPick={setHover}
          onOpen={onOpen}
          userLocation={userLocation}
        />

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
              {active.distanceMeters != null && active.scannedNearby && (
                <div className="mono" style={{ fontSize: 10, color: "var(--sea)", marginTop: 4 }}>
                  {formatDistance(active.distanceMeters)} · scanned nearby
                </div>
              )}
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
        Tap a pin to inspect · {places.length} venues{userLocation ? " · sorted nearby" : ""}
      </div>
    </div>
  );
}

function SplitLeafletMap({ places, activeId, onPick, onOpen, userLocation }) {
  const mapEl = React.useRef(null)
  const mapRef = React.useRef(null)
  const markersRef = React.useRef({})
  const userMarkerRef = React.useRef(null)

  React.useEffect(() => {
    if (!mapEl.current || mapRef.current) return

    const map = L.map(mapEl.current, {
      center: [43.5089, 16.4380],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      tap: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.control.attribution({ prefix: false, position: 'bottomleft' }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = {}
    }
  }, [])

  React.useEffect(() => {
    const map = mapRef.current
    if (!map) return

    Object.values(markersRef.current).forEach(marker => marker.remove())
    markersRef.current = {}
    if (userMarkerRef.current) {
      userMarkerRef.current.remove()
      userMarkerRef.current = null
    }

    const bounds = []

    if (userLocation) {
      userMarkerRef.current = L.circleMarker(userLocation, {
        radius: 8,
        color: "#fff",
        weight: 2,
        fillColor: "#1d6fb8",
        fillOpacity: 1,
      }).addTo(map).bindTooltip("You are here", {
        direction: "top",
        offset: [0, -8],
        opacity: 0.94,
      })
      bounds.push(userLocation)
    }

    places.forEach(place => {
      if (!place.coords) return

      const isActive = place.id === activeId
      const marker = L.marker(place.coords, {
        icon: createTrustIcon(place, isActive),
        riseOnHover: true,
      })
        .addTo(map)
        .on('click', () => {
          onPick(place.id)
        })
        .on('dblclick', () => {
          onOpen(place.id)
        })
        .bindTooltip(`${place.name} · ${place.trust}/100`, {
          direction: 'top',
          offset: [0, -18],
          opacity: 0.94,
        })

      markersRef.current[place.id] = marker
      bounds.push(place.coords)
    })

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [42, 42], maxZoom: 17 })
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 17)
    }

    requestAnimationFrame(() => map.invalidateSize())
  }, [places, activeId, onPick, onOpen, userLocation])

  React.useEffect(() => {
    const marker = markersRef.current[activeId]
    if (!marker || !mapRef.current) return

    marker.setIcon(createTrustIcon(places.find(p => p.id === activeId), true))
    mapRef.current.panTo(marker.getLatLng(), { animate: true, duration: 0.45 })
  }, [activeId, places])

  return <div ref={mapEl} className="split-leaflet-map" aria-label="Interactive Split restaurant map" />
}

function createTrustIcon(place, isActive) {
  const risk = place?.risk ?? 'low'
  const color = risk === 'low' ? '#2a8a4a' : risk === 'high' ? '#b03a2e' : '#c98410'
  const size = isActive ? 42 : 34
  const score = place?.trust ?? ''

  return L.divIcon({
    className: 'trust-map-marker-shell',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `
      <button class="trust-map-marker ${isActive ? 'is-active' : ''}" style="--pin:${color}; width:${size}px; height:${size}px" type="button">
        <span>${score}</span>
      </button>
    `,
  })
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

          <div style={{
            marginTop: 16,
            padding: "15px 16px",
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: 18,
            boxShadow: "0 8px 22px -18px rgba(13,28,44,0.25)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div className="tag">Why this score?</div>
                <div style={{ fontSize: 13, color: "var(--ink-mute)", marginTop: 3 }}>
                  AI pattern scan across praise, warnings, and tourist-risk signals.
                </div>
              </div>
              <div className="mono" style={{
                padding: "5px 8px",
                borderRadius: 999,
                background: place.risk === "high" ? "rgba(176,58,46,0.10)" : place.risk === "medium" ? "rgba(201,132,16,0.12)" : "rgba(42,138,74,0.10)",
                color: riskColor,
                fontSize: 10,
                fontWeight: 800,
              }}>
                {place.trust}/100
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 13 }}>
              {(place.why || buildWhySignals(place)).map((item, i) => (
                <div
                  key={item}
                  className="fade-up"
                  style={{
                    animationDelay: `${i * 90}ms`,
                    display: "flex",
                    gap: 9,
                    alignItems: "flex-start",
                    fontSize: 13,
                    color: "var(--ink)",
                    lineHeight: 1.35,
                  }}
                >
                  <span style={{
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    background: i === 0 ? riskColor : "var(--paper)",
                    border: i === 0 ? 0 : "1px solid var(--line)",
                    color: i === 0 ? "#fff" : riskColor,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 11,
                    fontWeight: 900,
                    marginTop: 1,
                  }}>
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

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

function buildWhySignals(place) {
  return [
    place.headline.text,
    place.pros[0],
    place.cons[0],
  ].filter(Boolean);
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
