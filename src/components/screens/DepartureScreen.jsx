import { useState, useEffect, useRef } from "react";
import { SFX } from "../../systems/sound";
import PlatformSVG from "../svg/PlatformSVG";

const F = "'Zen Maru Gothic', sans-serif";

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

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg,#E8F0F8 0%,#D8E4EE 50%,#C8D4DE 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F, position: "relative", overflow: "hidden", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: 520, position: "relative" }}>
        <div style={{ transition: step >= 3 ? "transform 1.5s cubic-bezier(0.25,0.46,0.45,0.94)" : "none", transform: step >= 3 ? "translateX(60%)" : "translateX(0)" }}>
          <PlatformSVG
            showTrain train={train} trainOffsetX={0}
            coupled={coupled} coupledTrain={coupledTrain}
            doorsLabel={doorsText} stationLabel={train.name}
            sublabel="のりば" boardText="まもなく はっしゃ"
          />
        </div>
      </div>

      {step === 2 && <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
        <div style={{ fontSize: "3rem", animation: "bellSwing 0.3s ease-in-out infinite alternate", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))" }}>🔔</div>
      </div>}

      <div style={{ marginTop: 20, textAlign: "center", zIndex: 10 }}>
        <div key={step} style={{ fontSize: "1.5rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 3, animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)", textShadow: "0 1px 4px rgba(255,255,255,0.8)" }}>
          {trainIcon} {stepLabels[step]}
        </div>
      </div>
    </div>
  );
};

export default DepartureScreen;
