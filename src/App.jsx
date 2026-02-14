import { useState } from "react";
import { TRAINS } from "./data/trains";
import { DEFAULT_SETTINGS } from "./data/gameSteps";
import { SFX } from "./systems/sound";
import { saveStamp } from "./systems/stamps";
import DepotSelector from "./components/screens/DepotSelector";
import CouplingDialog from "./components/screens/CouplingDialog";
import CollectScreen from "./components/screens/CollectScreen";
import DepartureScreen from "./components/screens/DepartureScreen";
import RunningScreen from "./components/screens/RunningScreen";
import ArrivalSequence from "./components/screens/ArrivalSequence";
import RewardScreen from "./components/screens/RewardScreen";
import StampCard from "./components/screens/StampCard";
import SettingsModal from "./components/screens/SettingsModal";

// ============ Main App ============
export default function OuchiTrainApp() {
  const [train, setTrain] = useState(null);
  const [phase, setPhase] = useState("select");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [coupled, setCoupled] = useState(false);
  const [coupledTrain, setCoupledTrain] = useState(null);

  const handleSelect = (t) => {
    setTrain(t);
    if (t.coupleWith) setPhase("askCouple");
    else { setCoupled(false); setCoupledTrain(null); setPhase("collect"); }
  };

  const handleCouple = (yes) => {
    if (yes) { setCoupled(true); setCoupledTrain(TRAINS.find((t2) => t2.id === train.coupleWith)); }
    else { setCoupled(false); setCoupledTrain(null); }
    setPhase("collect");
  };

  const handleReset = () => { setTrain(null); setCoupled(false); setCoupledTrain(null); setPhase("select"); };

  const handleReward = () => {
    if (train) saveStamp(train.id, () => { SFX.stamp(); });
    setPhase("reward");
  };

  return (
    <div>
      <style>{[
        "@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700;900&display=swap');",
        "*{box-sizing:border-box;margin:0;padding:0;}",
        "@keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}",
        "@keyframes popIn{0%{transform:scale(0.3);opacity:0;}100%{transform:scale(1);opacity:1;}}",
        "@keyframes fadeIn{0%{opacity:0;}100%{opacity:1;}}",
        "@keyframes slideUp{0%{transform:translateY(30px);opacity:0;}100%{transform:translateY(0);opacity:1;}}",
        "@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}",
        "@keyframes particleBurst{0%{transform:translateY(-10px) scale(0);opacity:1;}100%{transform:translateY(-90px) scale(1);opacity:0;}}",
        "@keyframes bannerPop{0%{transform:scale(0) translateY(20px);opacity:0;}100%{transform:scale(1) translateY(0);opacity:1;}}",
        "@keyframes speedLine{0%{transform:translateX(0);opacity:0;}20%{opacity:0.6;}100%{transform:translateX(-500px);opacity:0;}}",
        "@keyframes onomatFloat{0%{transform:translateY(0) scale(0.7);opacity:0;}15%{transform:translateY(-10px) scale(1.1);opacity:0.6;}50%{opacity:0.4;}100%{transform:translateY(-60px) scale(0.8);opacity:0;}}",
        "@keyframes kankankan{0%{transform:translateX(-3px);}100%{transform:translateX(3px);}}",
        "@keyframes stationPass{0%{opacity:0;transform:translateX(-50%) translateY(20px);}10%{opacity:1;transform:translateX(-50%) translateY(0);}80%{opacity:1;}100%{opacity:0;transform:translateX(-50%) translateY(-20px);}}",
        "@keyframes snowfall{0%{transform:translateY(-20px) rotate(0deg);opacity:0;}10%{opacity:1;}90%{opacity:0.8;}100%{transform:translateY(100vh) rotate(360deg);opacity:0;}}",
        "@keyframes passingTrain{0%{transform:translateX(120vw);}100%{transform:translateX(-120vw);}}",
        "@keyframes bellSwing{0%{transform:rotate(-15deg);}100%{transform:rotate(15deg);}}",
        "@keyframes twinkle{0%{opacity:0.2;}100%{opacity:1;}}",
        "@keyframes rainfall{0%{transform:translateY(-20px) rotate(12deg);opacity:0;}10%{opacity:0.6;}90%{opacity:0.4;}100%{transform:translateY(100vh) rotate(12deg);opacity:0;}}",
        "@keyframes puddleRipple{0%,100%{transform:scaleX(1);opacity:0.15;}50%{transform:scaleX(1.3);opacity:0.25;}}",
        "@keyframes holdPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}",
        "@keyframes slideInRight{0%{transform:translateX(100%);}100%{transform:translateX(0);}}",
        "@keyframes coupleSlideRight{0%{transform:translateX(-40px);}100%{transform:translateX(calc(50% - 10px));}}",
        "@keyframes coupleSlideLeft{0%{transform:translateX(40px);}100%{transform:translateX(calc(-50% + 10px));}}",
        "@keyframes coupleFlash{0%{transform:translate(-50%,-50%) scale(1);opacity:1;}100%{transform:translate(-50%,-50%) scale(3);opacity:0;}}",
      ].join("\n")}</style>
      {phase === "select" && <DepotSelector onSelect={handleSelect} onOpenSettings={() => { setShowSettings(true); }} onStamps={() => { setPhase("stamps"); }} />}
      {phase === "stamps" && <StampCard onBack={() => { setPhase("select"); }} />}
      {phase === "askCouple" && train && <CouplingDialog train={train} onYes={() => { handleCouple(true); }} onNo={() => { handleCouple(false); }} />}
      {phase === "collect" && train && <CollectScreen train={train} settings={settings} onRun={() => { setPhase("depart"); }} onBack={handleReset} />}
      {phase === "depart" && train && <DepartureScreen train={train} coupled={coupled} coupledTrain={coupledTrain} onDepart={() => { setPhase("run"); }} />}
      {phase === "run" && train && <RunningScreen train={train} settings={settings} coupled={coupled} coupledTrain={coupledTrain} onGoReward={() => { setPhase("arrive"); }} />}
      {phase === "arrive" && train && <ArrivalSequence stationName={settings.stationName} train={train} onGoReward={handleReward} />}
      {phase === "reward" && train && <RewardScreen trainName={train.name} onReset={handleReset} />}
      {showSettings && <SettingsModal settings={settings} onChange={setSettings} onClose={() => { setShowSettings(false); }} />}
    </div>
  );
}
