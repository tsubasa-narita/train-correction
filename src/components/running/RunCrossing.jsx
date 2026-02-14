const RunCrossing = ({ visible, crossingX }) => {
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", left: `${50 + crossingX * 0.15}%`, bottom: "25%", zIndex: 18, pointerEvents: "none", transform: "translateX(-50%)" }}>
      <svg width={50} height={85} viewBox="0 0 50 85">
        <rect x={22} y={0} width={5} height={85} rx={2} fill="#333" />
        <rect x={4} y={7} width={42} height={7} rx={3} fill="#FFD814" stroke="#333" strokeWidth={0.8} />
        <circle cx={24} cy={24} r={5} fill="#E74C3C"><animate attributeName="opacity" values="1;0.2;1" dur="0.6s" repeatCount="indefinite" /></circle>
      </svg>
      <div style={{
        fontSize: "0.85rem", fontWeight: 900, color: "#E74C3C",
        fontFamily: "'Zen Maru Gothic', sans-serif", letterSpacing: 3,
        textAlign: "center", animation: "kankankan 0.3s ease infinite alternate", marginTop: -4,
      }}>カンカン</div>
    </div>
  );
};

export default RunCrossing;
