/* Shared UI primitives */

export function Placeholder({ label, ratio = "4/3", style, tone = "sea" }) {
  const palettes = {
    sea:   ["#0d3b66", "#1d6fb8", "#4aa3df"],
    sun:   ["#e8a514", "#f5b81e", "#ffd365"],
    sand:  ["#d9cdb1", "#c8b78f", "#a89668"],
    terra: ["#d96a3c", "#bf5530", "#a04324"],
    stone: ["#6b7a8a", "#52606e", "#3a4654"],
  };
  const cols = palettes[tone] || palettes.sea;
  const gradient = `repeating-linear-gradient(135deg, ${cols[0]} 0 22px, ${cols[1]} 22px 44px, ${cols[2]} 44px 66px)`;
  return (
    <div style={{
      aspectRatio: ratio,
      background: gradient,
      borderRadius: 14,
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "flex-end",
      ...style,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.35) 100%)",
      }}/>
      {label && (
        <div style={{
          position: "relative",
          padding: "10px 12px",
          color: "#fff",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: 0.96,
        }}>{label}</div>
      )}
    </div>
  );
}

export function ScreenHeader({ kicker, title, sub, accent = "var(--sea)" }) {
  return (
    <div style={{ padding: "8px 22px 20px" }}>
      {kicker && <div className="tag" style={{ color: accent }}>● &nbsp;{kicker}</div>}
      <div className="serif" style={{
        fontSize: 36, lineHeight: 1.0, marginTop: 8, letterSpacing: 0,
        color: "var(--ink)",
      }}>{title}</div>
      {sub && <div style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 6, maxWidth: 320 }}>{sub}</div>}
    </div>
  );
}

export function Card({ children, style, padding = 18, tone = "white" }) {
  const tones = {
    white: { background: "#fff", border: "1px solid var(--line)" },
    sand:  { background: "var(--paper-2)", border: "1px solid var(--line)" },
    sea:   { background: "var(--sea-deep)", color: "#fff", border: "1px solid var(--sea-deep)" },
    pale:  { background: "var(--sea-pale)", border: "1px solid #c4dff0" },
    sun:   { background: "var(--sun-soft)", border: "1px solid #e8c46a" },
  }[tone];
  return (
    <div style={{
      borderRadius: 22,
      padding,
      boxShadow: "0 1px 0 rgba(13,28,44,0.03), 0 10px 28px -22px rgba(13,28,44,0.25)",
      ...tones,
      ...style,
    }}>{children}</div>
  );
}
