// /home/user/train-correction/src/components/running/RunStationSign.jsx
const RunStationSign = ({ visible, name }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)",
      zIndex: 25, pointerEvents: "none", fontFamily: "'Zen Maru Gothic', sans-serif",
      animation: "stationPass 3s ease-in-out forwards",
    }}>
      {/* JR-style station sign */}
      <div style={{
        background: "#fff",
        border: "2px solid #666",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.15)",
        minWidth: 160,
      }}>
        {/* Green header bar */}
        <div style={{
          background: "linear-gradient(180deg, #2E8B57 0%, #228B46 100%)",
          height: 10,
          borderBottom: "1px solid #1E6B3A",
        }} />

        {/* Content area */}
        <div style={{
          padding: "6px 24px 8px",
          textAlign: "center",
          position: "relative",
        }}>
          {/* Small label */}
          <div style={{
            fontSize: "0.5rem", color: "#999", letterSpacing: 1,
            marginBottom: 2,
          }}>つうか</div>

          {/* Station name in large text */}
          <div style={{
            fontSize: "1.3rem", fontWeight: 900, color: "#222",
            letterSpacing: 4,
            lineHeight: 1.2,
          }}>{name}</div>

          {/* Small decorative line below name */}
          <div style={{
            width: 30, height: 2,
            background: "#2E8B57",
            borderRadius: 1,
            margin: "4px auto 0",
          }} />
        </div>

        {/* Green footer bar */}
        <div style={{
          background: "linear-gradient(180deg, #228B46 0%, #2E8B57 100%)",
          height: 6,
          borderTop: "1px solid #1E6B3A",
        }} />
      </div>
    </div>
  );
};

export default RunStationSign;
