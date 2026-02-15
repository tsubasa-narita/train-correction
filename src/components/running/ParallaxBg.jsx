import { MTN_COLORS, BLD_COLORS, winColor } from "../../data/colors";

// ---- Deterministic pseudo-random for consistent scene generation ----
const seed = (i, salt = 0) => {
  const x = Math.sin((i + 1) * 9973 + salt * 7919) * 43758.5453;
  return x - Math.floor(x);
};

// ---- Cloud generator: 3-5 overlapping ellipses per cloud ----
const makeCloud = (cx, cy, scale, isDusk) => {
  const fill = isDusk ? "#FFD0A0" : "#fff";
  const shadow = isDusk ? "rgba(200,140,80,0.15)" : "rgba(0,0,0,0.06)";
  // Randomize blob count 3-5 based on position
  const blobCount = 3 + Math.floor(seed(cx, 1) * 3);
  const blobs = [];
  // Bottom shadow ellipse
  blobs.push(
    <ellipse key="sh" cx={0} cy={6 * scale} rx={32 * scale} ry={7 * scale} fill={shadow} />
  );
  // Main body blobs
  const blobDefs = [
    { dx: 0, dy: 0, rx: 24, ry: 14 },
    { dx: -16, dy: -2, rx: 16, ry: 12 },
    { dx: 14, dy: -1, rx: 18, ry: 13 },
    { dx: -6, dy: -9, rx: 14, ry: 10 },
    { dx: 8, dy: -7, rx: 12, ry: 9 },
  ];
  for (let b = 0; b < blobCount; b++) {
    const d = blobDefs[b];
    blobs.push(
      <ellipse
        key={b}
        cx={d.dx * scale}
        cy={d.dy * scale}
        rx={d.rx * scale}
        ry={d.ry * scale}
        fill={fill}
        opacity={b === 0 ? 0.85 : 0.7 + seed(cx, b + 10) * 0.2}
      />
    );
  }
  return (
    <g transform={`translate(${cx},${cy})`}>
      {blobs}
    </g>
  );
};

// ---- Mountain path generator: smooth ridgeline with curves ----
const makeMountainPath = (x, baseY, w, h, variation) => {
  const peakX = x + w * (0.35 + seed(x, variation) * 0.3);
  const peakY = baseY - h;
  // Left shoulder
  const lsx = x + w * 0.15;
  const lsy = baseY - h * (0.3 + seed(x, variation + 1) * 0.25);
  // Right shoulder
  const rsx = x + w * 0.85;
  const rsy = baseY - h * (0.25 + seed(x, variation + 2) * 0.3);
  return `M${x},${baseY} C${x},${baseY} ${lsx - w * 0.05},${lsy} ${lsx},${lsy} `
    + `C${lsx + w * 0.08},${lsy - h * 0.15} ${peakX - w * 0.1},${peakY + h * 0.05} ${peakX},${peakY} `
    + `C${peakX + w * 0.1},${peakY + h * 0.05} ${rsx - w * 0.08},${rsy - h * 0.1} ${rsx},${rsy} `
    + `C${rsx + w * 0.05},${rsy + h * 0.15} ${x + w},${baseY} ${x + w},${baseY} Z`;
};

// ---- Building generator with roof details ----
const makeBuilding = (i, x, bldC, tod, isNight) => {
  const h = 22 + (seed(i, 3) * 55) | 0;
  const w = 18 + (seed(i, 4) * 22) | 0;
  const baseY = 100;
  const color = bldC[i % 4];
  const elements = [];

  // Main building body
  elements.push(
    <rect key="body" x={x} y={baseY - h} width={w} height={h} rx={1} fill={color} />
  );

  // Slight wall shade on right side for depth
  elements.push(
    <rect key="shade" x={x + w - 4} y={baseY - h} width={4} height={h} fill="rgba(0,0,0,0.08)" />
  );

  // Roof details
  const roofSeed = seed(i, 50);
  if (roofSeed > 0.6) {
    // Antenna
    const antX = x + w * 0.3 + seed(i, 51) * w * 0.4;
    elements.push(
      <line key="ant" x1={antX} y1={baseY - h} x2={antX} y2={baseY - h - 6 - seed(i, 52) * 5}
        stroke={isNight ? "#555" : "#888"} strokeWidth={0.8} />
    );
    elements.push(
      <circle key="antTip" cx={antX} cy={baseY - h - 6 - seed(i, 52) * 5} r={0.8}
        fill={isNight ? "#F44" : "#C00"} />
    );
  }
  if (roofSeed > 0.3 && roofSeed <= 0.6) {
    // Rooftop box (AC unit)
    const boxW = 4 + seed(i, 53) * 4;
    const boxH = 2.5 + seed(i, 54) * 2;
    elements.push(
      <rect key="acBox" x={x + w * 0.5 - boxW / 2} y={baseY - h - boxH}
        width={boxW} height={boxH} rx={0.5}
        fill={isNight ? "#2A2E40" : "#8899AA"} />
    );
  }
  if (roofSeed <= 0.3) {
    // Small triangular roof cap
    const capH = 3 + seed(i, 55) * 3;
    elements.push(
      <polygon key="cap"
        points={`${x},${baseY - h} ${x + w / 2},${baseY - h - capH} ${x + w},${baseY - h}`}
        fill={isNight ? "#252840" : "#7A6050"} />
    );
  }

  // Windows with varied patterns - some dark/off
  const rows = Math.floor(h / 11);
  const cols = Math.floor(w / 7);
  for (let j = 0; j < rows; j++) {
    for (let k = 0; k < cols; k++) {
      const isOff = seed(i * 100 + j * 10 + k, 60) < (isNight ? 0.3 : 0.1);
      const offColor = isNight ? "#1A1E30" : "rgba(0,0,0,0.15)";
      const wc = isOff ? offColor : winColor(tod, i, j, k);
      const wOpacity = isOff ? (isNight ? 0.6 : 0.5) : (isNight ? 0.9 : 0.75);
      elements.push(
        <rect
          key={`w${j}-${k}`}
          x={x + 3 + k * 7}
          y={baseY - h + 4 + j * 11}
          width={3.5}
          height={5}
          rx={0.6}
          fill={wc}
          opacity={wOpacity}
        />
      );
      // Window frame for lit windows at night
      if (isNight && !isOff) {
        elements.push(
          <rect
            key={`wf${j}-${k}`}
            x={x + 3 + k * 7 - 0.3}
            y={baseY - h + 4 + j * 11 - 0.3}
            width={4.1}
            height={5.6}
            rx={0.8}
            fill="none"
            stroke="rgba(255,220,120,0.15)"
            strokeWidth={0.5}
          />
        );
      }
    }
  }

  return <g key={i}>{elements}</g>;
};

const ParallaxBg = ({ dist, season, tod }) => {
  const tw = 1200;
  const ox = [
    -(dist * 0.08) % tw,
    -(dist * 0.18) % tw,
    -(dist * 0.4) % tw,
    -(dist * 0.7) % tw,
    -(dist * 1.0) % tw,
  ];
  const mtnC = season === "snow" ? ["#ccdde8", "#b8ccd8", "#d0dce6"] : MTN_COLORS[tod];
  const bldC = BLD_COLORS[tod];
  const isNight = tod === "night";
  const isDusk = tod === "dusk";
  const isDawn = tod === "dawn";

  // Ground colors
  const groundC = season === "snow" ? "#E8E8F0"
    : isNight ? "#2A3A2A"
    : isDusk ? "#5A7050"
    : "#7CB870";
  const groundC2 = season === "snow" ? "#D8D8E4"
    : isNight ? "#1E2E1E"
    : isDusk ? "#3A5030"
    : "#5A9A4E";

  // Atmospheric blue tint for far layers
  const farTint = isNight ? "rgba(10,14,42,0.3)"
    : isDusk ? "rgba(92,61,110,0.15)"
    : isDawn ? "rgba(255,158,107,0.1)"
    : "rgba(135,206,235,0.12)";

  // Fence colors
  const postColor = isNight ? "#3A3A40" : isDusk ? "#7A6A60" : "#8B7B6B";
  const wireColor = isNight ? "#4A4A50" : isDusk ? "#8A7A70" : "#A09585";
  const postCapColor = isNight ? "#444" : "#9A8A7A";

  // Track colors
  const ballastC = isNight ? "#333338" : "#8A8A85";
  const railC = isNight ? "#5A5040" : "#706050";
  const railShine = isNight ? "rgba(160,150,130,0.3)" : "rgba(255,255,255,0.45)";
  const tieC = isNight ? "#403828" : "#8A7B60";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>

      {/* ======== LAYER 0: Stars + Moon (night only) ======== */}
      {isNight && (
        <div style={{ position: "absolute", inset: 0 }}>
          {/* Crescent Moon */}
          <svg style={{ position: "absolute", right: "12%", top: "6%", width: 40, height: 40 }} viewBox="0 0 40 40">
            <circle cx={20} cy={20} r={14} fill="#FFFDE0" opacity={0.9} />
            <circle cx={26} cy={17} r={12} fill="#0A0E2A" />
            {/* Moon glow */}
            <circle cx={20} cy={20} r={18} fill="none" stroke="rgba(255,253,200,0.08)" strokeWidth={4} />
          </svg>
          {/* Stars - varied sizes and brightness */}
          {[...Array(50)].map((_, i) => {
            const sx = (seed(i, 100) * 100);
            const sy = (seed(i, 101) * 50);
            const size = i % 7 === 0 ? 3.5 : i % 5 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1.2;
            const baseOpacity = 0.2 + seed(i, 102) * 0.6;
            const dur = 1.2 + (i % 5) * 0.8;
            return (
              <div key={i} style={{
                position: "absolute",
                left: `${sx}%`,
                top: `${sy}%`,
                width: size,
                height: size,
                borderRadius: "50%",
                background: i % 11 === 0 ? "#AADDFF" : i % 13 === 0 ? "#FFDDAA" : "#fff",
                opacity: baseOpacity,
                animation: `twinkle ${dur}s ${seed(i, 103) * 3}s ease-in-out infinite alternate`,
                boxShadow: size > 2.5 ? `0 0 ${size + 2}px rgba(255,255,255,0.4)` : "none",
              }} />
            );
          })}
        </div>
      )}

      {/* ======== LAYER 1: Clouds (slowest parallax) ======== */}
      {!isNight && (
        <div style={{
          position: "absolute", top: "2%", width: tw * 2, height: 100,
          transform: `translateX(${ox[0]}px)`, willChange: "transform",
        }}>
          <svg width={tw * 2} height={100} viewBox={`0 0 ${tw * 2} 100`}>
            {/* Atmospheric haze overlay on far layer */}
            <rect x={0} y={0} width={tw * 2} height={100} fill={farTint} opacity={0.3} />
            {[
              { x: 40, y: 50, s: 1.3 },
              { x: 220, y: 35, s: 0.9 },
              { x: 420, y: 55, s: 1.1 },
              { x: 580, y: 30, s: 0.7 },
              { x: 750, y: 48, s: 1.0 },
              { x: 930, y: 38, s: 1.2 },
              { x: 1100, y: 52, s: 0.8 },
              { x: 1250, y: 42, s: 1.4 },
              { x: 1420, y: 32, s: 0.9 },
              { x: 1600, y: 55, s: 1.1 },
              { x: 1780, y: 40, s: 0.75 },
              { x: 1950, y: 48, s: 1.0 },
              { x: 2100, y: 36, s: 1.15 },
            ].map((c, i) => (
              <g key={i} opacity={isDusk ? 0.3 : isDawn ? 0.5 : 0.45}>
                {makeCloud(c.x, c.y, c.s, isDusk)}
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* ======== LAYER 2: Mountains (multi-layer with depth) ======== */}
      <div style={{
        position: "absolute", bottom: "42%", width: tw * 2, height: 140,
        transform: `translateX(${ox[1]}px) perspective(600px) rotateX(2deg)`,
        transformOrigin: "bottom center", willChange: "transform",
      }}>
        <svg width={tw * 2} height={140} viewBox={`0 0 ${tw * 2} 140`}>
          {/* Far mountain range - faded, blueish tint */}
          {[0, 180, 350, 520, 700, 900, 1100, 1300, 1500, 1700, 1900, 2100].map((x, i) => {
            const w = 200 + seed(i, 20) * 100;
            const h = 40 + seed(i, 21) * 35;
            const farColor = isNight ? "#1A2040" : isDusk ? "#6A5575" : isDawn ? "#C0A898" : "#8ABAAA";
            return (
              <path key={`far${i}`}
                d={makeMountainPath(x, 140, w, h, i * 10)}
                fill={farColor}
                opacity={0.4}
              />
            );
          })}
          {/* Atmospheric depth overlay on far mountains */}
          <rect x={0} y={0} width={tw * 2} height={140} fill={farTint} opacity={0.25} />
          {/* Near mountain range - bold colors */}
          {[0, 130, 280, 430, 560, 720, 870, 1020, 1170, 1330, 1480, 1630, 1780, 1940, 2100].map((x, i) => {
            const w = 150 + seed(i, 22) * 80;
            const h = 50 + seed(i, 23) * 55;
            const color = mtnC[i % 3];
            return (
              <g key={`near${i}`}>
                <path
                  d={makeMountainPath(x, 140, w, h, i * 20 + 5)}
                  fill={color}
                  opacity={0.7}
                />
                {/* Ridge shadow on one side */}
                <path
                  d={makeMountainPath(x + w * 0.05, 140, w * 0.5, h * 0.92, i * 20 + 7)}
                  fill="rgba(0,0,0,0.08)"
                />
              </g>
            );
          })}
          {/* Snow caps in snow season */}
          {season === "snow" && [130, 430, 720, 1020, 1330, 1630, 1940].map((x, i) => {
            const w = 150 + seed(i, 22) * 80;
            const h = 50 + seed(i, 23) * 55;
            const peakX = x + w * (0.35 + seed(x, i * 20 + 5) * 0.3);
            const peakY = 140 - h;
            return (
              <ellipse key={`snow${i}`}
                cx={peakX} cy={peakY + 4} rx={w * 0.12} ry={6}
                fill="#fff" opacity={0.7}
              />
            );
          })}
        </svg>
      </div>

      {/* ======== LAYER 3: Buildings (with roof details and variety) ======== */}
      <div style={{
        position: "absolute", bottom: "28%", width: tw * 2, height: 120,
        transform: `translateX(${ox[2]}px) perspective(500px) rotateX(3deg)`,
        transformOrigin: "bottom center", willChange: "transform",
      }}>
        <svg width={tw * 2} height={120} viewBox={`0 0 ${tw * 2} 120`}>
          {/* Atmospheric depth on buildings layer */}
          <rect x={0} y={0} width={tw * 2} height={120} fill={farTint} opacity={0.08} />
          {Array.from({ length: 34 }, (_, i) => {
            const x = i * 72 + seed(i, 30) * 10 - 5;
            return makeBuilding(i, x, bldC, tod, isNight);
          })}
          {/* Night glow beneath lit building clusters */}
          {isNight && Array.from({ length: 12 }, (_, i) => (
            <ellipse key={`glow${i}`}
              cx={i * 200 + 50} cy={102} rx={50} ry={4}
              fill="#FFE89F" opacity={0.04}
            />
          ))}
        </svg>
      </div>

      {/* ======== LAYER 4: Fence (post-and-wire with proper proportions) ======== */}
      <div style={{
        position: "absolute", bottom: "22%", width: tw * 2, height: 30,
        transform: `translateX(${ox[3]}px) perspective(400px) rotateX(4deg)`,
        transformOrigin: "bottom center", willChange: "transform",
      }}>
        <svg width={tw * 2} height={30} viewBox={`0 0 ${tw * 2} 30`}>
          {[...Array(60)].map((_, i) => {
            const px = i * 40;
            return (
              <g key={i}>
                {/* Post shadow */}
                <rect x={px + 1.5} y={4} width={2} height={24} fill="rgba(0,0,0,0.08)" />
                {/* Main post */}
                <rect x={px} y={2} width={2.5} height={26} rx={0.5} fill={postColor} />
                {/* Post cap */}
                <rect x={px - 0.5} y={1} width={3.5} height={2} rx={0.8} fill={postCapColor} />
                {/* Upper wire */}
                <line x1={px + 2.5} y1={7} x2={px + 40} y2={7}
                  stroke={wireColor} strokeWidth={0.8} />
                {/* Middle wire */}
                <line x1={px + 2.5} y1={14} x2={px + 40} y2={14}
                  stroke={wireColor} strokeWidth={0.8} />
                {/* Lower wire */}
                <line x1={px + 2.5} y1={21} x2={px + 40} y2={21}
                  stroke={wireColor} strokeWidth={0.8} />
                {/* Wire sag (subtle catenary droop on upper wire) */}
                <path
                  d={`M${px + 2.5},7 Q${px + 21},8.5 ${px + 40},7`}
                  fill="none" stroke={wireColor} strokeWidth={0.5} opacity={0.5}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* ======== GROUND PLANE ======== */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "22%",
        background: `linear-gradient(180deg,${groundC} 0%,${groundC2} 100%)`,
        transformOrigin: "bottom center",
      }}>
        {/* Field patterns / texture */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {season === "snow" ? (
            /* Snow ground: white with subtle blue shadow patches */
            <>
              {[...Array(8)].map((_, i) => (
                <div key={`sp${i}`} style={{
                  position: "absolute",
                  left: `${((seed(i, 200) * 100 + ox[4] * 0.15) % 120) - 10}%`,
                  top: `${20 + seed(i, 201) * 60}%`,
                  width: 40 + seed(i, 202) * 60,
                  height: 8 + seed(i, 203) * 12,
                  background: "rgba(180,200,220,0.12)",
                  borderRadius: "50%",
                  transform: "skewX(-8deg)",
                }} />
              ))}
              {/* Subtle snow texture stripes */}
              {[...Array(10)].map((_, i) => (
                <div key={`ss${i}`} style={{
                  position: "absolute",
                  left: `${((i * 10 + (ox[4] * 0.2) % 100 + 100) % 100)}%`,
                  top: 0, bottom: 0, width: 1.5,
                  background: "rgba(255,255,255,0.2)",
                  transform: "skewX(-15deg)",
                }} />
              ))}
            </>
          ) : (
            /* Normal ground: grass stripes + field patterns (rice paddies) */
            <>
              {/* Grass texture stripes */}
              {[...Array(16)].map((_, i) => (
                <div key={`gs${i}`} style={{
                  position: "absolute",
                  left: `${((i * 6.5 + (ox[4] * 0.25) % 100 + 100) % 100)}%`,
                  top: 0, bottom: 0, width: 1.5 + (i % 3) * 0.5,
                  background: isNight
                    ? "rgba(20,50,20,0.15)"
                    : isDusk
                    ? "rgba(40,60,30,0.1)"
                    : "rgba(0,80,0,0.06)",
                  transform: `skewX(${-12 - (i % 3) * 3}deg)`,
                }} />
              ))}
              {/* Field patterns - rice paddies (light green rectangles) */}
              {[...Array(6)].map((_, i) => {
                const fieldX = ((seed(i, 210) * 90 + (ox[4] * 0.12) % 100 + 100) % 110) - 5;
                return (
                  <div key={`fp${i}`} style={{
                    position: "absolute",
                    left: `${fieldX}%`,
                    top: `${35 + seed(i, 211) * 40}%`,
                    width: 30 + seed(i, 212) * 50,
                    height: 6 + seed(i, 213) * 8,
                    background: isNight
                      ? "rgba(30,60,30,0.2)"
                      : isDusk
                      ? "rgba(80,110,50,0.12)"
                      : "rgba(120,200,80,0.15)",
                    border: isNight
                      ? "0.5px solid rgba(40,70,40,0.15)"
                      : "0.5px solid rgba(60,120,40,0.1)",
                    borderRadius: 1,
                  }} />
                );
              })}
            </>
          )}

          {/* Ground speed tracking stripes (enhanced speed line effect) */}
          {[...Array(20)].map((_, i) => {
            const stripeX = ((i * 5 + (ox[4] * 0.5) % 100 + 100) % 100);
            const thickness = 1 + (i % 4) * 0.8;
            const opacity = season === "snow"
              ? 0.08 + (i % 3) * 0.03
              : isNight ? 0.05 + (i % 3) * 0.02 : 0.04 + (i % 3) * 0.025;
            return (
              <div key={`ts${i}`} style={{
                position: "absolute",
                left: `${stripeX}%`,
                top: `${2 + (i % 5) * 3}%`,
                width: thickness,
                height: `${40 + (i % 3) * 20}%`,
                background: season === "snow"
                  ? "rgba(200,210,230,0.3)"
                  : isNight ? "rgba(100,140,100,0.15)" : "rgba(255,255,255,0.25)",
                transform: "skewX(-18deg)",
                opacity,
              }} />
            );
          })}
        </div>
      </div>

      {/* ======== TRACK (ballast + ties + rails + metallic shine) ======== */}
      <div style={{
        position: "absolute", bottom: "13%", left: 0, right: 0, height: "10%",
        overflow: "hidden",
      }}>
        <svg width="100%" height="100%" viewBox="0 0 800 60" preserveAspectRatio="none"
          style={{ display: "block" }}>
          {/* Ballast bed - gray gravel area */}
          <rect x={0} y={4} width={800} height={52} fill={ballastC} opacity={0.35} rx={2} />
          {/* Ballast texture dots */}
          {[...Array(80)].map((_, i) => {
            const bx = (i * 10 + (ox[4] * 0.8) % 800 + 800) % 800;
            const by = 8 + seed(i, 300) * 42;
            return (
              <circle key={`b${i}`} cx={bx} cy={by} r={0.8 + seed(i, 301) * 0.8}
                fill={isNight ? "#444" : "#999"} opacity={0.25} />
            );
          })}
          {/* Cross-ties (sleepers) - properly spaced, synced with scroll */}
          {[...Array(45)].map((_, i) => {
            const sx = ((i * 18 + (ox[4] * 0.8) % 810) + 810) % 810 - 5;
            return (
              <rect key={`tie${i}`}
                x={sx} y={10} width={5} height={38} rx={1}
                fill={tieC} opacity={0.65}
              />
            );
          })}
          {/* Left rail - dark base */}
          <line x1={0} y1={16} x2={800} y2={18} stroke={railC} strokeWidth={3.5} />
          {/* Right rail - dark base */}
          <line x1={0} y1={41} x2={800} y2={39} stroke={railC} strokeWidth={3.5} />
          {/* Left rail - metallic highlight (thin white shine line) */}
          <line x1={0} y1={15} x2={800} y2={17}
            stroke={railShine} strokeWidth={1.2} />
          {/* Right rail - metallic highlight */}
          <line x1={0} y1={40} x2={800} y2={38}
            stroke={railShine} strokeWidth={1.2} />
          {/* Rail inner edge shadow */}
          <line x1={0} y1={17.5} x2={800} y2={19.5}
            stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} />
          <line x1={0} y1={42.5} x2={800} y2={40.5}
            stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} />
        </svg>
      </div>
    </div>
  );
};

export default ParallaxBg;
