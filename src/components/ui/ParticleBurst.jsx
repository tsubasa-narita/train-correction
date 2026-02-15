import { useMemo } from "react";

const PARTICLE_COLORS = [
  "#FFE066", "#FF6B8A", "#66E0FF", "#7CFF66", "#FF9F43", "#E066FF",
  "#FF5252", "#64FFDA", "#FFD740", "#FF80AB",
];

const ParticleBurst = () => {
  const particles = useMemo(() => {
    const ps = [];

    // Wave 1: immediate burst (16 particles)
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * 360;
      const shape = i % 3; // 0=circle, 1=rect, 2=star-like diamond
      ps.push({
        angle,
        size: 5 + Math.random() * 10,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        delay: Math.random() * 0.08,
        duration: 0.7 + Math.random() * 0.3,
        distance: 70 + Math.random() * 30,
        shape,
        wave: 1,
      });
    }

    // Wave 2: delayed secondary burst (12 particles, smaller, wider spread)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * 360 + 15; // offset from wave 1
      const shape = (i + 1) % 3;
      ps.push({
        angle,
        size: 3 + Math.random() * 7,
        color: PARTICLE_COLORS[(i + 3) % PARTICLE_COLORS.length],
        delay: 0.15 + Math.random() * 0.12,
        duration: 0.6 + Math.random() * 0.4,
        distance: 90 + Math.random() * 40,
        shape,
        wave: 2,
      });
    }

    return ps;
  }, []);

  const getShapeStyle = (shape, size) => {
    switch (shape) {
      case 0: // circle
        return { borderRadius: "50%", width: size, height: size };
      case 1: // small rectangle
        return { borderRadius: 2, width: size * 0.6, height: size * 1.4 };
      case 2: // diamond (rotated square for star-like look)
        return {
          borderRadius: 2,
          width: size * 0.8,
          height: size * 0.8,
          transform: `rotate(${45}deg)`,
        };
      default:
        return { borderRadius: "50%", width: size, height: size };
    }
  };

  return (
    <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      pointerEvents: "none",
      zIndex: 100,
    }}>
      {particles.map((p, i) => {
        const shapeStyle = getShapeStyle(p.shape, p.size);
        return (
          <div key={i} style={{
            position: "absolute",
            ...shapeStyle,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size}px ${p.color}66`,
            animation: `particleBurst ${p.duration}s ${p.delay}s ease-out forwards`,
            transform: `rotate(${p.angle}deg) translateY(-10px)${p.shape === 2 ? " rotate(45deg)" : ""}`,
            opacity: 0,
          }} />
        );
      })}
    </div>
  );
};

export default ParticleBurst;
