import { useState, useEffect } from "react";
import { SFX } from "../../systems/sound";
import PlatformSVG from "../svg/PlatformSVG";
import { FONT, COLORS, FONT_SIZE, SPACE, RADIUS } from "../../data/tokens";

const ArrivalSequence = ({ stationName, train, onGoReward }) => {
  const [step, setStep] = useState(0);
  const labels = ["もうすぐ つくよ…", "ホームに はいります", "とうちゃく！", "ドアが ひらきます", "🎊 おかえりなさい！"];

  useEffect(() => {
    const timers = [
      setTimeout(() => { setStep(1); }, 1500),
      setTimeout(() => { setStep(2); SFX.arrival(); }, 3000),
      setTimeout(() => { setStep(3); SFX.doorClose(); }, 4500),
      setTimeout(() => { setStep(4); SFX.celebrate(); }, 6000),
    ];
    return () => { timers.forEach(clearTimeout); };
  }, []);

  const doorsText = step === 3 ? "プシュー" : null;

  /* Decorative confetti dots for step 4 */
  const confettiColors = [COLORS.gold, COLORS.red, "#88D8F7", "#A8E6CF", "#FFB347", "#B8A9D4"];

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(180deg,#E8F0F8 0%,#D8E4EE 50%,#C8D4DE 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: FONT, position: "relative", overflow: "hidden", padding: SPACE.lg,
    }}>

      {/* Step progress indicator */}
      <div style={{
        position: "absolute", top: SPACE.xl, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: SPACE.sm, zIndex: 20,
      }}>
        {[0, 1, 2, 3, 4].map((s) => (
          <div key={s} style={{
            width: s <= step ? 12 : 8, height: s <= step ? 12 : 8,
            borderRadius: RADIUS.pill,
            background: s <= step
              ? (s === step ? "linear-gradient(135deg,#FFE066,#FF9F43)" : COLORS.gold)
              : "rgba(0,0,0,0.08)",
            boxShadow: s === step ? `0 0 8px ${COLORS.goldGlow}` : "none",
            transition: "all 0.4s ease",
            animation: s === step ? "pulse 1.2s ease-in-out infinite" : "none",
          }} />
        ))}
      </div>

      {/* Station name banner */}
      <div style={{
        marginBottom: SPACE.md,
        padding: `${SPACE.sm}px ${SPACE.xl}px`,
        background: "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.6))",
        borderRadius: RADIUS.pill,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
        backdropFilter: "blur(8px)",
        textAlign: "center",
        animation: "fadeIn 0.6s ease",
      }}>
        <div style={{
          fontSize: FONT_SIZE.lg, fontWeight: 900, color: COLORS.textBrown,
          letterSpacing: 3,
          textShadow: "0 1px 2px rgba(255,255,255,0.8)",
        }}>
          {stationName}えき
        </div>
        <div style={{ fontSize: FONT_SIZE.xs, color: "#999", fontWeight: 700, marginTop: 2, letterSpacing: 1 }}>
          しゅうてんえき
        </div>
      </div>

      {/* Platform / train animation */}
      <div style={{
        width: "100%", maxWidth: 520, position: "relative", overflow: "hidden",
        borderRadius: RADIUS.lg,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}>
        <div style={{
          transition: step >= 1 ? "transform 1.5s cubic-bezier(0.25,0.46,0.45,0.94)" : "none",
          transform: step === 0 ? "translateX(70%)" : step === 1 ? "translateX(20%)" : "translateX(0)",
        }}>
          <PlatformSVG
            showTrain train={train} trainOffsetX={0}
            doorsLabel={doorsText} stationLabel={`${stationName}えき`}
            sublabel="しゅうてんえき" boardText="まもなく とうちゃく"
          />
        </div>
      </div>

      {/* Confetti decorations at step 4 */}
      {step >= 4 && confettiColors.map((color, i) => (
        <div key={`confetti-l-${i}`} style={{
          position: "absolute",
          top: `${15 + (i * 12) % 60}%`,
          left: `${5 + (i * 7) % 25}%`,
          width: i % 2 === 0 ? 8 : 6,
          height: i % 2 === 0 ? 8 : 12,
          background: color,
          borderRadius: i % 3 === 0 ? RADIUS.pill : 2,
          transform: `rotate(${i * 47}deg)`,
          animation: `fadeIn 0.3s ${i * 0.08}s ease both`,
          opacity: 0.7,
          zIndex: 5,
        }} />
      ))}
      {step >= 4 && confettiColors.map((color, i) => (
        <div key={`confetti-r-${i}`} style={{
          position: "absolute",
          top: `${20 + (i * 14) % 55}%`,
          right: `${5 + (i * 8) % 25}%`,
          width: i % 2 === 0 ? 6 : 10,
          height: i % 2 === 0 ? 10 : 6,
          background: color,
          borderRadius: i % 3 === 1 ? RADIUS.pill : 2,
          transform: `rotate(${i * 63 + 30}deg)`,
          animation: `fadeIn 0.3s ${i * 0.1}s ease both`,
          opacity: 0.7,
          zIndex: 5,
        }} />
      ))}

      {/* Family greeting */}
      {step >= 4 && (
        <div style={{
          marginTop: -16,
          animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          textAlign: "center", zIndex: 10,
          position: "relative",
        }}>
          {/* Sparkles around the family */}
          {[
            { top: -8, left: -16, size: "0.9rem", icon: "✨" },
            { top: -12, right: -14, size: "0.7rem", icon: "⭐" },
            { top: 4, left: -24, size: "0.9rem", icon: "✨" },
            { top: 0, right: -22, size: "0.7rem", icon: "⭐" },
          ].map((sp, i) => (
            <div key={`sparkle-${i}`} style={{
              position: "absolute",
              top: sp.top, left: sp.left, right: sp.right,
              fontSize: sp.size,
              animation: `twinkle 0.8s ${i * 0.2}s ease-in-out infinite alternate`,
              zIndex: 11,
            }}>
              {sp.icon}
            </div>
          ))}
          <div style={{
            fontSize: "4rem",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
          }}>
            👨‍👩‍👧
          </div>
          <div style={{
            fontSize: FONT_SIZE.md, fontWeight: 900, color: COLORS.textBrown,
            letterSpacing: 3, marginTop: SPACE.xs,
            textShadow: `0 1px 4px rgba(255,255,255,0.8), 0 0 12px ${COLORS.goldGlow}`,
          }}>
            おかえり！
          </div>
        </div>
      )}

      {/* Step label */}
      <div style={{ marginTop: step >= 4 ? SPACE.sm : SPACE.xl, textAlign: "center", zIndex: 10 }}>
        <div key={step} style={{
          fontSize: step >= 2 ? FONT_SIZE.xl : FONT_SIZE.lg,
          fontWeight: 900, color: COLORS.textBrown,
          letterSpacing: 3,
          animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          textShadow: "0 1px 4px rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.04)",
          transition: "font-size 0.3s ease",
        }}>
          {labels[step]}
        </div>
      </div>

      {/* "Next" button */}
      {step >= 4 && (
        <button onClick={onGoReward} style={{
          marginTop: SPACE.lg, zIndex: 15,
          padding: `${SPACE.lg}px ${SPACE.xxxl}px`,
          borderRadius: RADIUS.xl,
          border: "none",
          background: "linear-gradient(145deg,#FFE066,#FF9F43)",
          color: "#7B3F00",
          fontSize: FONT_SIZE.lg, fontWeight: 900,
          cursor: "pointer", fontFamily: FONT,
          boxShadow: "0 5px 0 #cc8030, 0 8px 20px rgba(255,159,67,0.3)",
          animation: "popIn 0.5s 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
          letterSpacing: 2,
          position: "relative",
          overflow: "hidden",
          textShadow: "0 1px 0 rgba(255,255,255,0.4)",
        }}>
          {/* Inner shine highlight */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "50%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)",
            borderRadius: `${RADIUS.xl}px ${RADIUS.xl}px 0 0`,
            pointerEvents: "none",
          }} />
          つぎへ すすむ →
        </button>
      )}
    </div>
  );
};

export default ArrivalSequence;
