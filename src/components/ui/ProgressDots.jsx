const ProgressDots = ({ total, current }) => (
  <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "8px 0" }}>
    {Array.from({ length: total }, (_, i) => (
      <div key={i} style={{
        width: 32, height: 32, borderRadius: "50%",
        background: i < current ? "linear-gradient(135deg,#FFE066,#FF9F43)" : i === current ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
        border: i === current ? "3px solid #FF9F43" : "3px solid transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.9rem", transition: "all 0.4s ease",
        boxShadow: i < current ? "0 2px 8px rgba(255,159,67,0.4)" : "none",
      }}>
        {i < current ? "⭐" : i === current ? "🚃" : ""}
      </div>
    ))}
  </div>
);

export default ProgressDots;
