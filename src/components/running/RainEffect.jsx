import { useMemo } from "react";

const RainEffect = ({ weather }) => {
  if (weather !== "rain" && weather !== "rainbow") return null;

  const drops = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      arr.push({ x: Math.random() * 100, d: Math.random() * 2, dur: 0.4 + Math.random() * 0.4, h: 12 + Math.random() * 10 });
    }
    return arr;
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 7 }}>
      {drops.map((d, i) => (
        <div key={i} style={{
          position: "absolute", left: `${d.x}%`, top: -20,
          width: 2, height: d.h,
          background: "rgba(120,160,220,0.35)", borderRadius: 1,
          transform: "rotate(12deg)",
          animation: `rainfall ${d.dur}s ${d.d}s linear infinite`,
        }} />
      ))}
      {[15, 40, 65, 85].map((x, i) => (
        <div key={`p${i}`} style={{
          position: "absolute", bottom: "17%", left: `${x}%`,
          width: 30 + i * 8, height: 4,
          background: "rgba(120,160,220,0.15)", borderRadius: "50%",
          animation: `puddleRipple 1.5s ${i * 0.3}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
};

export default RainEffect;
