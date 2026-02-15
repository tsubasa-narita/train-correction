import { useState, useEffect, useRef } from "react";
import { SFX } from "../../systems/sound";
import PlatformSVG from "../svg/PlatformSVG";
import { FONT, COLORS, FONT_SIZE, SPACE, RADIUS } from "../../data/tokens";

const DepartureScreen = ({ train, coupled, coupledTrain, onDepart }) => {
  const [step, setStep] = useState(0);
  const stepLabels = ["ホームに とうちゃく！", "ドアが しまります", "🔔 はっしゃ ベル！", "しゅっぱつ しんこう！"];
  const trainIcon = train.kind === "steam" ? "🚂" : "🚄";
  // Use ref for onDepart to avoid stale closure
  const onDepartRef = useRef(onDepart);
  onDepartRef.current = onDepart;

  useEffect(() => {
    const timers = [
      setTimeout(() => { setStep(1); SFX.doorClose(); }, 1800),
      setTimeout(() => { setStep(2); SFX.bell(); }, 3200),
      setTimeout(() => { setStep(3); SFX.horn(); }, 4800),
      setTimeout(() => { onDepartRef.current(); }, 6500),
    ];
    return () => { timers.forEach(clearTimeout); };
  }, []);

  const doorsText = step === 1 ? "プシュー…" : null;

  /* Current time for departure board display */
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(180deg,#E0E8F0 0%,#EAE0D8 50%,#DDD6CE 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: FONT, position: "relative", overflow: "hidden", padding: SPACE.lg,
    }}>

      {/* Overhead roof shadow at top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 60,
        background: "linear-gradient(180deg, rgba(60,50,40,0.15) 0%, transparent 100%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Departure board */}
      <div style={{
        background: "linear-gradient(180deg, #1A1A1A 0%, #2A2A2A 100%)",
        borderRadius: RADIUS.md,
        padding: `${SPACE.sm}px ${SPACE.xl}px`,
        marginBottom: SPACE.lg,
        boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        zIndex: 5, minWidth: 280,
        position: "relative",
      }}>
        {/* Subtle LED glow effect */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: RADIUS.md,
          boxShadow: "inset 0 0 20px rgba(255,160,0,0.03)",
          pointerEvents: "none",
        }} />
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: SPACE.lg,
        }}>
          <div style={{
            fontSize: FONT_SIZE.xs, fontWeight: 700,
            color: "#FF9800", letterSpacing: 1,
            textShadow: "0 0 6px rgba(255,152,0,0.4)",
            fontFamily: "monospace",
          }}>
            {timeStr}
          </div>
          <div style={{
            fontSize: FONT_SIZE.md, fontWeight: 900,
            color: COLORS.gold, letterSpacing: 2,
            textShadow: `0 0 8px ${COLORS.goldGlow}`,
          }}>
            {train.name}
          </div>
          <div style={{
            fontSize: FONT_SIZE.xs, fontWeight: 700,
            color: COLORS.success, letterSpacing: 1,
            textShadow: "0 0 6px rgba(76,175,80,0.4)",
            fontFamily: "monospace",
          }}>
            {step < 3 ? "のりば" : "はっしゃ"}
          </div>
        </div>
        <div style={{
          textAlign: "center", marginTop: SPACE.xs,
          fontSize: FONT_SIZE.xs, color: "rgba(255,255,255,0.3)",
          letterSpacing: 1,
        }}>
          {step < 2 ? "まもなく はっしゃ" : step === 2 ? "はっしゃ ベル なりました" : "しゅっぱつ！"}
        </div>
      </div>

      {/* Platform SVG area */}
      <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 5 }}>
        <div style={{
          transition: step >= 3 ? "transform 1.5s cubic-bezier(0.25,0.46,0.45,0.94)" : "none",
          transform: step >= 3 ? "translateX(60%)" : "translateX(0)",
        }}>
          <PlatformSVG
            showTrain train={train} trainOffsetX={0}
            coupled={coupled} coupledTrain={coupledTrain}
            doorsLabel={doorsText} stationLabel={train.name}
            sublabel="のりば" boardText="まもなく はっしゃ"
          />
        </div>
      </div>

      {/* Bell with glow and ring waves */}
      {step === 2 && (
        <div style={{
          position: "absolute", top: "18%", left: "50%",
          transform: "translateX(-50%)", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          {/* Ring wave circles */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            width: 80, height: 80,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: "2px solid rgba(255,200,0,0.3)",
            animation: "pulse 1s ease-out infinite",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            width: 120, height: 120,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: "1px solid rgba(255,200,0,0.15)",
            animation: "pulse 1s ease-out infinite 0.3s",
            pointerEvents: "none",
          }} />
          <div style={{
            fontSize: "3.5rem",
            animation: "bellSwing 0.3s ease-in-out infinite alternate",
            filter: `drop-shadow(0 0 16px ${COLORS.goldGlow}) drop-shadow(0 2px 8px rgba(0,0,0,0.2))`,
          }}>🔔</div>
        </div>
      )}

      {/* Step progress dots */}
      <div style={{
        display: "flex", gap: SPACE.sm, marginTop: SPACE.lg,
        zIndex: 10,
      }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            width: i <= step ? 12 : 8,
            height: i <= step ? 12 : 8,
            borderRadius: RADIUS.pill,
            background: i <= step
              ? i === step
                ? `linear-gradient(135deg, ${COLORS.gold}, #FFB800)`
                : COLORS.success
              : "rgba(0,0,0,0.1)",
            border: i === step ? `2px solid ${COLORS.goldDark}` : "none",
            boxShadow: i === step ? `0 0 8px ${COLORS.goldGlow}` : "none",
            transition: "all 0.4s ease",
          }} />
        ))}
      </div>

      {/* Step label - enhanced typography */}
      <div style={{ marginTop: SPACE.md, textAlign: "center", zIndex: 10 }}>
        <div key={step} style={{
          fontSize: "1.5rem", fontWeight: 900,
          color: COLORS.textBrown, letterSpacing: 3,
          animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          textShadow: "0 1px 6px rgba(255,255,255,0.9), 0 2px 12px rgba(91,58,26,0.1)",
          padding: `${SPACE.sm}px ${SPACE.xl}px`,
          background: step >= 3
            ? "linear-gradient(135deg, rgba(255,224,102,0.15), rgba(255,224,102,0.05))"
            : "transparent",
          borderRadius: RADIUS.lg,
          transition: "background 0.4s ease",
        }}>
          {trainIcon} {stepLabels[step]}
        </div>
      </div>
    </div>
  );
};

export default DepartureScreen;
