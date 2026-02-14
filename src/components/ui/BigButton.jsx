const BigButton = ({ onClick, label, emoji, color, pulse, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 6, width: "min(300px,82vw)", padding: "22px 20px", border: "none", borderRadius: 28,
    background: disabled ? "#ccc" : `linear-gradient(145deg,${color},${color}cc)`,
    color: "#fff", fontSize: "1.5rem", fontWeight: 800,
    cursor: disabled ? "default" : "pointer",
    boxShadow: disabled ? "none" : `0 8px 0 ${color}88, 0 12px 24px rgba(0,0,0,0.18)`,
    fontFamily: "'Zen Maru Gothic', sans-serif", letterSpacing: 2,
    animation: pulse && !disabled ? "pulse 1.5s infinite" : "none",
    WebkitTapHighlightColor: "transparent", userSelect: "none",
  }}>
    <span style={{ fontSize: "2.5rem", lineHeight: 1 }}>{emoji}</span>
    <span>{label}</span>
  </button>
);

export default BigButton;
