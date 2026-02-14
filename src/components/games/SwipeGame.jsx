import { useState, useEffect } from "react";
import { SFX } from "../../systems/sound";

const SwipeGame = ({ color, emoji, onComplete, disabled }) => {
  const [swiped, setSwiped] = useState(false);
  const [startX, setStartX] = useState(null);
  const [dragX, setDragX] = useState(0);
  const threshold = 120;
  const done = swiped;

  useEffect(() => { if (done && onComplete) onComplete(); }, [done]);

  const onStart = (e) => { if (!disabled && !done) setStartX(e.clientX); };
  const onMove = (e) => {
    if (startX === null || done) return;
    const dx = e.clientX - startX;
    setDragX(Math.max(0, dx));
    if (dx > threshold) { setSwiped(true); setStartX(null); SFX.swipeDone(); }
  };
  const onEnd = () => { if (!done) { setStartX(null); setDragX(0); } };

  return (
    <div style={{ animation: "slideUp 0.4s ease", textAlign: "center" }}>
      <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 2, marginBottom: 4 }}>よこに スワイプ！</div>
      <div style={{ fontSize: "0.85rem", color: "#888", marginBottom: 14 }}>→ みぎに スライド</div>
      <div
        style={{ width: "min(280px,75vw)", height: 70, background: "rgba(0,0,0,0.06)", borderRadius: 35, margin: "0 auto", position: "relative", overflow: "hidden", touchAction: "none" }}
        onPointerDown={onStart} onPointerMove={onMove} onPointerUp={onEnd} onPointerLeave={onEnd}
      >
        <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: "1.5rem", opacity: 0.2 }}>→→→</div>
        <div style={{
          position: "absolute", left: 6 + dragX, top: 4, width: 62, height: 62, borderRadius: "50%",
          background: done ? "#66BB6A" : `linear-gradient(145deg,${color},${color}cc)`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2)", transition: done ? "left 0.3s ease" : "none", cursor: "grab",
        }}>{done ? "✓" : emoji}</div>
      </div>
    </div>
  );
};

export default SwipeGame;
