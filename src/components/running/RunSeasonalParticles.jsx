// /home/user/train-correction/src/components/running/RunSeasonalParticles.jsx
import { useMemo } from "react";

const SAKURA_COLORS = ["#FFB7C5", "#FF9EB5", "#FFCAD4", "#F4A0B0", "#FFD1DC", "#E8899A"];
const SNOW_SIZES = [3, 4, 5, 6, 7, 8];

const RunSeasonalParticles = ({ season }) => {
  if (!season) return null;

  const items = useMemo(() => {
    const arr = [];
    const count = season === "sakura" ? 28 : 26;
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * 110 - 5,
        // Sakura: petal-shaped with varied sizes; Snow: varied round sizes
        size: season === "sakura"
          ? 8 + Math.random() * 10
          : SNOW_SIZES[Math.floor(Math.random() * SNOW_SIZES.length)],
        delay: Math.random() * 6,
        dur: season === "sakura" ? 4 + Math.random() * 5 : 5 + Math.random() * 6,
        color: season === "sakura"
          ? SAKURA_COLORS[Math.floor(Math.random() * SAKURA_COLORS.length)]
          : "#fff",
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2,
        // Sine wave drift parameters
        driftAmp: 15 + Math.random() * 25,
        driftFreq: 0.5 + Math.random() * 1.5,
        opacity: season === "sakura" ? 0.5 + Math.random() * 0.4 : 0.4 + Math.random() * 0.5,
        // Snow sparkle
        sparkle: season === "snow" && Math.random() > 0.6,
      });
    }
    return arr;
  }, [season]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 8 }}>
      <style>{`
        @keyframes sakuraDrift {
          0% {
            transform: translateY(-20px) translateX(0px) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          5% { opacity: 1; }
          25% { transform: translateY(25vh) translateX(20px) rotate(90deg) scale(1); }
          50% { transform: translateY(50vh) translateX(-15px) rotate(180deg) scale(0.9); }
          75% { transform: translateY(75vh) translateX(25px) rotate(270deg) scale(1.05); }
          95% { opacity: 0.6; }
          100% {
            transform: translateY(100vh) translateX(0px) rotate(360deg) scale(0.8);
            opacity: 0;
          }
        }
        @keyframes snowDrift {
          0% {
            transform: translateY(-20px) translateX(0px);
            opacity: 0;
          }
          8% { opacity: 1; }
          25% { transform: translateY(25vh) translateX(15px); }
          50% { transform: translateY(50vh) translateX(-10px); }
          75% { transform: translateY(75vh) translateX(18px); }
          90% { opacity: 0.7; }
          100% {
            transform: translateY(100vh) translateX(-5px);
            opacity: 0;
          }
        }
        @keyframes snowSparkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
      {items.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${p.x}%`,
          top: -20,
          animation: season === "sakura"
            ? `sakuraDrift ${p.dur}s ${p.delay}s ease-in-out infinite`
            : `snowDrift ${p.dur}s ${p.delay}s linear infinite`,
        }}>
          {season === "sakura" ? (
            // Sakura petal shape: ellipse with rotation + gradient
            <div style={{
              width: p.size,
              height: p.size * 0.6,
              borderRadius: "50% 0 50% 50%",
              background: `linear-gradient(135deg, ${p.color} 0%, ${p.color}88 60%, #fff8 100%)`,
              opacity: p.opacity,
              transform: `rotate(${p.rotation}deg)`,
              boxShadow: `0 0 3px ${p.color}66`,
            }} />
          ) : (
            // Snow: round with varied sizes and optional sparkle
            <div style={{
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.sparkle
                ? "radial-gradient(circle, #fff 40%, #e8f0ff 70%, #cde 100%)"
                : "radial-gradient(circle, #fff 30%, #e4ecf7 100%)",
              opacity: p.opacity,
              boxShadow: p.sparkle ? "0 0 4px rgba(255,255,255,0.8)" : "none",
              animation: p.sparkle ? "snowSparkle 1.5s ease-in-out infinite" : "none",
            }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default RunSeasonalParticles;
