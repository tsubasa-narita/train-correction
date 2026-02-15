import { useState, useEffect, useMemo } from "react";
import { SFX } from "../../systems/sound";
import { getSteps } from "../../data/gameSteps";
import TrainSVG from "../svg/TrainSVG";
import ParticleBurst from "../ui/ParticleBurst";
import BigButton from "../ui/BigButton";

const F = "'Zen Maru Gothic', sans-serif";

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
        ? `linear-gradient(180deg,${train.body}22 0%,#FFF8E1 40%,#FFECB3 100%)`
        : "linear-gradient(180deg,#2C2C3A 0%,#3A3A4A 50%,#4A4A5A 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: F, padding: "20px 16px", position: "relative", overflow: "hidden",
      transition: "background 0.8s ease",
    }}>
      {/* Flash effect during drumroll */}
      {phase === 1 && <div style={{
        position: "absolute", inset: 0, background: "#fff",
        animation: "revealFlash 1.6s ease-in-out",
        pointerEvents: "none", zIndex: 20,
      }} />}

      {/* Title */}
      <div style={{ marginBottom: 16, textAlign: "center", zIndex: 10 }}>
        {phase < 2 && (
          <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#FFE066", letterSpacing: 3, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            {phase === 0 ? "この でんしゃは…" : "じゃじゃーん！"}
          </div>
        )}
        {phase >= 2 && (
          <div style={{ animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 4, textShadow: "0 2px 4px rgba(255,255,255,0.8)" }}>
              {train.name}！
            </div>
            <div style={{ fontSize: "0.9rem", color: "#888", marginTop: 4 }}>{train.series}</div>
          </div>
        )}
      </div>

      {/* Train SVG - transitions from mystery to revealed */}
      <div style={{
        width: "100%", maxWidth: 480, position: "relative", zIndex: 10,
        animation: phase >= 2 ? "float 2s ease-in-out infinite" : (phase === 1 ? "revealShake 0.4s ease-in-out infinite" : "none"),
        transform: phase >= 2 ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.6s ease",
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

      {/* Particles on reveal */}
      {phase >= 2 && <div style={{ position: "absolute", top: "40%", left: "50%", zIndex: 15 }}><ParticleBurst /></div>}

      {/* Departure button */}
      {phase >= 3 && (
        <div style={{ marginTop: 24, animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)", zIndex: 10 }}>
          <BigButton
            onClick={onDepart}
            label="しゅっぱつ しんこう！"
            emoji={train.kind === "steam" ? "🚂" : "🚄"}
            color="#E5253C"
            pulse
          />
        </div>
      )}

      {/* Inline keyframes for reveal-specific animations */}
      <style>{`
        @keyframes revealFlash {
          0% { opacity: 0; }
          30% { opacity: 0.6; }
          50% { opacity: 0; }
          70% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        @keyframes revealShake {
          0%, 100% { transform: translateX(0) rotate(0); }
          25% { transform: translateX(-4px) rotate(-1deg); }
          75% { transform: translateX(4px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
};

export default RevealScreen;
