import { NOSE_FNS, NOSE_TIP_X } from "../../data/trains";
import { getSteps } from "../../data/gameSteps";

// ============ TrainSVG (collect screen, enhanced visuals) ============
const TrainSVG = ({ train: t, parts, animating, animProgress, stepCount, mystery }) => {
  const id = t.id;
  const c = mystery ? {
    body: "#B8B8B8", bodyLo: "#A0A0A0", roof: "#C8C8C8", nose: "#B0B0B0", noseLo: "#989898",
    stripe1: "#C0C0C0", stripe2: "#D0D0D0", window: "#D8D8D8", winFrame: "#999", winBg: "#AAA",
    under: "#999", skirt: "#AAA", bogie: "#888", headlight: "#E0E0E0",
  } : {
    body: t.body, bodyLo: t.bodyLo, roof: t.roof, nose: t.nose, noseLo: t.noseLo,
    stripe1: t.stripe1, stripe2: t.stripe2, window: t.window, winFrame: t.winFrame, winBg: t.winBg,
    under: t.under, skirt: t.skirt, bogie: t.bogie, headlight: "#FFFBE0",
  };

  const allPn = getSteps(stepCount || 4).map((s) => s.partName);
  const hw = parts.includes("しゃりん"), ht = parts.includes("せんろ"), hwin = parts.includes("まど"), hb = parts.includes("ボディ");
  const hdoor = parts.includes("ドア"), hroof = parts.includes("やね"), hpan = parts.includes("パンタグラフ");
  const showDoors = allPn.includes("ドア") ? hdoor : hb;
  const showRoof = allPn.includes("やね") ? hroof : hb;
  const showPan = allPn.includes("パンタグラフ") ? hpan : hb;
  const isSteam = t.kind === "steam";

  const getOff = (pn) => {
    if (animating !== pn) return {};
    const r = 1 - (animProgress || 0);
    const m = {
      "しゃりん": { transform: `translateY(${r * 50}px)`, opacity: animProgress },
      "せんろ": { opacity: animProgress },
      "まど": { transform: `translateY(${r * -40}px)`, opacity: animProgress },
      "ボディ": { transform: `translateY(${r * -60}px)`, opacity: animProgress },
      "ドア": { transform: `translateX(${r * 30}px)`, opacity: animProgress },
      "やね": { transform: `translateY(${r * -30}px)`, opacity: animProgress },
      "パンタグラフ": { transform: `translateY(${r * -40}px)`, opacity: animProgress },
    };
    return m[pn] || {};
  };

  const wS = getOff("しゃりん"), tS = getOff("せんろ"), winS = getOff("まど"), bS = getOff("ボディ");
  const doorS = getOff("ドア"), roofS = getOff("やね"), panS = getOff("パンタグラフ");
  const nosePath = NOSE_FNS[t.noseType]();
  const tipX = NOSE_TIP_X[t.noseType];
  const bx = 70, by = isSteam ? 145 : 128, bw = 250, bh = isSteam ? 73 : 100, bb = by + bh;
  const wins = isSteam
    ? [{ x: 88, y: 155, w: 22, h: 16 }]
    : t.kind === "commuter"
      ? [0, 1, 2, 3, 4, 5].map((i) => ({ x: 90 + i * 36, y: 140, w: 24, h: 26 }))
      : [0, 1, 2, 3, 4].map((i) => ({ x: 100 + i * 40, y: 142, w: 26, h: 22 }));
  let doors = isSteam ? [] : [{ x: 83, y: 140, w: 14, h: 44 }, { x: 215, y: 140, w: 14, h: 44 }];
  if (t.kind === "commuter") doors = [{ x: 78, y: 138, w: 12, h: 48 }, { x: 150, y: 138, w: 12, h: 48 }, { x: 222, y: 138, w: 12, h: 48 }];

  return (
    <svg viewBox="0 0 480 275" style={{ width: "100%", maxWidth: 480, height: "auto", display: "block", margin: "0 auto", overflow: "visible" }}>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.body} /><stop offset="100%" stopColor={c.bodyLo} /></linearGradient>
        <linearGradient id={`hl-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.4)" /><stop offset="50%" stopColor="rgba(255,255,255,0.08)" /><stop offset="100%" stopColor="rgba(0,0,0,0.1)" /></linearGradient>
        <linearGradient id={`wg-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#88D4FF" /><stop offset="100%" stopColor="#4488BB" /></linearGradient>
        <linearGradient id={`wgm-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C8C8C8" /><stop offset="100%" stopColor="#AAAAAA" /></linearGradient>
        <clipPath id={`bc-${id}`}><rect x={bx} y={by} width={bw} height={bh} rx={isSteam ? 4 : 10} /><path d={nosePath} /></clipPath>
        <filter id={`sd-${id}`}><feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.2" /></filter>
        <filter id={`glow-${id}`}><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {/* せんろ (tracks with ballast and rail shine) */}
      <g style={{ opacity: ht ? 1 : 0.12, ...(ht && tS.opacity !== undefined ? { opacity: tS.opacity } : {}) }}>
        <rect x={0} y={244} width={480} height={24} rx={2} fill={ht ? "#C8BBA0" : "#e8e8e8"} opacity={0.4} />
        {[...Array(24)].map((_, i) => <rect key={i} x={2 + i * 20} y={247} width={10} height={20} rx={1.5} fill={ht ? "#A0926B" : "#e0e0e0"} />)}
        <rect x={0} y={250} width={480} height={4} rx={1.5} fill={ht ? "#8B7355" : "#ddd"} />
        {ht && <rect x={0} y={250} width={480} height={1.5} rx={0.5} fill="rgba(255,255,255,0.25)" />}
        <rect x={0} y={261} width={480} height={4} rx={1.5} fill={ht ? "#8B7355" : "#ddd"} />
        {ht && <rect x={0} y={261} width={480} height={1.5} rx={0.5} fill="rgba(255,255,255,0.25)" />}
      </g>
      {/* 台車・スカート */}
      <g style={{ opacity: hb ? 1 : 0.12, ...(hb ? bS : {}) }}>
        <rect x={bx + 8} y={bb} width={bw - 16} height={12} rx={2} fill={hb ? c.under : "#ddd"} />
        <rect x={bx + 4} y={bb + 8} width={bw - 8} height={8} rx={2} fill={hb ? c.skirt : "#e8e8e8"} />
        {hb && <rect x={bx + 4} y={bb + 8} width={bw - 8} height={2} rx={1} fill="rgba(255,255,255,0.2)" />}
      </g>
      {/* ボディ本体 (enhanced with highlight overlay) */}
      <g style={{ opacity: hb ? 1 : 0.12, ...(hb ? bS : {}) }} filter={hb ? `url(#sd-${id})` : undefined}>
        <rect x={bx} y={by} width={bw} height={bh} rx={isSteam ? 4 : 10} fill={hb ? `url(#bg-${id})` : "#e8e8e8"} />
        <path d={nosePath} fill={hb ? c.nose : "#e0e0e0"} />
        {/* Rear coupler bulge (non-steam only) */}
        {hb && !isSteam && <path d={`M${bx},${by + 4} Q${bx - 12},${by + bh / 2} ${bx},${bb - 4}`} fill={c.bodyLo} />}
        {hb && !isSteam && <circle cx={bx - 5} cy={by + bh / 2} r={5} fill={c.under} stroke={c.bodyLo} strokeWidth={1.5} />}
        {hb && <g clipPath={`url(#bc-${id})`}>
          <rect x={bx - 20} y={by} width={bw + tipX - bx + 20} height={bh} fill={`url(#hl-${id})`} />
          <rect x={bx - 20} y={t.stripe1Y} width={tipX - bx + 30} height={t.stripe1W} fill={c.stripe1} />
          {t.stripe2 && <rect x={bx - 20} y={t.stripe2Y} width={tipX - bx + 30} height={t.stripe2W} fill={c.stripe2} />}
          {!isSteam && <line x1={bx + 80} y1={by + 14} x2={bx + 80} y2={bb - 2} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />}
          {!isSteam && <line x1={bx + 170} y1={by + 14} x2={bx + 170} y2={bb - 2} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />}
        </g>}
        {hb && <g filter={mystery ? undefined : `url(#glow-${id})`}>
          <ellipse cx={isSteam ? tipX + 2 : tipX - 4} cy={isSteam ? 155 : 170} rx={t.hlW / 2} ry={t.hlH / 2} fill={c.headlight} />
        </g>}
        {hb && !isSteam && <rect x={bx - 6} y={185} width={5} height={3} rx={1.5} fill={mystery ? c.under : "#E74C3C"} opacity={0.7} />}
        {hb && <g clipPath={`url(#bc-${id})`}><rect x={bx - 20} y={bb - 6} width={bw + tipX - bx + 20} height={6} fill="rgba(0,0,0,0.08)" /></g>}
      </g>
      {/* やね */}
      <g style={{ opacity: showRoof ? 1 : 0.12, ...(showRoof ? roofS : {}) }}>
        {hb
          ? <g clipPath={`url(#bc-${id})`}>
              <rect x={bx - 5} y={by - 2} width={bw + tipX - bx + 15} height={14} rx={5} fill={showRoof ? c.roof : "#ddd"} />
              {showRoof && <rect x={bx - 5} y={by - 2} width={bw + tipX - bx + 15} height={4} rx={2} fill="rgba(255,255,255,0.2)" />}
              {showRoof && !isSteam && [0, 1, 2].map((i) => (
                <rect key={i} x={bx + 30 + i * 60} y={by - 4} width={20} height={4} rx={2} fill={showRoof ? c.roof : "#ddd"} stroke="rgba(0,0,0,0.08)" strokeWidth={0.5} />
              ))}
            </g>
          : <rect x={bx} y={by} width={bw} height={14} rx={isSteam ? 4 : 8} fill={showRoof ? c.roof : "#ddd"} />}
      </g>
      {/* まど (windows with sky reflection gradient) */}
      <g style={{ opacity: hwin ? 1 : 0.12, ...(hwin ? winS : {}) }}>
        {wins.map((w, i) => (<g key={i}>
          <rect x={w.x - 1} y={w.y - 1} width={w.w + 2} height={w.h + 2} rx={3.5} fill={hwin ? c.winFrame : "#ccc"} />
          <rect x={w.x} y={w.y} width={w.w} height={w.h} rx={3} fill={hwin ? (mystery ? `url(#wgm-${id})` : `url(#wg-${id})`) : "#e5e5e5"} />
          {hwin && <rect x={w.x} y={w.y} width={w.w} height={w.h * 0.4} rx={3} fill="rgba(255,255,255,0.15)" />}
        </g>))}
      </g>
      {/* ドア */}
      {doors.length > 0 && <g style={{ opacity: showDoors ? 1 : 0.12, ...(showDoors ? doorS : {}) }}>
        {doors.map((d, i) => (<g key={`d${i}`}>
          <rect x={d.x} y={d.y} width={d.w} height={d.h} rx={2} fill={showDoors ? (c.bodyLo || "#C8C8C8") : "#ddd"} stroke={showDoors ? "rgba(0,0,0,0.12)" : "#ccc"} strokeWidth={1} />
          <rect x={d.x + 2} y={d.y + 4} width={d.w - 4} height={d.h * 0.35} rx={1.5} fill={showDoors ? (mystery ? "#C0C0C0" : "#7CBAE8") : "#e0e0e0"} />
          <line x1={d.x + d.w / 2} y1={d.y + 4} x2={d.x + d.w / 2} y2={d.y + d.h - 4} stroke={showDoors ? "rgba(0,0,0,0.1)" : "#ccc"} strokeWidth={0.8} />
          <rect x={d.x + d.w - 3.5} y={d.y + d.h / 2 - 2} width={2} height={4} rx={0.5} fill={showDoors ? "#888" : "#ccc"} />
          <rect x={d.x - 1} y={d.y + d.h - 2} width={d.w + 2} height={2} rx={0.5} fill={showDoors ? "rgba(0,0,0,0.15)" : "#ddd"} />
        </g>))}
      </g>}
      {/* パンタグラフ */}
      {!isSteam && <g style={{ opacity: showPan ? 1 : 0.12, ...(showPan ? panS : {}) }}>
        <g transform="translate(200, 0)">
          <rect x={-8} y={by - 2} width={16} height={6} rx={2} fill={showPan ? "#444" : "#ccc"} />
          <line x1={0} y1={by - 2} x2={-12} y2={by - 28} stroke={showPan ? "#555" : "#ccc"} strokeWidth={3} strokeLinecap="round" />
          <line x1={0} y1={by - 2} x2={12} y2={by - 28} stroke={showPan ? "#555" : "#ccc"} strokeWidth={3} strokeLinecap="round" />
          <circle cx={-12} cy={by - 28} r={2.5} fill={showPan ? "#666" : "#ccc"} />
          <circle cx={12} cy={by - 28} r={2.5} fill={showPan ? "#666" : "#ccc"} />
          <line x1={-12} y1={by - 28} x2={-5} y2={by - 48} stroke={showPan ? "#666" : "#ccc"} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={12} y1={by - 28} x2={5} y2={by - 48} stroke={showPan ? "#666" : "#ccc"} strokeWidth={2.5} strokeLinecap="round" />
          <rect x={-16} y={by - 53} width={32} height={4} rx={1.5} fill={showPan ? "#333" : "#bbb"} />
          {showPan && <rect x={-16} y={by - 53} width={32} height={1.5} rx={0.5} fill="rgba(255,255,255,0.2)" />}
          <line x1={-4} y1={by - 8} x2={-10} y2={by - 22} stroke={showPan ? "#888" : "#ccc"} strokeWidth={1} strokeDasharray="2,2" />
          <line x1={4} y1={by - 8} x2={10} y2={by - 22} stroke={showPan ? "#888" : "#ccc"} strokeWidth={1} strokeDasharray="2,2" />
          {showPan && <line x1={-90} y1={by - 55} x2={90} y2={by - 55} stroke="#444" strokeWidth={1.8} opacity={0.25} />}
          {showPan && <circle cx={0} cy={by - 4} r={2} fill="#8B5E3C" />}
        </g>
      </g>}
      {/* SL extra details */}
      {isSteam && hb && <g style={{ ...(hb ? bS : {}) }}>
        <rect x={160} y={148} width={195} height={70} rx={35} fill={mystery ? "#999" : "#222"} />
        <rect x={160} y={148} width={195} height={20} rx={10} fill="rgba(255,255,255,0.06)" />
        <rect x={340} y={145} width={25} height={73} rx={4} fill={mystery ? "#888" : "#2A2A2A"} />
        <rect x={348} y={115} width={14} height={33} rx={3} fill={mystery ? "#777" : "#333"} />
        <rect x={345} y={112} width={20} height={6} rx={2} fill={mystery ? "#999" : "#444"} />
        <ellipse cx={355} cy={112} rx={10} ry={3} fill={mystery ? "#AAA" : "#555"} />
        <ellipse cx={280} cy={148} rx={12} ry={8} fill={mystery ? "#888" : "#333"} />
        <ellipse cx={280} cy={146} rx={8} ry={4} fill={mystery ? "#999" : "#444"} />
        {!mystery && <g>
          <line x1={150} y1={246} x2={210} y2={246} stroke="#888" strokeWidth={2} />
          <line x1={210} y1={246} x2={210} y2={236} stroke="#888" strokeWidth={2} />
        </g>}
      </g>}
      {/* しゃりん (wheels with spokes and detail) */}
      <g style={{ opacity: hw ? 1 : 0.12, ...(hw ? wS : {}) }}>
        {isSteam
          ? [150, 180, 210, 268, 288].map((cx, i) => {
              const r = i < 3 ? 12 : 7;
              const isBig = i < 3;
              return <g key={i}>
                <circle cx={cx} cy={isBig ? 248 : 250} r={r} fill={hw ? (mystery ? "#888" : (isBig ? "#8B0000" : "#4A4A4A")) : "#d0d0d0"} />
                <circle cx={cx} cy={isBig ? 248 : 250} r={r - 1.5} fill="none" stroke={hw ? "rgba(255,255,255,0.15)" : "transparent"} strokeWidth={1} />
                <circle cx={cx} cy={isBig ? 248 : 250} r={isBig ? 3 : 2} fill={hw ? (mystery ? "#666" : "#555") : "#ccc"} />
                {isBig && hw && [0, 60, 120].map((a) => (
                  <line key={a} x1={cx} y1={248} x2={cx + Math.cos(a * Math.PI / 180) * (r - 3)} y2={248 + Math.sin(a * Math.PI / 180) * (r - 3)} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                ))}
              </g>;
            })
          : [[bx + 30, bx + 56], [bx + bw - 56, bx + bw - 30]].map((pair, gi) => (
            <g key={gi}>
              {hw && <rect x={pair[0] - 12} y={bb + 12} width={pair[1] - pair[0] + 24} height={8} rx={2.5} fill={c.bogie} />}
              {hw && <rect x={pair[0] - 12} y={bb + 12} width={pair[1] - pair[0] + 24} height={2.5} rx={1} fill="rgba(255,255,255,0.1)" />}
              {hw && <path d={`M${pair[0] - 4},${bb + 8} Q${pair[0] - 2},${bb + 6} ${pair[0]},${bb + 8} Q${pair[0] + 2},${bb + 10} ${pair[0] + 4},${bb + 8}`} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />}
              {[pair[0], pair[1]].map((cx, wi) => (
                <g key={wi}>
                  <circle cx={cx} cy={bb + 20} r={9} fill={hw ? "#2A2A2A" : "#d0d0d0"} />
                  <circle cx={cx} cy={bb + 20} r={7} fill={hw ? "#4A4A4A" : "#ddd"} />
                  <circle cx={cx} cy={bb + 20} r={3} fill={hw ? "#666" : "#e0e0e0"} />
                  <circle cx={cx} cy={bb + 20} r={1.5} fill={hw ? "#888" : "#e8e8e8"} />
                  {hw && <circle cx={cx} cy={bb + 20} r={5.5} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} />}
                </g>
              ))}
            </g>
          ))}
      </g>
      {/* Coupler detail at rear (non-steam) */}
      {hb && !isSteam && <g style={{ opacity: 0.6 }}>
        <rect x={bx - 4} y={bb + 2} width={8} height={6} rx={1.5} fill={mystery ? "#999" : "#777"} />
        <rect x={bx - 8} y={bb + 3} width={6} height={4} rx={1} fill={mystery ? "#888" : "#666"} />
      </g>}
      {mystery && hb && <g>
        <text x={200} y={by + bh / 2 + 10} textAnchor="middle" fontSize="40" fontWeight="900" fill="#fff" opacity="0.5" style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}>？</text>
        <text x={200} y={by + bh / 2 + 10} textAnchor="middle" fontSize="40" fontWeight="900" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}>？</text>
      </g>}
      {animating && (animProgress || 0) > 0.85 && <g>
        {[{ cx: 120, cy: 230 }, { cx: 170, cy: 220 }, { cx: 220, cy: 226 }, { cx: 270, cy: 222 }, { cx: 320, cy: 228 }].map((s, i) => (
          <g key={i}>
            <line x1={s.cx - 10} y1={s.cy} x2={s.cx + 10} y2={s.cy} stroke="#FFD700" strokeWidth={2.5} strokeLinecap="round"><animate attributeName="opacity" values="1;0" dur="0.6s" begin={`${i * 0.05}s`} fill="freeze" /></line>
            <line x1={s.cx} y1={s.cy - 10} x2={s.cx} y2={s.cy + 10} stroke="#FFD700" strokeWidth={2.5} strokeLinecap="round"><animate attributeName="opacity" values="1;0" dur="0.6s" begin={`${i * 0.05}s`} fill="freeze" /></line>
            <line x1={s.cx - 7} y1={s.cy - 7} x2={s.cx + 7} y2={s.cy + 7} stroke="#FFF0AA" strokeWidth={1.5} strokeLinecap="round"><animate attributeName="opacity" values="1;0" dur="0.6s" begin={`${i * 0.05}s`} fill="freeze" /></line>
            <line x1={s.cx + 7} y1={s.cy - 7} x2={s.cx - 7} y2={s.cy + 7} stroke="#FFF0AA" strokeWidth={1.5} strokeLinecap="round"><animate attributeName="opacity" values="1;0" dur="0.6s" begin={`${i * 0.05}s`} fill="freeze" /></line>
          </g>
        ))}
      </g>}
    </svg>
  );
};

export default TrainSVG;
