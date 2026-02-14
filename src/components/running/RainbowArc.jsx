const RainbowArc = ({ visible }) => {
  if (!visible) return null;
  const colors = ["#FF0000", "#FF8800", "#FFFF00", "#00CC00", "#0088FF", "#4400CC", "#8800AA"];
  return (
    <div style={{
      position: "absolute", top: "-10%", left: "20%", width: "60%",
      zIndex: 3, pointerEvents: "none", opacity: 0.35, animation: "fadeIn 2s ease",
    }}>
      <svg viewBox="0 0 200 110" style={{ width: "100%" }}>
        {colors.map((c, i) => (
          <path key={i} d={`M ${10 + i * 2},110 A ${90 - i * 3},${90 - i * 3} 0 0 1 ${190 - i * 2},110`} fill="none" stroke={c} strokeWidth={3} opacity={0.7} />
        ))}
      </svg>
    </div>
  );
};

export default RainbowArc;
