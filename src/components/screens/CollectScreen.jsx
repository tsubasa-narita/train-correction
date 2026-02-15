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
import { FONT, COLORS, FONT_SIZE, SPACE, RADIUS } from "../../data/tokens";

/* Part-type emoji map for chips */
const PART_ICONS = {
  "しゃりん": "🔧",
  "せんろ": "🛤️",
  "ボディ": "🚃",
  "まど": "🪟",
  "ドア": "🚪",
  "やね": "🏗️",
  "パンタグラフ": "⚡",
};

const CollectScreen = ({ train, settings, onReveal, onBack }) => {
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
        <div style={{
          fontSize: "2.8rem",
          animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))",
        }}>🎉❓🎉</div>
        <div style={{
          fontSize: "1.5rem", fontWeight: 900, color: "#2B6CB0",
          letterSpacing: 2, margin: `${SPACE.sm}px 0 ${SPACE.xs}px`,
          textShadow: "0 1px 4px rgba(43,108,176,0.15)",
        }}>パーツが ぜんぶ そろったよ！</div>
        <div style={{
          fontSize: "1.05rem", color: "#666",
          marginBottom: SPACE.lg,
          textShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}>どんな でんしゃが できたかな？</div>
        <BigButton onClick={onReveal} label="でんしゃの しょうたいは…？" emoji="❓" color="#9B59B6" pulse />
      </div>
    );
    const itype = cs.interact || "tap";
    if (itype === "rapid") return <RapidTapGame key={step} goal={cs.goal || 6} color={cs.btnColor} emoji={cs.emoji} onComplete={handleMiniComplete} disabled={buttonLocked} />;
    if (itype === "swipe") return <SwipeGame key={step} color={cs.btnColor} emoji={cs.emoji} onComplete={handleMiniComplete} disabled={buttonLocked} />;
    if (itype === "hold") return <HoldGame key={step} holdMs={cs.holdMs || 1200} color={cs.btnColor} emoji={cs.emoji} onComplete={handleMiniComplete} disabled={buttonLocked} />;
    // default tap
    return (
      <div style={{ animation: "slideUp 0.4s ease", textAlign: "center" }} key={step}>
        <div style={{
          fontSize: FONT_SIZE.lg, fontWeight: 900, color: COLORS.textBrown,
          letterSpacing: 2, marginBottom: SPACE.xs,
          textShadow: "0 1px 3px rgba(91,58,26,0.1)",
        }}>{cs.instruction}</div>
        <div style={{
          fontSize: "0.95rem", color: "#888",
          marginBottom: SPACE.lg,
        }}>{cs.hint || "ボタンをおして パーツをゲット！"}</div>
        <BigButton onClick={handleStep} label={cs.label} emoji={cs.emoji} color={cs.btnColor} pulse disabled={buttonLocked} />
      </div>
    );
  };

  return (
    <div style={{
      minHeight: "100dvh", background: bgG,
      display: "flex", flexDirection: "column", alignItems: "center",
      fontFamily: FONT, padding: `${SPACE.xl}px ${SPACE.lg}px`,
      transition: "background 0.6s ease", position: "relative", overflow: "hidden",
    }}>
      {/* Header: back button + title */}
      <div style={{ display: "flex", alignItems: "center", gap: SPACE.sm, marginBottom: 2 }}>
        <button onClick={onBack} style={{
          background: "rgba(0,0,0,0.05)",
          backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
          border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: RADIUS.pill,
          padding: `${SPACE.xs + 2}px ${SPACE.lg}px`,
          cursor: "pointer", fontSize: FONT_SIZE.sm,
          fontFamily: FONT, fontWeight: 700, color: "#999",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          transition: "background 0.2s ease",
        }}>← もどる</button>
        <div style={{
          fontSize: "1.1rem", fontWeight: 900, color: COLORS.textBrown,
          letterSpacing: 2,
          textShadow: "0 1px 3px rgba(91,58,26,0.08)",
          display: "flex", alignItems: "center", gap: SPACE.xs,
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 26, height: 26, borderRadius: RADIUS.pill,
            background: "linear-gradient(135deg, #7B68EE, #6A5ACD)",
            fontSize: "0.75rem", color: COLORS.white,
            boxShadow: "0 2px 6px rgba(123,104,238,0.3)",
          }}>？</span>
          ナゾの でんしゃ
        </div>
      </div>

      <ProgressDots total={steps.length} current={step + (isBuild ? 1 : 0)} />

      {/* Train SVG area with workshop frame */}
      <div style={{
        width: "100%", maxWidth: 480, margin: `${SPACE.xs}px 0`,
        padding: SPACE.sm,
        borderRadius: RADIUS.lg,
        border: "2px dashed rgba(0,0,0,0.08)",
        background: isBuild ? "rgba(232,244,253,0.5)" : "rgba(255,255,255,0.3)",
        boxShadow: isBuild
          ? "0 0 20px rgba(43,108,176,0.1), inset 0 0 20px rgba(255,255,255,0.5)"
          : "inset 0 0 16px rgba(255,255,255,0.3)",
        transition: "all 0.6s ease",
        position: "relative",
      }}>
        <div style={{
          transform: `translateY(${shakeY}px)`,
          transition: shakeY === 0 ? "transform 0.1s ease-out" : "none",
          animation: isBuild && !showBanner ? "float 2s ease-in-out infinite" : "none",
        }}>
          <TrainSVG train={train} parts={parts} animating={animating} animProgress={animProgress} stepCount={settings.stepCount} mystery />
        </div>
      </div>

      {/* Part chips with icons */}
      <div style={{
        display: "flex", gap: SPACE.xs + 2, flexWrap: "wrap",
        justifyContent: "center", margin: `${SPACE.xs + 2}px 0`,
      }}>
        {steps.map((s) => {
          const done = parts.includes(s.partName);
          const icon = PART_ICONS[s.partName] || "🔩";
          return (
            <div key={s.id} style={{
              padding: `${SPACE.xs + 1}px ${SPACE.md}px`,
              borderRadius: RADIUS.lg,
              background: done
                ? `linear-gradient(135deg,${COLORS.gold},#FF9F43)`
                : "rgba(0,0,0,0.04)",
              color: done ? "#7B3F00" : "#bbb",
              fontSize: FONT_SIZE.sm, fontWeight: 700,
              transition: "all 0.4s ease",
              boxShadow: done
                ? "0 2px 8px rgba(255,224,102,0.35), inset 0 1px 0 rgba(255,255,255,0.3)"
                : "none",
              display: "flex", alignItems: "center", gap: SPACE.xs,
              border: done ? "1px solid rgba(255,159,67,0.3)" : "1px solid transparent",
            }}>
              <span style={{ fontSize: "0.75rem" }}>{done ? icon : "?"}</span>
              {s.partName}
              {done && <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>✓</span>}
            </div>
          );
        })}
      </div>

      {/* Interaction area */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: SPACE.lg, marginTop: SPACE.sm,
      }}>
        {renderInteraction()}
      </div>
    </div>
  );
};

export default CollectScreen;
