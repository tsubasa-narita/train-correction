const ParticleBurst = () => {
  const ps = [];
  const cs = ["#FFE066", "#FF6B8A", "#66E0FF", "#7CFF66", "#FF9F43", "#E066FF"];
  for (let i = 0; i < 16; i++) {
    ps.push({ a: (i / 16) * 360, s: 5 + Math.random() * 10, c: cs[i % cs.length], d: Math.random() * 0.1 });
  }
  return (
    <div style={{ position: "absolute", top: "50%", left: "50%", pointerEvents: "none", zIndex: 100 }}>
      {ps.map((p, i) => (
        <div key={i} style={{
          position: "absolute", width: p.s, height: p.s,
          borderRadius: i % 2 === 0 ? "50%" : "2px",
          backgroundColor: p.c,
          animation: `particleBurst 0.8s ${p.d}s ease-out forwards`,
          transform: `rotate(${p.a}deg) translateY(-10px)`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
};

export default ParticleBurst;
