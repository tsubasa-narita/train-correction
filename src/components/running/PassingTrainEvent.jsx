// /home/user/train-correction/src/components/running/PassingTrainEvent.jsx
import { TRAINS } from "../../data/trains";
import RunTrainSVG from "../svg/RunTrainSVG";

const PassingTrainEvent = ({ visible, currentId }) => {
  if (!visible) return null;
  const others = TRAINS.filter((t) => t.id !== currentId && t.kind === "shinkansen");
  const other = others[Math.floor(Date.now() / 100000) % others.length];

  return (
    <>
      {/* Inline styles for passing train effects */}
      <style>{`
        @keyframes passingTrainFast {
          0% { transform: translateX(120vw); }
          100% { transform: translateX(-120vw); }
        }
        @keyframes screenShake {
          0%, 100% { transform: translateX(0) translateY(0); }
          10% { transform: translateX(-2px) translateY(1px); }
          20% { transform: translateX(3px) translateY(-1px); }
          30% { transform: translateX(-3px) translateY(0px); }
          40% { transform: translateX(2px) translateY(1px); }
          50% { transform: translateX(-1px) translateY(-1px); }
          60% { transform: translateX(2px) translateY(0px); }
          70% { transform: translateX(-2px) translateY(1px); }
          80% { transform: translateX(1px) translateY(-1px); }
          90% { transform: translateX(-1px) translateY(0px); }
        }
        @keyframes shadowArrive {
          0% { opacity: 0; transform: translateX(100vw) scaleX(1.5); }
          30% { opacity: 0.3; }
          60% { opacity: 0.15; }
          100% { opacity: 0; transform: translateX(-100vw) scaleX(1.5); }
        }
        @keyframes windGust {
          0% { opacity: 0; transform: translateX(30px); }
          20% { opacity: 0.5; }
          100% { opacity: 0; transform: translateX(-80px); }
        }
      `}</style>

      {/* Screen shake overlay (wind effect) */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 14, pointerEvents: "none",
        animation: "screenShake 0.15s ease 0.4s 6",
      }} />

      {/* Shadow that arrives first - dark strip on the ground */}
      <div style={{
        position: "absolute",
        bottom: "14%",
        left: 0,
        width: "60vw",
        height: 12,
        background: "linear-gradient(to right, transparent, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.15) 70%, transparent)",
        borderRadius: "50%",
        zIndex: 14,
        animation: "shadowArrive 1.2s linear forwards",
        pointerEvents: "none",
      }} />

      {/* Wind lines that appear during passing */}
      <div style={{ position: "absolute", inset: 0, zIndex: 16, pointerEvents: "none", overflow: "hidden" }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            position: "absolute",
            right: "30%",
            top: `${25 + i * 10}%`,
            width: 40 + i * 8,
            height: 2,
            background: `rgba(200,220,255,${0.3 + i * 0.05})`,
            borderRadius: 2,
            animation: `windGust 0.4s ${0.5 + i * 0.08}s ease-out forwards`,
          }} />
        ))}
      </div>

      {/* The passing train itself */}
      <div style={{
        position: "absolute", bottom: "18%", right: 0, width: "min(45vw,260px)",
        zIndex: 15, pointerEvents: "none",
        animation: "passingTrainFast 1.2s linear forwards",
        transform: "perspective(800px) rotateY(8deg) rotateX(2deg)",
        transformOrigin: "center bottom",
        filter: "drop-shadow(-4px 8px 6px rgba(0,0,0,0.25)) blur(0.5px)",
      }}>
        <RunTrainSVG train={other} flip hideTrack />
      </div>
    </>
  );
};

export default PassingTrainEvent;
