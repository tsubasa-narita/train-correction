import { useState, useEffect, useRef } from "react";
import { TRAINS } from "../../data/trains";
import { loadCollection } from "../../systems/stamps";
import DepotTrainSVG from "../svg/DepotTrainSVG";
import { FONT, COLORS, FONT_SIZE, SPACE, RADIUS } from "../../data/tokens";

/* Deterministic star data (no Math.random in render) */
const STARS = Array.from({ length: 30 }, (_, i) => ({
  x: (5 + (i * 47 + i * i * 3) % 90),
  y: (3 + (i * 31 + i * 7) % 55),
  size: 2 + (i % 4),
  opacity: 0.25 + ((i * 17) % 50) / 100,
  color: i % 5 === 0 ? "#B8D4FF" : i % 7 === 0 ? "#FFEEBB" : "#FFFFFF",
  dur: 2 + (i % 3),
  delay: (i * 0.3) % 4,
}));

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
    <div style={{
      minHeight: "100dvh",
      background: `linear-gradient(180deg,${COLORS.bgDark1} 0%,${COLORS.bgDark2} 40%,${COLORS.bgDark3} 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: FONT, padding: `${SPACE.xl}px ${SPACE.lg}px`, position: "relative", overflow: "hidden",
    }}>
      {/* Stars background - varied sizes, colors, deterministic */}
      {STARS.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          width: s.size, height: s.size,
          borderRadius: "50%",
          background: s.color,
          opacity: s.opacity,
          left: `${s.x}%`, top: `${s.y}%`,
          boxShadow: s.size >= 4 ? `0 0 ${s.size * 2}px ${s.color}40` : "none",
          animation: `twinkle ${s.dur}s ease-in-out infinite ${s.delay}s`,
        }} />
      ))}

      {/* Bottom gradient overlay for depth */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
        background: "linear-gradient(180deg, transparent 0%, rgba(10,10,30,0.4) 100%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Title - おうちで */}
      <div style={{
        fontSize: FONT_SIZE.xl, fontWeight: 900, letterSpacing: 4, textAlign: "center",
        background: `linear-gradient(180deg, ${COLORS.gold} 20%, #FFD700 80%)`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        filter: `drop-shadow(0 2px 10px ${COLORS.goldGlow})`,
        marginBottom: SPACE.xs, zIndex: 5,
      }}>
        おうちで
      </div>

      {/* Title - しゅっぱつしんこう！ */}
      <div style={{
        fontSize: FONT_SIZE.xxl, fontWeight: 900, letterSpacing: 6, textAlign: "center",
        background: `linear-gradient(180deg, ${COLORS.gold} 10%, #FFC800 50%, #FFD700 100%)`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        filter: `drop-shadow(0 3px 14px ${COLORS.goldGlow})`,
        marginBottom: SPACE.xl, zIndex: 5,
      }}>
        しゅっぱつしんこう！
      </div>

      {/* Mystery train silhouette - bigger, pulsing glow */}
      <div style={{
        width: 260, height: 100, marginBottom: SPACE.xl, zIndex: 5,
        filter: `drop-shadow(0 0 18px rgba(100,140,255,0.25))`,
        animation: "pulse 3s ease-in-out infinite",
      }}>
        <svg viewBox="0 0 220 70" style={{ width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="hm-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#667" />
              <stop offset="100%" stopColor="#445" />
            </linearGradient>
            <filter id="hm-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Glow outline */}
          <rect x={15} y={10} width={130} height={46} rx={8} fill="none" stroke="rgba(120,160,255,0.3)" strokeWidth="2" strokeDasharray="6 4" filter="url(#hm-glow)" />
          <path d="M145,10 C160,10 175,18 182,32 C175,46 160,54 145,54" fill="none" stroke="rgba(120,160,255,0.3)" strokeWidth="2" strokeDasharray="6 4" filter="url(#hm-glow)" />
          {/* Body */}
          <rect x={15} y={10} width={130} height={46} rx={8} fill="url(#hm-body)" opacity="0.45" />
          <path d="M145,10 C160,10 175,18 182,32 C175,46 160,54 145,54" fill="#556" opacity="0.4" />
          {/* Question mark */}
          <text x={95} y={43} textAnchor="middle" fontSize="28" fontWeight="900" fontFamily={FONT} fill={COLORS.gold} opacity="0.6" filter="url(#hm-glow)">？</text>
          {/* Wheels */}
          <circle cx={35} cy={60} r={4.5} fill="#556" opacity="0.5" />
          <circle cx={55} cy={60} r={4.5} fill="#556" opacity="0.5" />
          <circle cx={112} cy={60} r={4.5} fill="#556" opacity="0.5" />
          <circle cx={132} cy={60} r={4.5} fill="#556" opacity="0.5" />
          {/* Headlight glow */}
          <ellipse cx={180} cy={32} rx={4} ry={3} fill={COLORS.gold} opacity="0.2" />
        </svg>
      </div>

      {/* Start button - with inner highlight and text-shadow */}
      <button
        onClick={onStart}
        onPointerDown={() => setPressing(true)}
        onPointerUp={() => setPressing(false)}
        onPointerLeave={() => setPressing(false)}
        style={{
          padding: `${SPACE.xl}px ${SPACE.xxxl}px`,
          borderRadius: RADIUS.xl + 4,
          border: "none",
          background: pressing
            ? `linear-gradient(145deg,#E55555,${COLORS.red})`
            : `linear-gradient(145deg,#FF8080 0%,#FF6B6B 30%,${COLORS.red} 100%)`,
          color: COLORS.white,
          fontSize: "1.5rem", fontWeight: 900, letterSpacing: 4,
          cursor: "pointer", fontFamily: FONT,
          boxShadow: pressing
            ? `0 2px 0 ${COLORS.redDark}, inset 0 1px 2px rgba(0,0,0,0.2)`
            : `0 6px 0 ${COLORS.redDark}, 0 8px 24px rgba(229,37,60,0.45), inset 0 1px 0 rgba(255,255,255,0.25)`,
          transform: pressing ? "translateY(4px)" : "translateY(0)",
          transition: "all 0.1s ease",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          animation: "pulse 2s ease-in-out infinite",
          zIndex: 5, position: "relative",
        }}
      >
        あそぶ
      </button>

      {/* Subtitle */}
      <div style={{
        fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: SPACE.md,
        zIndex: 5, letterSpacing: 2,
        textShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }}>
        ナゾの でんしゃを つくろう！
      </div>

      {/* Collection preview - with mini DepotTrainSVG */}
      <button onClick={onCollection} style={{
        marginTop: SPACE.xxl, padding: `${SPACE.md}px ${SPACE.xl}px`,
        borderRadius: RADIUS.lg,
        background: COLORS.glass,
        border: `1px solid ${COLORS.glassBorder}`,
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        cursor: "pointer", fontFamily: FONT, zIndex: 5,
        display: "flex", flexDirection: "column", alignItems: "center", gap: SPACE.sm,
      }}>
        <div style={{
          fontSize: FONT_SIZE.sm, fontWeight: 700, color: COLORS.textLight,
          letterSpacing: 2, textShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}>
          コレクション
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {TRAINS.map((tr) => (
            <div key={tr.id} style={{
              width: 36, height: 20, borderRadius: RADIUS.sm,
              overflow: "hidden", position: "relative",
              background: collected[tr.id] ? "transparent" : COLORS.glass,
              border: collected[tr.id]
                ? `1px solid rgba(255,255,255,0.25)`
                : `1px solid rgba(255,255,255,0.06)`,
              opacity: collected[tr.id] ? 1 : 0.4,
              transition: "all 0.3s ease",
            }}>
              {collected[tr.id] ? (
                <DepotTrainSVG train={tr} />
              ) : (
                <div style={{
                  width: "100%", height: "100%", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "0.5rem", color: "rgba(255,255,255,0.2)",
                }}>？</div>
              )}
            </div>
          ))}
        </div>
        <div style={{
          fontSize: FONT_SIZE.xs, fontWeight: 700, color: COLORS.textMuted,
        }}>
          {total} / {TRAINS.length} しゃしゅ
        </div>
      </button>

      {/* Settings (long press) - glass button with backdrop blur */}
      <button
        onPointerDown={() => { lp.current = setTimeout(onOpenSettings, 600); }}
        onPointerUp={() => { clearTimeout(lp.current); }}
        onPointerLeave={() => { clearTimeout(lp.current); }}
        style={{
          position: "fixed", bottom: 20, right: 20,
          width: 48, height: 48, borderRadius: RADIUS.pill,
          background: "rgba(255,255,255,0.06)",
          border: `1px solid ${COLORS.glassBorder}`,
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: "1.3rem",
          color: COLORS.textMuted,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
          zIndex: 10,
          transition: "background 0.2s ease",
        }}
      >
        ⚙️
      </button>
      <div style={{
        position: "fixed", bottom: 72, right: 14,
        fontSize: "0.55rem", color: "rgba(255,255,255,0.15)",
        zIndex: 10, textAlign: "center",
        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
      }}>ながおしで<br />せってい</div>
    </div>
  );
};

export default HomeScreen;
