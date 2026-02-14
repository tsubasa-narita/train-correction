import { useState, useEffect, useRef } from "react";
import { SFX } from "../../systems/sound";

const HoldGame = ({ holdMs, color, emoji, onComplete, disabled }) => {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const holdRef = useRef(null);
  const startRef = useRef(0);
  const lastTickRef = useRef(0);

  useEffect(() => { if (done && onComplete) onComplete(); }, [done]);
  useEffect(() => () => { if (holdRef.current) cancelAnimationFrame(holdRef.current); }, []);

  const onDown = () => {
    if (disabled || done) return;
    setHolding(true);
    startRef.current = performance.now();
    lastTickRef.current = 0;
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / holdMs, 1);
      setProgress(p);
      const curTick = Math.floor(p * 5);
      if (curTick > lastTickRef.current) { lastTickRef.current = curTick; SFX.holdTick(p); }
      if (p < 1) holdRef.current = requestAnimationFrame(tick);
      else { setDone(true); setHolding(false); SFX.holdDone(); }
    };
    holdRef.current = requestAnimationFrame(tick);
  };

  const onUp = () => {
    if (!done) { setHolding(false); cancelAnimationFrame(holdRef.current); setProgress(0); }
  };

  const pct = Math.round(progress * 100);
  const ringDash = 2 * Math.PI * 44;
  const ringOff = ringDash * (1 - progress);

  return (
    <div style={{ animation: "slideUp 0.4s ease", textAlign: "center" }}>
      <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 2, marginBottom: 4 }}>ながおし して！</div>
      <div style={{ fontSize: "0.85rem", color: "#888", marginBottom: 14 }}>おして おさえて…</div>
      <div style={{ position: "relative", width: 110, height: 110, margin: "0 auto" }} onPointerDown={onDown} onPointerUp={onUp} onPointerLeave={onUp}>
        <svg width={110} height={110} style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
          <circle cx={55} cy={55} r={44} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={8} />
          <circle cx={55} cy={55} r={44} fill="none" stroke={done ? "#66BB6A" : color} strokeWidth={8} strokeDasharray={ringDash} strokeDashoffset={ringOff} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.05s linear" }} />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2.2rem", cursor: "pointer", userSelect: "none",
          animation: holding ? "holdPulse 0.3s ease infinite" : "none",
        }}>{done ? "✓" : emoji}</div>
      </div>
      <div style={{ fontSize: "0.75rem", color: "#bbb", marginTop: 6, fontWeight: 700 }}>{done ? "できた！" : holding ? `${pct}%` : "ぎゅっと おして！"}</div>
    </div>
  );
};

export default HoldGame;
