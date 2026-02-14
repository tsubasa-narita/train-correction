import { TRAINS } from "../../data/trains";
import RunTrainSVG from "../svg/RunTrainSVG";

const PassingTrainEvent = ({ visible, currentId }) => {
  if (!visible) return null;
  const others = TRAINS.filter((t) => t.id !== currentId && t.kind === "shinkansen");
  const other = others[Math.floor(Date.now() / 100000) % others.length];
  return (
    <div style={{
      position: "absolute", bottom: "18%", right: 0, width: "min(45vw,260px)",
      zIndex: 15, animation: "passingTrain 1.8s linear forwards", pointerEvents: "none",
      transform: "perspective(800px) rotateY(8deg) rotateX(2deg)",
      transformOrigin: "center bottom", filter: "drop-shadow(-4px 8px 6px rgba(0,0,0,0.2))",
    }}>
      <RunTrainSVG train={other} flip hideTrack />
    </div>
  );
};

export default PassingTrainEvent;
