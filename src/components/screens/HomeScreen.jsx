import { useState, useEffect, useRef } from "react";
import { TRAINS } from "../../data/trains";
import { loadCollection } from "../../systems/stamps";
import DepotTrainSVG from "../svg/DepotTrainSVG";

const F = "'Zen Maru Gothic', sans-serif";

const HomeScreen = ({ onStart, onOpenSettings, onCollection }) => {
  const [col, setCol] = useState([]);
  const [pressing, setPressing] = useState(false);
  const lp = useRef(null);

  useEffect(() => {
    loadCollection((data) => { setCol(data); });
  }, []);

  const collected = {};
  col.forEach((c) => { collected[c.trainId] = true; });
  const total = Object.keys(collected).length;

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg,#1A1A2E 0%,#16213E 40%,#0F3460 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F, padding: "20px 16px", position: "relative", overflow: "hidden" }}>
      {/* Stars background */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", width: 3, height: 3, borderRadius: "50%",
          background: "#fff", opacity: 0.3 + Math.random() * 0.5,
          left: `${5 + (i * 47) % 90}%`, top: `${3 + (i * 31) % 60}%`,
          animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite ${i * 0.3}s`,
        }} />
      ))}

      {/* Title */}
      <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#FFE066", letterSpacing: 4, textAlign: "center", textShadow: "0 2px 12px rgba(255,224,102,0.4)", marginBottom: 4, zIndex: 5 }}>
        おうちで
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 900, color: "#FFE066", letterSpacing: 6, textAlign: "center", textShadow: "0 2px 12px rgba(255,224,102,0.4)", marginBottom: 24, zIndex: 5 }}>
        しゅっぱつしんこう！
      </div>

      {/* Mystery train silhouette */}
      <div style={{ width: 200, height: 80, marginBottom: 24, opacity: 0.3, zIndex: 5 }}>
        <svg viewBox="0 0 200 62" style={{ width: "100%", height: "100%" }}>
          <rect x={15} y={8} width={120} height={44} rx={7} fill="#556" />
          <path d="M135,8 C150,8 165,16 172,30 C165,44 150,52 135,52" fill="#445" />
          <text x={85} y={38} textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff" opacity="0.5">？</text>
          <circle cx={32} cy={56} r={4} fill="#445" />
          <circle cx={50} cy={56} r={4} fill="#445" />
          <circle cx={104} cy={56} r={4} fill="#445" />
          <circle cx={122} cy={56} r={4} fill="#445" />
        </svg>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        onPointerDown={() => setPressing(true)}
        onPointerUp={() => setPressing(false)}
        onPointerLeave={() => setPressing(false)}
        style={{
          padding: "20px 48px", borderRadius: 28, border: "none",
          background: "linear-gradient(145deg,#FF6B6B,#E5253C)",
          color: "#fff", fontSize: "1.5rem", fontWeight: 900, letterSpacing: 4,
          cursor: "pointer", fontFamily: F,
          boxShadow: pressing ? "0 2px 0 #aa1525" : "0 6px 0 #aa1525, 0 8px 20px rgba(229,37,60,0.4)",
          transform: pressing ? "translateY(4px)" : "translateY(0)",
          transition: "all 0.1s ease",
          animation: "pulse 2s ease-in-out infinite",
          zIndex: 5,
        }}
      >
        あそぶ
      </button>

      <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: 10, zIndex: 5, letterSpacing: 2 }}>
        ナゾの でんしゃを つくろう！
      </div>

      {/* Collection preview */}
      <button onClick={onCollection} style={{
        marginTop: 32, padding: "12px 20px", borderRadius: 16,
        background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
        cursor: "pointer", fontFamily: F, zIndex: 5,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: 2 }}>
          コレクション
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {TRAINS.map((tr) => (
            <div key={tr.id} style={{
              width: 28, height: 16, borderRadius: 4,
              background: collected[tr.id] ? `linear-gradient(135deg,${tr.body},${tr.bodyLo})` : "rgba(255,255,255,0.08)",
              border: collected[tr.id] ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
            }} />
          ))}
        </div>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.35)" }}>
          {total} / {TRAINS.length} しゃしゅ
        </div>
      </button>

      {/* Settings (long press) */}
      <button
        onPointerDown={() => { lp.current = setTimeout(onOpenSettings, 600); }}
        onPointerUp={() => { clearTimeout(lp.current); }}
        onPointerLeave={() => { clearTimeout(lp.current); }}
        style={{ position: "fixed", bottom: 20, right: 20, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "1.3rem", color: "rgba(255,255,255,0.35)", zIndex: 10 }}
      >
        ⚙️
      </button>
      <div style={{ position: "fixed", bottom: 68, right: 14, fontSize: "0.55rem", color: "rgba(255,255,255,0.18)", zIndex: 10, textAlign: "center" }}>ながおしで<br />せってい</div>
    </div>
  );
};

export default HomeScreen;
