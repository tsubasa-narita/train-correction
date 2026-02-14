const RunSpeedLines = ({ speed }) => {
  if (speed <= 0.5) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 4 }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", right: -80, top: `${30 + i * 7}%`,
          width: 40 + i * 12, height: 2,
          background: `rgba(255,255,255,${0.2 + speed * 0.2})`,
          borderRadius: 2,
          animation: `speedLine ${0.3 + 0.2 / speed}s ${i * 0.04}s linear infinite`,
        }} />
      ))}
    </div>
  );
};

export default RunSpeedLines;
