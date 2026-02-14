import { useState, useEffect, useRef, useMemo } from "react";
import { SFX } from "../../systems/sound";
import { getTimeOfDay, getWeather } from "../../systems/environment";
import { SKY_COLORS } from "../../data/colors";
import { STATION_NAMES } from "../../data/gameSteps";
import { easeProgress } from "../../utils/easing";
import ParallaxBg from "../running/ParallaxBg";
import RunTrainSVG from "../svg/RunTrainSVG";
import RunSpeedLines from "../running/RunSpeedLines";
import RunOnomatopoeia from "../running/RunOnomatopoeia";
import RunSeasonalParticles from "../running/RunSeasonalParticles";
import RunCrossing from "../running/RunCrossing";
import RunStationSign from "../running/RunStationSign";
import RunFuji from "../running/RunFuji";
import PassingTrainEvent from "../running/PassingTrainEvent";
import RunDecoupleSign from "../running/RunDecoupleSign";
import RunTunnel from "../running/RunTunnel";
import RainEffect from "../running/RainEffect";
import RainbowArc from "../running/RainbowArc";

const RunningScreen = ({ train, settings, coupled, coupledTrain, onGoReward }) => {
  const dur = settings.runDuration;
  const totalDist = 4000;
  const [dist, setDist] = useState(0);
  const [arrived, setArrived] = useState(false);
  const [decoupled, setDecoupled] = useState(false);
  const decoupledRef = useRef(false);
  const [rearLag, setRearLag] = useState(0);
  const [tunnelPhase, setTunnelPhase] = useState(null);
  const [showPassing, setShowPassing] = useState(false);
  const [season] = useState(() => ["sakura", "snow", null, null][Math.floor(Math.random() * 4)]);
  const [tod] = useState(getTimeOfDay);
  const [weather] = useState(() => season === "snow" ? "clear" : getWeather());
  const animRef = useRef();
  const startRef = useRef(0);
  const sfxFlags = useRef({ crossing: false, tunnel: false, passing: false, decouple: false, arrival: false });
  const lastGatan = useRef(0);
  const rndStation = useMemo(() => STATION_NAMES[Math.floor(Math.random() * STATION_NAMES.length)], []);
  const hasFuji = useMemo(() => Math.random() > 0.4, []);
  const hasPassing = useMemo(() => Math.random() > 0.3, []);
  const decoupleAt = 0.62, crossingAt = 0.18, stationAt = 0.30, fujiStart = 0.40, fujiEnd = 0.55, passingAt = 0.50, tunnelStart = 0.68, tunnelEnd = 0.78;

  useEffect(() => {
    startRef.current = performance.now();
    const totalMs = dur * 1000;
    const doTick = (now) => {
      const elapsed = now - startRef.current;
      const rawP = Math.min(elapsed / totalMs, 1);
      const p = easeProgress(rawP);
      setDist(p * totalDist);
      if (p >= tunnelStart && p < tunnelStart + 0.02) setTunnelPhase("enter");
      else if (p >= tunnelStart + 0.02 && p < tunnelEnd - 0.02) setTunnelPhase("inside");
      else if (p >= tunnelEnd - 0.02 && p < tunnelEnd) setTunnelPhase("exit");
      else if (p >= tunnelEnd) setTunnelPhase(null);
      if (hasPassing && p >= passingAt && p < passingAt + 0.04) setShowPassing(true);
      else if (p >= passingAt + 0.06) setShowPassing(false);
      if (coupled && p >= decoupleAt && !decoupledRef.current) { setDecoupled(true); decoupledRef.current = true; }
      if (decoupledRef.current) setRearLag((prev) => Math.min(prev + 2.5, 400));
      // Sound triggers
      const sf = sfxFlags.current;
      if (p >= crossingAt - 0.02 && p < crossingAt + 0.04 && !sf.crossing) { sf.crossing = true; SFX.crossing(); }
      if (p >= tunnelStart && p < tunnelStart + 0.02 && !sf.tunnel) { sf.tunnel = true; SFX.tunnel(); }
      if (hasPassing && p >= passingAt && p < passingAt + 0.02 && !sf.passing) { sf.passing = true; SFX.horn(); }
      if (coupled && p >= decoupleAt && !sf.decouple) { sf.decouple = true; SFX.couple(); }
      // No gatangoton inside tunnel
      if (p > 0.08 && p < 0.88 && !(p >= tunnelStart && p < tunnelEnd) && now - lastGatan.current > 1200) { lastGatan.current = now; SFX.gatangoton(); }
      if (rawP < 1) animRef.current = requestAnimationFrame(doTick);
      else { setArrived(true); if (!sf.arrival) { sf.arrival = true; SFX.arrival(); } }
    };
    animRef.current = requestAnimationFrame(doTick);
    return () => { cancelAnimationFrame(animRef.current); };
  }, [dur, coupled]);

  const progress = dist / totalDist;
  const crossingScreenX = (crossingAt - progress) * totalDist * 0.5;
  const showCrossing = Math.abs(crossingScreenX) < 300;
  const showStationSign = Math.abs((stationAt - progress) * totalDist * 0.5) < 250;
  const showFuji = hasFuji && progress >= fujiStart - 0.05 && progress <= fujiEnd + 0.05;
  const fujiOpacity = Math.min(1, (progress - fujiStart + 0.05) * 10) * Math.min(1, (fujiEnd + 0.05 - progress) * 10);
  const speed = progress < 0.08 ? progress / 0.08 : progress > 0.88 ? (1 - progress) / 0.12 : 1;
  const bounceY = speed > 0.3 ? Math.sin(dist * 0.05) * 1.5 : 0;
  const showDecoupleSign = coupled && progress >= decoupleAt - 0.03 && progress < decoupleAt + 0.08;
  const partnerName = coupledTrain ? coupledTrain.name : "";
  const skyC = season === "snow" ? SKY_COLORS.day : (weather === "rain" || weather === "rainbow") ? { top: "#8899AA", mid: "#A0AABB", low: "#C0C8D0", ground: "#D0D0D0" } : SKY_COLORS[tod];
  const bgColor = `linear-gradient(180deg,${skyC.top} 0%,${skyC.mid} 40%,${skyC.low} 65%,${skyC.ground} 100%)`;
  const rearOp = decoupled ? Math.max(0, 1 - rearLag / 200) : 1;
  const rearTx = decoupled ? -rearLag : 0;
  const trainIcon = train.kind === "steam" ? "🚂" : "🚄";
  const titleText = `${train.name}${coupled ? ` + ${partnerName}` : ""} しゅっぱつ！`;

  // Auto-advance to arrival sequence
  useEffect(() => {
    if (arrived) {
      const t = setTimeout(onGoReward, 1200);
      return () => { clearTimeout(t); };
    }
  }, [arrived]);

  return (
    <div style={{ minHeight: "100dvh", position: "relative", overflow: "hidden", fontFamily: "'Zen Maru Gothic', sans-serif", background: bgColor }}>
      <ParallaxBg dist={dist} season={season} tod={season === "snow" ? "day" : tod} />
      <RunSeasonalParticles season={season} />
      <RainEffect weather={weather} />
      <RainbowArc visible={weather === "rainbow" && progress > 0.55} />
      <RunSpeedLines speed={speed} />
      <RunOnomatopoeia speed={speed} />
      <RunCrossing visible={showCrossing} crossingX={crossingScreenX} />
      <RunStationSign visible={showStationSign} name={rndStation} />
      <RunFuji visible={showFuji} opacity={fujiOpacity} />
      <PassingTrainEvent visible={showPassing} currentId={train.id} />
      <RunDecoupleSign visible={showDecoupleSign} partnerName={partnerName} />
      <RunTunnel phase={tunnelPhase} />
      {!arrived && (() => {
        const trainPerspective = "perspective(800px) rotateY(-8deg) rotateX(2deg)";
        if (coupled) {
          const coupOffset = decoupled ? rearTx : 0;
          const coupOp = decoupled ? rearOp : 1;
          return (
            <div style={{ position: "absolute", left: "1%", bottom: "14%", width: "min(85vw, 520px)", zIndex: 12, transform: `translateY(${bounceY}px) ${trainPerspective}`, transformOrigin: "center bottom", willChange: "transform", filter: "drop-shadow(4px 8px 6px rgba(0,0,0,0.2))" }}>
              <div style={{ display: "flex", alignItems: "flex-start", marginLeft: 0 }}>
                <div style={{ width: "52%", flexShrink: 0, marginRight: "-12%", opacity: coupOp, transform: `translateX(${coupOffset}px)`, pointerEvents: "none" }}>
                  <RunTrainSVG train={coupledTrain} flip hideTrack />
                </div>
                <div style={{ width: "52%", flexShrink: 0 }}>
                  <RunTrainSVG train={train} hideTrack />
                </div>
              </div>
            </div>
          );
        }
        return (
          <div style={{ position: "absolute", left: "3%", bottom: "14%", width: "min(55vw, 320px)", zIndex: 12, transform: `translateY(${bounceY}px) ${trainPerspective}`, transformOrigin: "center bottom", willChange: "transform", filter: "drop-shadow(4px 8px 6px rgba(0,0,0,0.2))" }}>
            <RunTrainSVG train={train} hideTrack />
          </div>
        );
      })()}
      {!arrived && <div style={{ position: "absolute", top: "3%", left: "50%", transform: "translateX(-50%)", zIndex: 15, textAlign: "center", pointerEvents: "none" }}>
        <div style={{ fontSize: "1.3rem", fontWeight: 900, color: tod === "night" ? "#FFE066" : "#5B3A1A", letterSpacing: 3, fontFamily: "'Zen Maru Gothic', sans-serif", textShadow: tod === "night" ? "0 1px 8px rgba(0,0,0,0.5)" : "0 1px 4px rgba(255,255,255,0.8)", animation: "fadeIn 0.5s ease" }}>
          {trainIcon} {titleText}
        </div>
      </div>}
      {arrived && <div style={{ position: "absolute", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.5s ease" }}><div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.5)", animation: "pulse 1s infinite" }}>もうすぐ とうちゃく…</div></div>}
    </div>
  );
};

export default RunningScreen;
