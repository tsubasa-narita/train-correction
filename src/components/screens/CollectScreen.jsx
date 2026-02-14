import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { SFX } from "../../systems/sound";
import { getSteps } from "../../data/gameSteps";
import TrainSVG from "../svg/TrainSVG";
import BigButton from "../ui/BigButton";
import ProgressDots from "../ui/ProgressDots";
import PartGetBanner from "../ui/PartGetBanner";
import RapidTapGame from "../games/RapidTapGame";
import SwipeGame from "../games/SwipeGame";
import HoldGame from "../games/HoldGame";

const CollectScreen = ({ train, settings, onRun, onBack }) => {
  const steps = useMemo(() => {
    let s = getSteps(settings.stepCount);
    if (train.kind === "steam") s = s.filter((st) => st.partName !== "パンタグラフ");
    return s;
  }, [settings.stepCount, train.kind]);

  const [step, setStep] = useState(0);
  const [parts, setParts] = useState([]);
  const [animating, setAnimating] = useState(null);
  const [animProgress, setAnimProgress] = useState(0);
  const [showBanner, setShowBanner] = useState(null);
  const [shakeY, setShakeY] = useState(0);
  const [isBuild, setIsBuild] = useState(false);
  const [buttonLocked, setButtonLocked] = useState(false);
  const animRef = useRef(null);
  const stepRef = useRef(step);
  stepRef.current = step;
  // Ref for buttonLocked to avoid stale closure in setTimeout
  const buttonLockedRef = useRef(false);
  const setBL = (v) => { setButtonLocked(v); buttonLockedRef.current = v; };
  const cs = steps[step];

  const startAnim = useCallback((pn) => {
    setAnimating(pn);
    setAnimProgress(0);
    setBL(true);
    const dur2 = pn === "ボディ" ? 700 : 500;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur2, 1);
      setAnimProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setShakeY(-5);
        setTimeout(() => { setShakeY(3); }, 80);
        setTimeout(() => { setShakeY(-1); }, 150);
        setTimeout(() => { setShakeY(0); }, 220);
        setTimeout(() => {
          setAnimating(null);
          setAnimProgress(0);
          setShowBanner(steps[stepRef.current].partLabel);
          SFX.partGet();
        }, 350);
      }
    };
    animRef.current = requestAnimationFrame(tick);
  }, [steps]);

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  const handleStep = useCallback(() => {
    if (buttonLockedRef.current) return;
    setParts((p) => [...p, cs.partName]);
    startAnim(cs.partName);
  }, [cs, startAnim]);

  const handleBannerDone = useCallback(() => {
    setShowBanner(null);
    setBL(false);
    if (step < steps.length - 1) setStep((s) => s + 1);
    else setIsBuild(true);
  }, [step, steps.length]);

  const bgG = isBuild
    ? "linear-gradient(180deg,#E8F4FD,#D0E8FA,#fff)"
    : `linear-gradient(180deg,${cs.bgGrad[0]},${cs.bgGrad[1]},#fff)`;

  const handleMiniComplete = useCallback(() => {
    setTimeout(() => {
      if (buttonLockedRef.current) return;
      setParts((p) => [...p, steps[stepRef.current].partName]);
      startAnim(steps[stepRef.current].partName);
    }, 400);
  }, [startAnim, steps]);

  const renderInteraction = () => {
    if (showBanner) return <PartGetBanner label={showBanner} visible onDone={handleBannerDone} />;
    if (isBuild) return (
      <div style={{ animation: "slideUp 0.4s ease", textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>{`🎉${train.kind === "steam" ? "🚂" : "🚄"}🎉`}</div>
        <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#2B6CB0", letterSpacing: 2, margin: "8px 0 4px" }}>パーツが ぜんぶ そろったよ！</div>
        <div style={{ fontSize: "1.05rem", color: "#666", marginBottom: 14 }}>{train.name}を はしらせよう！</div>
        <BigButton onClick={onRun} label="しゅっぱつ しんこう！" emoji={train.kind === "steam" ? "🚂" : "🚄"} color="#E5253C" pulse />
      </div>
    );
    const itype = cs.interact || "tap";
    if (itype === "rapid") return <RapidTapGame key={step} goal={cs.goal || 6} color={cs.btnColor} emoji={cs.emoji} onComplete={handleMiniComplete} disabled={buttonLocked} />;
    if (itype === "swipe") return <SwipeGame key={step} color={cs.btnColor} emoji={cs.emoji} onComplete={handleMiniComplete} disabled={buttonLocked} />;
    if (itype === "hold") return <HoldGame key={step} holdMs={cs.holdMs || 1200} color={cs.btnColor} emoji={cs.emoji} onComplete={handleMiniComplete} disabled={buttonLocked} />;
    // default tap
    return (
      <div style={{ animation: "slideUp 0.4s ease", textAlign: "center" }} key={step}>
        <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 2, marginBottom: 4 }}>{cs.instruction}</div>
        <div style={{ fontSize: "0.95rem", color: "#888", marginBottom: 14 }}>{cs.hint || "ボタンをおして パーツをゲット！"}</div>
        <BigButton onClick={handleStep} label={cs.label} emoji={cs.emoji} color={cs.btnColor} pulse disabled={buttonLocked} />
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100dvh", background: bgG, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Zen Maru Gothic', sans-serif", padding: "20px 16px", transition: "background 0.6s ease", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <button onClick={onBack} style={{ background: "rgba(0,0,0,0.06)", border: "none", borderRadius: 12, padding: "6px 12px", cursor: "pointer", fontSize: "0.85rem", fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, color: "#999" }}>← もどる</button>
        <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 2 }}>{train.kind === "steam" ? "🚂" : "🚄"} {train.name}</div>
      </div>
      <ProgressDots total={steps.length} current={step + (isBuild ? 1 : 0)} />
      <div style={{
        width: "100%", maxWidth: 480, margin: "4px 0",
        transform: `translateY(${shakeY}px)`,
        transition: shakeY === 0 ? "transform 0.1s ease-out" : "none",
        animation: isBuild && !showBanner ? "float 2s ease-in-out infinite" : "none",
      }}>
        <TrainSVG train={train} parts={parts} animating={animating} animProgress={animProgress} stepCount={settings.stepCount} />
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", margin: "6px 0" }}>
        {steps.map((s) => (
          <div key={s.id} style={{
            padding: "5px 12px", borderRadius: 14,
            background: parts.includes(s.partName) ? "linear-gradient(135deg,#FFE066,#FF9F43)" : "rgba(0,0,0,0.05)",
            color: parts.includes(s.partName) ? "#7B3F00" : "#bbb",
            fontSize: "0.8rem", fontWeight: 700, transition: "all 0.4s",
          }}>{parts.includes(s.partName) ? `✓ ${s.partName}` : `? ${s.partName}`}</div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 8 }}>
        {renderInteraction()}
      </div>
    </div>
  );
};

export default CollectScreen;
