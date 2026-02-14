const RunStationSign = ({ visible, name }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)",
      zIndex: 25, pointerEvents: "none", fontFamily: "'Zen Maru Gothic', sans-serif",
      animation: "stationPass 3s ease-in-out forwards",
    }}>
      <div style={{
        background: "#fff", border: "3px solid #333", borderRadius: 10,
        padding: "8px 24px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", textAlign: "center",
      }}>
        <div style={{ fontSize: "0.55rem", color: "#aaa", letterSpacing: 1 }}>つうか</div>
        <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#333", letterSpacing: 3 }}>{name}</div>
      </div>
    </div>
  );
};

export default RunStationSign;
