import { useState, useEffect } from "react";
import { SFX } from "../../systems/sound";

const RapidTapGame = ({ goal, color, emoji, onComplete, disabled }) => {
  const [count, setCount] = useState(0);
  const pct = Math.min(count / goal * 100, 100);
  const done = count >= goal;

  useEffect(() => { if (done && onComplete) onComplete(); }, [done]);

  return (
    <div style={{ animation: "slideUp 0.4s ease", textAlign: "center" }}>
      <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 2, marginBottom: 4 }}>れんだ して まわせ！</div>
      <div style={{ fontSize: "0.85rem", color: "#888", marginBottom: 10 }}>{count} / {goal}</div>
      <div style={{ width: "min(260px,70vw)", height: 14, background: "rgba(0,0,0,0.08)", borderRadius: 7, margin: "0 auto 14px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${color},${color}cc)`, borderRadius: 7, transition: "width 0.15s ease" }} />
      </div>
      <button
        onClick={() => { if (!disabled && !done) { setCount((c) => c + 1); SFX.rapidTap(); } }}
        disabled={disabled || done}
        style={{
          width: 100, height: 100, borderRadius: "50%", border: "none",
          background: done ? "#66BB6A" : `linear-gradient(145deg,${color},${color}cc)`,
          color: "#fff", fontSize: "2.5rem", cursor: disabled ? "default" : "pointer",
          boxShadow: done ? "none" : `0 6px 0 ${color}88`,
          fontFamily: "'Zen Maru Gothic', sans-serif",
          animation: !done && !disabled ? "pulse 0.8s infinite" : "none",
          transition: "transform 0.08s",
        }}
        onPointerDown={(e) => { if (!done) e.currentTarget.style.transform = "scale(0.9)"; }}
        onPointerUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >{done ? "✓" : emoji}</button>
      <div style={{ fontSize: "0.8rem", color: "#bbb", marginTop: 8, fontWeight: 700 }}>🔨 タンタンタン！</div>
    </div>
  );
};

export default RapidTapGame;
