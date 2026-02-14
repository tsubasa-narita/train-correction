import { useEffect } from "react";
import ParticleBurst from "./ParticleBurst";

const PartGetBanner = ({ label, visible, onDone }) => {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onDone, 1800);
      return () => { clearTimeout(t); };
    }
  }, [visible, onDone]);

  if (!visible) return null;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      animation: "bannerPop 0.5s cubic-bezier(0.34,1.56,0.64,1)", position: "relative",
    }}>
      <ParticleBurst />
      <div style={{
        background: "linear-gradient(145deg,#FFE066,#FFB347)", borderRadius: 24,
        padding: "16px 36px", textAlign: "center", boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
      }}>
        <div style={{ fontSize: "2rem", marginBottom: 2 }}>✨🎉✨</div>
        <div style={{
          fontSize: "1.4rem", fontWeight: 900, color: "#7B3F00",
          letterSpacing: 3, fontFamily: "'Zen Maru Gothic', sans-serif",
        }}>{label}</div>
      </div>
    </div>
  );
};

export default PartGetBanner;
