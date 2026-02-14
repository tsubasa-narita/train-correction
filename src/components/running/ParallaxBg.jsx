import { MTN_COLORS, BLD_COLORS, winColor } from "../../data/colors";

const ParallaxBg = ({ dist, season, tod }) => {
  const tw = 1200;
  const ox = [-(dist * 0.08) % tw, -(dist * 0.18) % tw, -(dist * 0.4) % tw, -(dist * 0.7) % tw, -(dist * 1.0) % tw];
  const mtnC = season === "snow" ? ["#ccdde8", "#b8ccd8", "#d0dce6"] : MTN_COLORS[tod];
  const bldC = BLD_COLORS[tod];
  const isNight = tod === "night";
  const isDusk = tod === "dusk";
  const groundC = season === "snow" ? "#E8E8F0" : isNight ? "#2A3A2A" : "#7CB870";
  const groundC2 = season === "snow" ? "#D8D8E4" : isNight ? "#1E2E1E" : "#5A9A4E";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Stars (night only) */}
      {isNight && <div style={{ position: "absolute", inset: 0 }}>
        {[...Array(30)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${(i * 3.3 + Math.sin(i) * 5) % 100}%`,
            top: `${(i * 2.7 + Math.cos(i) * 8) % 45}%`,
            width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2,
            borderRadius: "50%", background: "#fff",
            opacity: 0.3 + Math.sin(i * 1.5) * 0.3,
            animation: `twinkle ${1.5 + i % 3}s ${i * 0.2}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>}
      {/* Clouds (not at night) */}
      {!isNight && <div style={{ position: "absolute", top: "4%", width: tw * 2, height: 80, transform: `translateX(${ox[0]}px)`, willChange: "transform" }}>
        {[0, 150, 340, 520, 700, 900, 1050, 1200, 1350, 1540, 1720, 1900].map((x, i) => (
          <svg key={i} style={{ position: "absolute", left: x, top: i % 3 * 18, width: 75, height: 45, opacity: isDusk ? 0.25 : 0.4 }} viewBox="0 0 90 45">
            <ellipse cx={45} cy={30} rx={38} ry={12} fill={isDusk ? "#FFD0A0" : "white"} opacity={0.5} />
            <ellipse cx={32} cy={20} rx={18} ry={14} fill={isDusk ? "#FFC890" : "white"} opacity={0.6} />
          </svg>
        ))}
      </div>}
      {/* Mountains with depth */}
      <div style={{ position: "absolute", bottom: "42%", width: tw * 2, height: 120, transform: `translateX(${ox[1]}px) perspective(600px) rotateX(2deg)`, transformOrigin: "bottom center", willChange: "transform" }}>
        <svg width={tw * 2} height={120} viewBox={`0 0 ${tw * 2} 120`}>
          {[0, 120, 260, 400, 530, 680, 830, 980, 1120, 1280, 1430, 1580, 1720, 1880, 2050, 2200].map((x, i) => {
            const h = 50 + (i * 29) % 50;
            return <polygon key={i} points={`${x},120 ${x + 60},${120 - h} ${x + 120},120`} fill={mtnC[i % 3]} opacity={0.55} />;
          })}
        </svg>
      </div>
      {/* Buildings with slight perspective */}
      <div style={{ position: "absolute", bottom: "28%", width: tw * 2, height: 100, transform: `translateX(${ox[2]}px) perspective(500px) rotateX(3deg)`, transformOrigin: "bottom center", willChange: "transform" }}>
        <svg width={tw * 2} height={100} viewBox={`0 0 ${tw * 2} 100`}>
          {Array.from({ length: 32 }, (_, i) => {
            const x = i * 75, h = 20 + (i * 31) % 55, w = 16 + (i * 17) % 24;
            return (
              <g key={i}>
                <rect x={x} y={100 - h} width={w} height={h} rx={2} fill={bldC[i % 4]} />
                {Array.from({ length: Math.floor(h / 11) }, (_, j) =>
                  Array.from({ length: Math.floor(w / 7) }, (_, k) => (
                    <rect key={`${j}-${k}`} x={x + 2 + k * 7} y={100 - h + 3 + j * 11} width={3.5} height={4.5} rx={0.8} fill={winColor(tod, i, j, k)} opacity={isNight ? 0.9 : 0.75} />
                  ))
                )}
              </g>
            );
          })}
        </svg>
      </div>
      {/* Fence with depth */}
      <div style={{ position: "absolute", bottom: "22%", width: tw * 2, height: 28, transform: `translateX(${ox[3]}px) perspective(400px) rotateX(4deg)`, transformOrigin: "bottom center", willChange: "transform" }}>
        <svg width={tw * 2} height={28} viewBox={`0 0 ${tw * 2} 28`}>
          {[...Array(60)].map((_, i) => (
            <g key={i}>
              <rect x={i * 40} y={2} width={3} height={25} rx={1} fill={isNight ? "#444" : "#B0A090"} />
              <rect x={i * 40} y={7} width={40} height={2} fill={isNight ? "#555" : "#C0B0A0"} />
              <rect x={i * 40} y={18} width={40} height={2} fill={isNight ? "#555" : "#C0B0A0"} />
            </g>
          ))}
        </svg>
      </div>
      {/* Ground plane */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "22%", background: `linear-gradient(180deg,${groundC} 0%,${groundC2} 100%)`, transformOrigin: "bottom center" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              position: "absolute", left: `${((i * 100 / 6) + (ox[4] * 0.3) % 100) % 100}%`,
              top: 0, bottom: 0, width: 2,
              background: season === "snow" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.04)",
              transform: "skewX(-15deg)",
            }} />
          ))}
        </div>
      </div>
      {/* Track */}
      <div style={{ position: "absolute", bottom: "13%", left: 0, right: 0, height: "10%", overflow: "hidden" }}>
        <svg width="100%" height="100%" viewBox="0 0 800 60" preserveAspectRatio="none" style={{ display: "block" }}>
          <line x1={0} y1={15} x2={800} y2={18} stroke={isNight ? "#665540" : "#8B7355"} strokeWidth={3} />
          <line x1={0} y1={40} x2={800} y2={38} stroke={isNight ? "#665540" : "#8B7355"} strokeWidth={3} />
          {[...Array(40)].map((_, i) => {
            const sx = ((i * 20 + (ox[4] * 0.8) % 800) + 800) % 800;
            return <rect key={i} x={sx} y={10} width={5} height={35} rx={1} fill={isNight ? "#554430" : "#A0926B"} opacity={0.7} />;
          })}
          <line x1={0} y1={15} x2={800} y2={18} stroke={isNight ? "#887766" : "#BBA880"} strokeWidth={1} opacity={0.4} />
          <line x1={0} y1={40} x2={800} y2={38} stroke={isNight ? "#887766" : "#BBA880"} strokeWidth={1} opacity={0.4} />
        </svg>
      </div>
    </div>
  );
};

export default ParallaxBg;
