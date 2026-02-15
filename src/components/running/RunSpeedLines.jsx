// /home/user/train-correction/src/components/running/RunSpeedLines.jsx
const LINES = [
  // { yPct, width, height, opacity, delay } - varied lengths, thicknesses, and opacities
  // Main thick lines
  { yPct: 28, w: 80, h: 3, op: 0.35, d: 0.00, main: true },
  { yPct: 42, w: 95, h: 3.5, op: 0.4, d: 0.06, main: true },
  { yPct: 56, w: 70, h: 3, op: 0.3, d: 0.12, main: true },
  { yPct: 70, w: 90, h: 3.5, op: 0.38, d: 0.03, main: true },
  { yPct: 82, w: 75, h: 3, op: 0.32, d: 0.09, main: true },
  // Secondary thin lines
  { yPct: 24, w: 45, h: 1.5, op: 0.2, d: 0.15, main: false },
  { yPct: 33, w: 55, h: 1.5, op: 0.22, d: 0.02, main: false },
  { yPct: 38, w: 35, h: 1, op: 0.15, d: 0.10, main: false },
  { yPct: 48, w: 50, h: 1.5, op: 0.18, d: 0.08, main: false },
  { yPct: 53, w: 30, h: 1, op: 0.14, d: 0.18, main: false },
  { yPct: 62, w: 60, h: 1.5, op: 0.2, d: 0.05, main: false },
  { yPct: 66, w: 40, h: 1, op: 0.16, d: 0.14, main: false },
  { yPct: 76, w: 55, h: 1.5, op: 0.19, d: 0.07, main: false },
  { yPct: 86, w: 38, h: 1, op: 0.13, d: 0.11, main: false },
];

const RunSpeedLines = ({ speed }) => {
  if (speed <= 0.3) return null;

  // At low speeds, only main lines are visible; at higher speeds, all lines show
  const visibleLines = speed > 0.7
    ? LINES
    : LINES.filter(l => l.main || speed > 0.5);

  const speedMult = Math.min(speed, 1);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 4 }}>
      {visibleLines.map((l, i) => (
        <div key={i} style={{
          position: "absolute",
          right: -100,
          top: `${l.yPct}%`,
          width: l.w * (0.7 + speedMult * 0.5),
          height: l.h,
          background: l.main
            ? `linear-gradient(to left, rgba(255,255,255,${l.op * speedMult}), rgba(255,255,255,0))`
            : `rgba(255,255,255,${l.op * speedMult * 0.8})`,
          borderRadius: l.h,
          animation: `speedLine ${Math.max(0.15, 0.35 / speedMult)}s ${l.d}s linear infinite`,
        }} />
      ))}
    </div>
  );
};

export default RunSpeedLines;
