const RunFuji = ({ visible, opacity }) => {
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", right: "8%", top: "12%", zIndex: 6, pointerEvents: "none", opacity }}>
      <svg width={110} height={85} viewBox="0 0 120 90">
        <polygon points="60,5 110,85 10,85" fill="#6677AA" opacity={0.7} />
        <polygon points="60,5 80,35 40,35" fill="white" opacity={0.8} />
      </svg>
      <div style={{
        textAlign: "center", fontSize: "0.75rem", fontWeight: 900,
        color: "#5B6BAA", fontFamily: "'Zen Maru Gothic', sans-serif", marginTop: -6,
      }}>ふじさん！🗻</div>
    </div>
  );
};

export default RunFuji;
