import { useState, useEffect } from "react";
import { SFX } from "../../systems/sound";
import PlatformSVG from "../svg/PlatformSVG";

const F = "'Zen Maru Gothic', sans-serif";

const ArrivalSequence = ({ stationName, train, onGoReward }) => {
  const [step, setStep] = useState(0);
  // 0=減速中 1=ホーム進入 2=停車 3=ドア開 4=おかえり
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

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg,#E8F0F8 0%,#D8E4EE 50%,#C8D4DE 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F, position: "relative", overflow: "hidden", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: 520, position: "relative", overflow: "hidden" }}>
        <div style={{ transition: step >= 1 ? "transform 1.5s cubic-bezier(0.25,0.46,0.45,0.94)" : "none", transform: step === 0 ? "translateX(70%)" : step === 1 ? "translateX(20%)" : "translateX(0)" }}>
          <PlatformSVG
            showTrain train={train} trainOffsetX={0}
            doorsLabel={doorsText} stationLabel={`${stationName}えき`}
            sublabel="しゅうてんえき" boardText="まもなく とうちゃく"
          />
        </div>
      </div>

      {/* Family waiting on platform */}
      {step >= 4 && <div style={{ marginTop: -20, animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)", textAlign: "center", zIndex: 10 }}>
        <div style={{ fontSize: "3rem" }}>👨‍👩‍👧</div>
        <div style={{ fontSize: "1rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 2, marginTop: 2 }}>おかえり！</div>
      </div>}

      <div style={{ marginTop: step >= 4 ? 8 : 20, textAlign: "center", zIndex: 10 }}>
        <div key={step} style={{ fontSize: "1.4rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 3, animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)", textShadow: "0 1px 4px rgba(255,255,255,0.8)" }}>
          {labels[step]}
        </div>
      </div>

      {step >= 4 && <button onClick={onGoReward} style={{ marginTop: 16, zIndex: 15, padding: "14px 36px", borderRadius: 20, border: "none", background: "linear-gradient(145deg,#FFE066,#FF9F43)", color: "#7B3F00", fontSize: "1.15rem", fontWeight: 800, cursor: "pointer", fontFamily: F, boxShadow: "0 4px 0 #cc8030", animation: "popIn 0.5s 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>つぎへ すすむ →</button>}
    </div>
  );
};

export default ArrivalSequence;
