import { useMemo } from "react";

const RunSeasonalParticles = ({ season }) => {
  if (!season) return null;

  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 18; i++) {
      arr.push({
        x: Math.random() * 100,
        s: season === "sakura" ? 10 + Math.random() * 8 : 4 + Math.random() * 4,
        d: Math.random() * 5,
        dur: 3 + Math.random() * 4,
      });
    }
    return arr;
  }, [season]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 8 }}>
      {items.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: `${p.x}%`, top: -20,
          width: p.s, height: p.s,
          background: season === "sakura" ? "#FFB7C5" : "#fff",
          borderRadius: season === "sakura" ? "50% 0 50% 50%" : "50%",
          opacity: 0.7,
          animation: `snowfall ${p.dur}s ${p.d}s linear infinite`,
        }} />
      ))}
    </div>
  );
};

export default RunSeasonalParticles;
