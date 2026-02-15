// /home/user/train-correction/src/components/running/RunOnomatopoeia.jsx
const F = "'Zen Maru Gothic', sans-serif";

const ONOMAT = [
  { txt: "ガタンゴトン", x: 10, y: 15, size: 1.2, dur: 2.8, delay: 0 },
  { txt: "シュー",       x: 55, y: 22, size: 0.95, dur: 3.2, delay: 0.6 },
  { txt: "ゴォー",       x: 30, y: 30, size: 1.35, dur: 3.5, delay: 1.2 },
  { txt: "カタカタ",     x: 65, y: 12, size: 0.85, dur: 2.6, delay: 1.8 },
  { txt: "ヒューッ",     x: 42, y: 35, size: 1.0, dur: 3.0, delay: 2.4 },
];

const RunOnomatopoeia = ({ speed }) => {
  if (speed <= 0.2) return null;

  // Speed-based color: slow=brown/faint, fast=darker/more visible
  const clampedSpeed = Math.min(Math.max(speed, 0), 1);
  const baseAlpha = 0.15 + clampedSpeed * 0.4;

  // Color shifts based on speed: brown -> reddish-brown -> dark
  const r = Math.round(91 + clampedSpeed * 40);
  const g = Math.round(58 - clampedSpeed * 20);
  const b = Math.round(26 - clampedSpeed * 10);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 5 }}>
      {ONOMAT.map((item, i) => {
        // Only show more items at higher speeds
        if (i >= 3 && speed < 0.5) return null;
        if (i >= 4 && speed < 0.7) return null;

        const alpha = baseAlpha * (1 - i * 0.08);
        const fontSize = item.size * (0.85 + clampedSpeed * 0.25);

        return (
          <div key={i} style={{
            position: "absolute",
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${fontSize}rem`,
            fontWeight: 900,
            color: `rgba(${r},${g},${b},${alpha})`,
            fontFamily: F,
            letterSpacing: speed > 0.7 ? 5 : 3,
            whiteSpace: "nowrap",
            textShadow: speed > 0.6
              ? `0 0 8px rgba(${r},${g},${b},${alpha * 0.3})`
              : "none",
            animation: `onomatFloat ${item.dur / (0.7 + clampedSpeed * 0.3)}s ${item.delay}s ease-out infinite`,
          }}>{item.txt}</div>
        );
      })}
    </div>
  );
};

export default RunOnomatopoeia;
