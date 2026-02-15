import { useEffect } from "react";
import ParticleBurst from "./ParticleBurst";
import { FONT, COLORS, RADIUS } from "../../data/tokens";

const PartGetBanner = ({ label, visible, onDone }) => {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onDone, 2200);
      return () => { clearTimeout(t); };
    }
  }, [visible, onDone]);

  if (!visible) return null;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      animation: "bannerPop 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      position: "relative",
    }}>
      <ParticleBurst />

      {/* Outer glow layer */}
      <div style={{
        position: "relative",
        filter: `drop-shadow(0 0 16px ${COLORS.goldGlow}) drop-shadow(0 0 32px rgba(255,180,50,0.25))`,
      }}>
        {/* Ribbon-like top tab */}
        <div style={{
          position: "absolute",
          top: -14,
          left: "50%",
          transform: "translateX(-50%)",
          background: `linear-gradient(135deg, ${COLORS.red}, ${COLORS.redDark})`,
          color: COLORS.white,
          fontSize: "0.7rem",
          fontWeight: 800,
          fontFamily: FONT,
          letterSpacing: 2,
          padding: "3px 18px 5px",
          borderRadius: `${RADIUS.sm}px ${RADIUS.sm}px 0 0`,
          zIndex: 2,
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          boxShadow: "0 -2px 8px rgba(229,37,60,0.3)",
        }}>
          NEW
        </div>

        {/* Main banner card */}
        <div style={{
          position: "relative",
          background: `linear-gradient(155deg, ${COLORS.gold}, #FFB347, ${COLORS.gold})`,
          borderRadius: RADIUS.xl,
          padding: "20px 40px 18px",
          textAlign: "center",
          border: "3px solid rgba(255,255,255,0.5)",
          boxShadow: `
            0 8px 28px rgba(0,0,0,0.25),
            inset 0 1px 0 rgba(255,255,255,0.6),
            inset 0 -2px 0 rgba(0,0,0,0.08)
          `,
          overflow: "hidden",
        }}>
          {/* Inner shine overlay */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "45%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.4), transparent)",
            borderRadius: `${RADIUS.xl}px ${RADIUS.xl}px 0 0`,
            pointerEvents: "none",
          }} />

          {/* Decorative sparkle row */}
          <div style={{
            fontSize: "1.8rem",
            marginBottom: 4,
            position: "relative",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}>
            {"\u2728\uD83C\uDF89\u2728"}
          </div>

          {/* Part name label */}
          <div style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            color: COLORS.textBrown,
            letterSpacing: 3,
            fontFamily: FONT,
            textShadow: "0 1px 0 rgba(255,255,255,0.5)",
            position: "relative",
            marginBottom: 4,
          }}>
            {label}
          </div>

          {/* Sub-label */}
          <div style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "rgba(123,63,0,0.65)",
            letterSpacing: 2,
            fontFamily: FONT,
            position: "relative",
          }}>
            {"\u30D1\u30FC\u30C4 \u30B2\u30C3\u30C8\uFF01"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartGetBanner;
