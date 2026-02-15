import { useState, useEffect, useMemo } from "react";
import { SFX } from "../../systems/sound";
import { getSteps } from "../../data/gameSteps";
import TrainSVG from "../svg/TrainSVG";
import ParticleBurst from "../ui/ParticleBurst";
import BigButton from "../ui/BigButton";
import { FONT, COLORS, FONT_SIZE, SPACE, RADIUS } from "../../data/tokens";

const RevealScreen = ({ train, settings, onDepart }) => {
  // 0=mystery 1=drumroll 2=revealed 3=ready
  const [phase, setPhase] = useState(0);

  const allParts = useMemo(() => {
    let s = getSteps(settings.stepCount);
    if (train.kind === "steam") s = s.filter((st) => st.partName !== "パンタグラフ");
    return s.map((st) => st.partName);
  }, [settings.stepCount, train.kind]);

  useEffect(() => {
    const timers = [
      setTimeout(() => { setPhase(1); SFX.horn(); }, 1200),
      setTimeout(() => { setPhase(2); SFX.celebrate(); }, 2800),
      setTimeout(() => { setPhase(3); }, 4200),
    ];
    return () => { timers.forEach(clearTimeout); };
  }, []);

  return (
    <div style={{
      minHeight: "100dvh",
      background: phase >= 2
        ? `linear-gradient(180deg,${train.body}22 0%,#FFF8E1 30%,#FFECB3 70%,#FFF3D0 100%)`
        : "linear-gradient(180deg,#1E1E2E 0%,#2A2A3E 40%,#3A3A4E 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: FONT, padding: `${SPACE.xl}px ${SPACE.lg}px`,
      position: "relative", overflow: "hidden",
      transition: "background 1.0s ease",
    }}>

      {/* Vignette overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: phase >= 2
          ? "radial-gradient(ellipse at center, transparent 50%, rgba(200,160,80,0.12) 100%)"
          : "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        transition: "background 1.0s ease",
      }} />

      {/* Phase 0: Spotlight beams from above */}
      {phase < 2 && (
        <>
          <div style={{
            position: "absolute", top: 0, left: "30%", width: "15%", height: "70%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
            transform: "skewX(-8deg)", pointerEvents: "none", zIndex: 2,
          }} />
          <div style={{
            position: "absolute", top: 0, left: "50%", width: "12%", height: "80%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
            transform: "skewX(4deg)", pointerEvents: "none", zIndex: 2,
          }} />
          <div style={{
            position: "absolute", top: 0, right: "25%", width: "10%", height: "60%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
            transform: "skewX(12deg)", pointerEvents: "none", zIndex: 2,
          }} />
        </>
      )}

      {/* Phase 2+: Golden radial burst behind train */}
      {phase >= 2 && (
        <div style={{
          position: "absolute", top: "30%", left: "50%",
          width: 500, height: 500,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${COLORS.goldGlow} 0%, rgba(255,236,179,0.3) 30%, transparent 65%)`,
          pointerEvents: "none", zIndex: 2,
          animation: "pulse 3s ease-in-out infinite",
        }} />
      )}

      {/* Flash effect during drumroll - more dramatic */}
      {phase === 1 && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #fff 0%, rgba(255,240,200,0.9) 100%)",
          animation: "revealFlash 1.6s ease-in-out",
          pointerEvents: "none", zIndex: 20,
        }} />
      )}

      {/* Curtain rise feel: dark panels that slide away */}
      {phase >= 1 && phase < 2 && (
        <>
          <div style={{
            position: "absolute", top: 0, left: 0, width: "50%", height: "100%",
            background: "linear-gradient(90deg, rgba(30,30,46,0.7) 0%, transparent 100%)",
            animation: "revealCurtainL 1.6s ease-in-out forwards",
            pointerEvents: "none", zIndex: 18,
          }} />
          <div style={{
            position: "absolute", top: 0, right: 0, width: "50%", height: "100%",
            background: "linear-gradient(270deg, rgba(30,30,46,0.7) 0%, transparent 100%)",
            animation: "revealCurtainR 1.6s ease-in-out forwards",
            pointerEvents: "none", zIndex: 18,
          }} />
        </>
      )}

      {/* Title */}
      <div style={{ marginBottom: SPACE.lg, textAlign: "center", zIndex: 10 }}>
        {phase < 2 && (
          <div style={{
            fontSize: FONT_SIZE.lg, fontWeight: 900,
            color: COLORS.gold, letterSpacing: 3,
            textShadow: `0 2px 12px rgba(0,0,0,0.6), 0 0 20px ${COLORS.goldGlow}`,
            animation: phase === 1 ? "pulse 0.6s ease-in-out infinite" : "none",
          }}>
            {phase === 0 ? "この でんしゃは..." : "じゃじゃーん！"}
          </div>
        )}
        {phase >= 2 && (
          <div style={{ animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>
            {/* Decorative frame/badge around train name */}
            <div style={{
              display: "inline-block", position: "relative",
              padding: `${SPACE.sm}px ${SPACE.xxl}px`,
              background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,248,225,0.95) 100%)",
              borderRadius: RADIUS.xl,
              boxShadow: `0 4px 20px rgba(91,58,26,0.12), 0 0 0 2px ${COLORS.gold}40, inset 0 1px 0 rgba(255,255,255,0.8)`,
            }}>
              <div style={{
                fontSize: FONT_SIZE.hero, fontWeight: 900,
                color: COLORS.textBrown, letterSpacing: 4,
                textShadow: "0 2px 4px rgba(255,255,255,0.8), 0 0 12px rgba(91,58,26,0.08)",
              }}>
                {train.name}！
              </div>
              {/* Series tag */}
              <div style={{
                display: "inline-block", marginTop: SPACE.xs,
                padding: `${SPACE.xs - 1}px ${SPACE.md}px`,
                borderRadius: RADIUS.pill,
                background: `linear-gradient(135deg, ${train.body}20, ${train.body}35)`,
                border: `1px solid ${train.body}40`,
                fontSize: FONT_SIZE.sm, fontWeight: 700,
                color: "#666", letterSpacing: 1,
              }}>
                {train.series}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Train SVG - transitions from mystery to revealed */}
      <div style={{
        width: "100%", maxWidth: 480, position: "relative", zIndex: 10,
        animation: phase >= 2 ? "float 2s ease-in-out infinite" : (phase === 1 ? "revealShake 0.4s ease-in-out infinite" : "none"),
        transform: phase >= 2 ? "scale(1.08)" : "scale(1)",
        transition: "transform 0.6s ease",
        filter: phase >= 2 ? `drop-shadow(0 6px 20px ${train.body}40)` : "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
      }}>
        <TrainSVG
          train={train}
          parts={allParts}
          animating={null}
          animProgress={0}
          stepCount={settings.stepCount}
          mystery={phase < 2}
        />
      </div>

      {/* Particles on reveal - multiple positions */}
      {phase >= 2 && (
        <>
          <div style={{ position: "absolute", top: "35%", left: "50%", zIndex: 15 }}><ParticleBurst /></div>
          <div style={{ position: "absolute", top: "55%", left: "30%", zIndex: 15 }}><ParticleBurst /></div>
          <div style={{ position: "absolute", top: "55%", left: "70%", zIndex: 15 }}><ParticleBurst /></div>
        </>
      )}

      {/* Departure button */}
      {phase >= 3 && (
        <div style={{
          marginTop: SPACE.xl,
          animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          zIndex: 10,
        }}>
          <BigButton
            onClick={onDepart}
            label="しゅっぱつ しんこう！"
            emoji={train.kind === "steam" ? "🚂" : "🚄"}
            color={COLORS.red}
            pulse
          />
        </div>
      )}

      {/* Inline keyframes for reveal-specific animations */}
      <style>{`
        @keyframes revealFlash {
          0% { opacity: 0; }
          15% { opacity: 0.7; }
          30% { opacity: 0.1; }
          50% { opacity: 0.9; }
          70% { opacity: 0.2; }
          85% { opacity: 0.5; }
          100% { opacity: 0; }
        }
        @keyframes revealShake {
          0%, 100% { transform: translateX(0) rotate(0); }
          25% { transform: translateX(-5px) rotate(-1.5deg); }
          75% { transform: translateX(5px) rotate(1.5deg); }
        }
        @keyframes revealCurtainL {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes revealCurtainR {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default RevealScreen;
