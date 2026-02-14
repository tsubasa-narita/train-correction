const F = "'Zen Maru Gothic', sans-serif";

const RunOnomatopoeia = ({ speed }) => {
  if (speed <= 0.3) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 5 }}>
      {["ガタンゴトン", "シュー", "ゴォー"].map((txt, i) => (
        <div key={i} style={{
          position: "absolute", left: `${15 + (i * 25) % 60}%`, top: `${18 + (i * 12) % 25}%`,
          fontSize: `${1 + (i % 2) * 0.2}rem`, fontWeight: 900,
          color: "rgba(91,58,26,0.3)", fontFamily: F, letterSpacing: 3,
          animation: `onomatFloat 2.8s ${i * 0.7}s ease-out infinite`, whiteSpace: "nowrap",
        }}>{txt}</div>
      ))}
    </div>
  );
};

export default RunOnomatopoeia;
