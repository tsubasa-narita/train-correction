import { useState, useRef } from "react";
import { TRAINS } from "../../data/trains";
import { SFX } from "../../systems/sound";
import DepotTrainSVG from "../svg/DepotTrainSVG";

const F = "'Zen Maru Gothic', sans-serif";

const CouplingDialog = ({ train, onYes, onNo }) => {
  const partner = TRAINS.find((t) => t.id === train.coupleWith);
  if (!partner) return null;

  const [stage, setStage] = useState("ask"); // ask -> approach -> impact -> done
  const [shakeX, setShakeX] = useState(0);
  const sparkRef = useRef([]);

  const handleYes = () => {
    setStage("approach");
    setTimeout(() => {
      setStage("impact");
      SFX.couple();
      setShakeX(-6);
      setTimeout(() => { setShakeX(8); }, 60);
      setTimeout(() => { setShakeX(-4); }, 120);
      setTimeout(() => { setShakeX(3); }, 180);
      setTimeout(() => { setShakeX(0); }, 240);
      const sp = [];
      for (let i = 0; i < 12; i++) {
        sp.push({ x: 50 + ((Math.random() - 0.5) * 20), y: 40 + ((Math.random() - 0.5) * 10), vx: (Math.random() - 0.5) * 8, vy: -Math.random() * 6 - 2, s: 3 + Math.random() * 4 });
      }
      sparkRef.current = sp;
    }, 900);
    setTimeout(() => { setStage("done"); SFX.celebrate(); }, 1600);
    setTimeout(() => { onYes(); }, 2800);
  };

  const sparks = sparkRef.current;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", fontFamily: F, animation: "fadeIn 0.3s ease" }}>
      <div style={{
        background: stage === "done" ? "linear-gradient(145deg,#FFF8E1,#FFE082)" : "#fff",
        borderRadius: 24, padding: "28px 20px", width: "min(360px,90vw)", textAlign: "center",
        boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
        animation: stage === "ask" ? "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" : "none",
        transform: `translateX(${shakeX}px)`, transition: shakeX === 0 ? "transform 0.1s ease" : "none",
      }}>
        {/* Stage: ask */}
        {stage === "ask" && <div>
          <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 2, marginBottom: 16 }}>🔗 れんけつ する？</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 110, height: 40 }}><DepotTrainSVG train={train} /></div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#FF9F43" }}>+</div>
            <div style={{ width: 110, height: 40 }}><DepotTrainSVG train={partner} /></div>
          </div>
          <div style={{ fontSize: "0.9rem", color: "#888", marginBottom: 18, lineHeight: 1.6 }}>{train.name}と {partner.name}を<br />れんけつして はしるよ！</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={handleYes} style={{ padding: "12px 28px", borderRadius: 16, border: "none", background: "linear-gradient(145deg,#FFE066,#FF9F43)", color: "#7B3F00", fontSize: "1.05rem", fontWeight: 800, cursor: "pointer", fontFamily: F, boxShadow: "0 4px 0 #cc8030" }}>れんけつ！</button>
            <button onClick={onNo} style={{ padding: "12px 28px", borderRadius: 16, border: "none", background: "#f0f0f0", color: "#999", fontSize: "1.05rem", fontWeight: 800, cursor: "pointer", fontFamily: F }}>ひとりで</button>
          </div>
        </div>}

        {/* Stage: approach */}
        {stage === "approach" && <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 2, marginBottom: 12 }}>れんけつ ちゅう…</div>
          <div style={{ position: "relative", height: 60, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ position: "absolute", left: 0, top: 8, width: 120, height: 44, animation: "coupleSlideRight 0.8s cubic-bezier(0.4,0,0.2,1) forwards" }}>
              <DepotTrainSVG train={partner} />
            </div>
            <div style={{ position: "absolute", right: 0, top: 8, width: 120, height: 44, animation: "coupleSlideLeft 0.8s cubic-bezier(0.4,0,0.2,1) forwards" }}>
              <DepotTrainSVG train={train} />
            </div>
          </div>
          <div style={{ fontSize: "2rem", animation: "pulse 0.4s infinite" }}>🔧</div>
        </div>}

        {/* Stage: impact / done */}
        {(stage === "impact" || stage === "done") && <div>
          {stage === "impact" && <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#E74C3C", letterSpacing: 3, marginBottom: 8, animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>ガチャン！</div>
            <div style={{ position: "relative", height: 60, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
                <div style={{ width: 120, height: 44 }}><DepotTrainSVG train={partner} /></div>
                <div style={{ width: 120, height: 44 }}><DepotTrainSVG train={train} /></div>
              </div>
              <div style={{ position: "absolute", left: "50%", top: "50%", pointerEvents: "none" }}>
                {sparks.map((sp, i) => (
                  <div key={i} style={{
                    position: "absolute", width: sp.s, height: sp.s,
                    borderRadius: i % 3 === 0 ? "50%" : "2px",
                    background: ["#FFE066", "#FF6B3A", "#66E0FF", "#FFB347"][i % 4],
                    animation: `particleBurst 0.7s ${i * 0.02}s ease-out forwards`,
                    transform: `rotate(${i * 30}deg) translateY(-10px)`, opacity: 0,
                  }} />
                ))}
              </div>
              <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 0 30px 15px rgba(255,255,200,0.8)", animation: "coupleFlash 0.4s ease-out forwards" }} />
            </div>
          </div>}

          {stage === "done" && <div style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#2B6CB0", letterSpacing: 3, marginBottom: 10 }}>🔗 れんけつ かんりょう！</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 10 }}>
              <div style={{ width: 120, height: 44 }}><DepotTrainSVG train={partner} /></div>
              <div style={{ width: 120, height: 44 }}><DepotTrainSVG train={train} /></div>
            </div>
            <div style={{ fontSize: "1rem", color: "#5B3A1A", fontWeight: 700 }}>{partner.name} + {train.name}</div>
            <div style={{ fontSize: "0.85rem", color: "#888", marginTop: 4 }}>いっしょに はしるよ！</div>
            <div style={{ fontSize: "2.5rem", marginTop: 6, animation: "float 1.5s ease-in-out infinite" }}>{train.kind === "steam" ? "🚂🚂" : "🚄🚄"}</div>
          </div>}
        </div>}
      </div>
    </div>
  );
};

export default CouplingDialog;
