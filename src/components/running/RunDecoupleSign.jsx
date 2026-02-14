const RunDecoupleSign = ({ visible, partnerName }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)",
      zIndex: 30, pointerEvents: "none", fontFamily: "'Zen Maru Gothic', sans-serif",
      animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <div style={{
        background: "linear-gradient(145deg,#FFE066,#FFB347)", border: "3px solid #cc8030",
        borderRadius: 14, padding: "10px 28px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", textAlign: "center",
      }}>
        <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#7B3F00", letterSpacing: 3 }}>🔓 きりはなし！</div>
        <div style={{ fontSize: "0.8rem", color: "#996622", marginTop: 2 }}>{partnerName}と おわかれ</div>
      </div>
    </div>
  );
};

export default RunDecoupleSign;
