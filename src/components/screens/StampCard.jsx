import { useState, useEffect } from "react";
import { loadStamps } from "../../systems/stamps";
import { TRAINS } from "../../data/trains";

const F = "'Zen Maru Gothic', sans-serif";

const StampCard = ({ onBack }) => {
  const [stamps, setStamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStamps((data) => { setStamps(data); setLoading(false); });
  }, []);

  // Last 14 days
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const dayStamps = stamps.filter((s) => s.date === ds);
    const dayLabel = `${d.getMonth() + 1}/${d.getDate()}`;
    const dayOfWeek = ["にち", "げつ", "か", "すい", "もく", "きん", "ど"][d.getDay()];
    days.push({ date: ds, label: dayLabel, dow: dayOfWeek, dowIdx: d.getDay(), stamps: dayStamps, isToday: i === 0 });
  }

  const collected = {};
  stamps.forEach((s) => { collected[s.trainId] = true; });
  const totalCollected = Object.keys(collected).length;

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg,#FFF8E1 0%,#FFECB3 50%,#FFE082 100%)", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: F, padding: "20px 16px", overflow: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, width: "100%", maxWidth: 400 }}>
        <button onClick={onBack} style={{ background: "rgba(0,0,0,0.06)", border: "none", borderRadius: 12, padding: "6px 12px", cursor: "pointer", fontSize: "0.85rem", fontFamily: F, fontWeight: 700, color: "#999" }}>← もどる</button>
        <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 2 }}>📅 スタンプカード</div>
      </div>

      {/* Completion bar */}
      <div style={{ width: "100%", maxWidth: 400, background: "rgba(255,255,255,0.6)", borderRadius: 16, padding: "12px 16px", marginBottom: 12 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#7B3F00", marginBottom: 6 }}>🏆 しゃしゅ コンプリート {totalCollected} / {TRAINS.length}</div>
        <div style={{ height: 10, background: "rgba(0,0,0,0.06)", borderRadius: 5, overflow: "hidden" }}>
          <div style={{ width: `${totalCollected / TRAINS.length * 100}%`, height: "100%", background: "linear-gradient(90deg,#FFE066,#FF9F43)", borderRadius: 5, transition: "width 0.5s ease" }} />
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
          {TRAINS.map((t) => {
            const got = collected[t.id];
            return (
              <div key={t.id} style={{
                width: 36, height: 20, borderRadius: 6,
                background: got ? `linear-gradient(135deg,${t.body},${t.bodyLo})` : "rgba(0,0,0,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.45rem", fontWeight: 700,
                color: got ? "#fff" : "#ccc",
                border: got ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(0,0,0,0.04)",
              }}>{got ? "✓" : "?"}</div>
            );
          })}
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{ width: "100%", maxWidth: 400, background: "rgba(255,255,255,0.6)", borderRadius: 16, padding: "12px 8px" }}>
        <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#7B3F00", textAlign: "center", marginBottom: 8, letterSpacing: 2 }}>さいきん 14にちかん</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
          {["にち", "げつ", "か", "すい", "もく", "きん", "ど"].map((dw) => (
            <div key={dw} style={{ fontSize: "0.5rem", color: "#999", fontWeight: 700, textAlign: "center" }}>{dw}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {/* Pad empty cells to align first day to correct weekday column */}
          {(() => {
            const pad = [];
            const firstDow = days[0] ? days[0].dowIdx : 0;
            for (let p = 0; p < firstDow; p++) { pad.push(<div key={`pad${p}`} />); }
            return pad;
          })()}
          {days.map((day) => {
            const hasStamp = day.stamps.length > 0;
            const lastStamp = hasStamp ? day.stamps[day.stamps.length - 1] : null;
            const trainForDay = lastStamp ? TRAINS.find((t) => t.id === lastStamp.trainId) : null;
            return (
              <div key={day.date} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                padding: "4px 2px", borderRadius: 10,
                background: day.isToday ? "rgba(255,159,67,0.15)" : "transparent",
                border: day.isToday ? "2px solid #FF9F43" : "2px solid transparent",
              }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 800, color: day.isToday ? "#FF9F43" : "#666" }}>{day.label}</div>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: hasStamp ? "linear-gradient(135deg,#FFE066,#FF9F43)" : "rgba(0,0,0,0.04)",
                  fontSize: hasStamp ? "1rem" : "0.7rem",
                  boxShadow: hasStamp ? "0 2px 6px rgba(255,159,67,0.3)" : "none",
                  position: "relative",
                }}>
                  {hasStamp ? (trainForDay ? (trainForDay.kind === "steam" ? "🚂" : "🚄") : "⭐") : ""}
                  {day.stamps.length > 1 && <div style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: "#E74C3C", color: "#fff", fontSize: "0.4rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{day.stamps.length}</div>}
                </div>
                {hasStamp && trainForDay && <div style={{ fontSize: "0.4rem", color: "#999", fontWeight: 700, textAlign: "center", lineHeight: 1.1, maxWidth: 42, overflow: "hidden" }}>{trainForDay.name}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {loading && <div style={{ marginTop: 20, fontSize: "1rem", color: "#999" }}>よみこみちゅう...</div>}
    </div>
  );
};

export default StampCard;
