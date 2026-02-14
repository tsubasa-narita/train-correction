const RunTunnel = ({ phase }) => {
  if (!phase) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 50,
      background: phase === "inside" ? "rgba(0,0,0,0.78)" : "rgba(0,0,0,0)",
      transition: "background 0.5s ease",
      display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none",
    }}>
      {phase === "inside" && <div style={{
        fontSize: "1.3rem", fontWeight: 900, color: "#FFE066",
        fontFamily: "'Zen Maru Gothic', sans-serif", letterSpacing: 4,
        animation: "fadeIn 0.5s ease", textShadow: "0 0 20px rgba(255,224,102,0.5)",
      }}>🚇 トンネル つうか ちゅう…</div>}
    </div>
  );
};

export default RunTunnel;
