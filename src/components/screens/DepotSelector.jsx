import { useState, useRef } from "react";
import { TRAINS } from "../../data/trains";
import DepotTrainSVG from "../svg/DepotTrainSVG";

const DepotSelector = ({ onSelect, onOpenSettings, onStamps }) => {
  const [si, setSi] = useState(null);
  const [ro, setRo] = useState(false);
  const lp = useRef(null);

  const hs = (t, i) => {
    setSi(i);
    setRo(true);
    setTimeout(() => { onSelect(t); }, 900);
  };

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg,#4A4A5A 0%,#3A3A48 30%,#2E2E3A 100%)", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Zen Maru Gothic', sans-serif", padding: "20px 16px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, background: "linear-gradient(180deg,#555568,transparent)", zIndex: 1 }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", top: 0, left: `${20 + i * 30}%`, width: 8, height: 40, background: "#666678", zIndex: 2 }} />)}
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", top: 36, left: `${12 + i * 25}%`, width: 24, height: 6, borderRadius: "0 0 12px 12px", background: "#FFE89F", boxShadow: "0 4px 20px rgba(255,232,159,0.4)", zIndex: 3 }} />)}
      <div style={{ marginTop: 44, fontSize: "1.4rem", fontWeight: 900, color: "#FFE066", letterSpacing: 4, textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.5)", zIndex: 5 }}>🏗️ しゃりょうきち</div>
      <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", marginBottom: 10, textAlign: "center", fontWeight: 700, letterSpacing: 2, zIndex: 5 }}>きょうの でんしゃを えらぼう！</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 400, zIndex: 5, overflow: "auto", flex: 1, paddingBottom: 60 }}>
        {TRAINS.map((train, idx) => {
          const isSel = si === idx, isOther = si !== null && !isSel;
          return (
            <div key={train.id} style={{ position: "relative", overflow: "hidden", borderRadius: 14, transition: "all 0.3s ease", opacity: isOther ? 0.3 : 1 }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", top: 4, left: 8, fontSize: "0.55rem", color: "rgba(255,255,255,0.2)", fontWeight: 700, letterSpacing: 1 }}>{`BAY ${idx + 1}`}</div>
              <button onClick={() => { if (!ro) hs(train, idx); }} disabled={ro} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 6px",
                border: "none", borderRadius: 14, background: "transparent",
                cursor: ro ? "default" : "pointer", width: "100%", textAlign: "left",
              }}>
                <div style={{
                  width: 120, height: 44, flexShrink: 0, borderRadius: 8, overflow: "hidden",
                  transform: isSel && ro ? "translateX(120%)" : "translateX(0)",
                  transition: isSel && ro ? "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)" : "none",
                }}><DepotTrainSVG train={train} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "1rem", fontWeight: 900, color: "#fff", letterSpacing: 2 }}>{train.name}</div>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{train.series}{train.coupleWith ? " 🔗" : ""}</div>
                </div>
                {!ro && <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)" }}>▶</div>}
              </button>
            </div>
          );
        })}
      </div>
      <button onPointerDown={() => { lp.current = setTimeout(onOpenSettings, 600); }} onPointerUp={() => { clearTimeout(lp.current); }} onPointerLeave={() => { clearTimeout(lp.current); }} style={{ position: "fixed", bottom: 20, right: 20, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "1.3rem", color: "rgba(255,255,255,0.35)", zIndex: 10 }}>⚙️</button>
      {onStamps && <button onClick={onStamps} style={{ position: "fixed", bottom: 20, left: 20, height: 40, borderRadius: 20, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", zIndex: 10, padding: "0 16px", fontFamily: "'Zen Maru Gothic', sans-serif" }}>📅 スタンプ</button>}
      <div style={{ position: "fixed", bottom: 68, right: 14, fontSize: "0.55rem", color: "rgba(255,255,255,0.18)", zIndex: 10, textAlign: "center" }}>ながおしで<br />せってい</div>
    </div>
  );
};

export default DepotSelector;
