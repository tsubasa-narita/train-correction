import { NOSE_FNS, NOSE_TIP_X } from "../../data/trains";
import { getSteps } from "../../data/gameSteps";

// ============ TrainSVG (collect screen, from v10) ============
const TrainSVG = ({ train: t, parts, animating, animProgress, stepCount, mystery }) => {
  const id = t.id;
  // Mystery mode: replace all colors with grays to hide identity
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
  // If step is not in current set, auto-show when body is present
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
  // Door positions between windows
  let doors = isSteam ? [] : [{ x: 83, y: 140, w: 14, h: 44 }, { x: 215, y: 140, w: 14, h: 44 }];
  if (t.kind === "commuter") doors = [{ x: 78, y: 138, w: 12, h: 48 }, { x: 150, y: 138, w: 12, h: 48 }, { x: 222, y: 138, w: 12, h: 48 }];

  return (
    <svg viewBox="0 0 480 275" style={{ width: "100%", maxWidth: 480, height: "auto", display: "block", margin: "0 auto", overflow: "visible" }}>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.body} /><stop offset="100%" stopColor={c.bodyLo} /></linearGradient>
        <clipPath id={`bc-${id}`}><rect x={bx} y={by} width={bw} height={bh} rx={isSteam ? 4 : 10} /><path d={nosePath} /></clipPath>
        <filter id={`sd-${id}`}><feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.15" /></filter>
      </defs>
      {/* せんろ */}
      <g style={{ opacity: ht ? 1 : 0.12, ...(ht && tS.opacity !== undefined ? { opacity: tS.opacity } : {}) }}>
        <rect x={0} y={250} width={480} height={3.5} rx={1.5} fill={ht ? "#8B7355" : "#ddd"} /><rect x={0} y={261} width={480} height={3.5} rx={1.5} fill={ht ? "#8B7355" : "#ddd"} />
        {[...Array(20)].map((_, i) => <rect key={i} x={4 + i * 24} y={247} width={8} height={20} rx={1.5} fill={ht ? "#A0926B" : "#e8e8e8"} />)}
      </g>
      {/* 台車・スカート (ボディ依存) */}
      <g style={{ opacity: hb ? 1 : 0.12, ...(hb ? bS : {}) }}><rect x={bx + 8} y={bb} width={bw - 16} height={12} rx={2} fill={hb ? c.under : "#ddd"} /><rect x={bx + 4} y={bb + 8} width={bw - 8} height={8} rx={2} fill={hb ? c.skirt : "#e8e8e8"} /></g>
      {/* ボディ本体 */}
      <g style={{ opacity: hb ? 1 : 0.12, ...(hb ? bS : {}) }} filter={hb ? `url(#sd-${id})` : undefined}>
        <rect x={bx} y={by} width={bw} height={bh} rx={isSteam ? 4 : 10} fill={hb ? `url(#bg-${id})` : "#e8e8e8"} /><path d={nosePath} fill={hb ? c.nose : "#e0e0e0"} />
        {hb && <g clipPath={`url(#bc-${id})`}><rect x={bx - 20} y={t.stripe1Y} width={tipX - bx + 30} height={t.stripe1W} fill={c.stripe1} />{t.stripe2 && <rect x={bx - 20} y={t.stripe2Y} width={tipX - bx + 30} height={t.stripe2W} fill={c.stripe2} />}</g>}
        {hb && <ellipse cx={isSteam ? tipX + 2 : tipX - 4} cy={isSteam ? 155 : 170} rx={t.hlW / 2} ry={t.hlH / 2} fill={c.headlight} />}
      </g>
      {/* やね (独立描画) */}
      <g style={{ opacity: showRoof ? 1 : 0.12, ...(showRoof ? roofS : {}) }}>
        {hb
          ? <g clipPath={`url(#bc-${id})`}><rect x={bx - 5} y={by - 2} width={bw + tipX - bx + 15} height={14} rx={5} fill={showRoof ? c.roof : "#ddd"} /></g>
          : <rect x={bx} y={by} width={bw} height={14} rx={isSteam ? 4 : 8} fill={showRoof ? c.roof : "#ddd"} />}
      </g>
      {/* まど */}
      <g style={{ opacity: hwin ? 1 : 0.12, ...(hwin ? winS : {}) }}>
        {wins.map((w, i) => (<g key={i}><rect x={w.x} y={w.y} width={w.w} height={w.h} rx={3} fill={hwin ? c.winBg : "#ddd"} /><rect x={w.x + 1.5} y={w.y + 1.5} width={w.w - 3} height={w.h - 3} rx={2} fill={hwin ? c.window : "#e5e5e5"} /></g>))}
      </g>
      {/* ドア (独立描画) */}
      {doors.length > 0 && <g style={{ opacity: showDoors ? 1 : 0.12, ...(showDoors ? doorS : {}) }}>
        {doors.map((d, i) => (<g key={`d${i}`}>
          <rect x={d.x} y={d.y} width={d.w} height={d.h} rx={2} fill={showDoors ? (c.bodyLo || "#C8C8C8") : "#ddd"} stroke={showDoors ? "rgba(0,0,0,0.15)" : "#ccc"} strokeWidth={1} />
          <line x1={d.x + d.w / 2} y1={d.y + 4} x2={d.x + d.w / 2} y2={d.y + d.h - 4} stroke={showDoors ? "rgba(0,0,0,0.12)" : "#ccc"} strokeWidth={0.8} />
          <rect x={d.x + d.w - 3.5} y={d.y + d.h / 2 - 2} width={2} height={4} rx={0.5} fill={showDoors ? "#999" : "#ccc"} />
        </g>))}
      </g>}
      {/* パンタグラフ (新幹線・通勤電車のみ) */}
      {!isSteam && <g style={{ opacity: showPan ? 1 : 0.12, ...(showPan ? panS : {}) }}>
        <g transform="translate(200, 0)">
          <rect x={-6} y={by - 2} width={12} height={5} rx={1.5} fill={showPan ? "#555" : "#ccc"} />
          <line x1={0} y1={by - 2} x2={-10} y2={by - 28} stroke={showPan ? "#666" : "#ccc"} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={0} y1={by - 2} x2={10} y2={by - 28} stroke={showPan ? "#666" : "#ccc"} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={-10} y1={by - 28} x2={-4} y2={by - 48} stroke={showPan ? "#777" : "#ccc"} strokeWidth={2} strokeLinecap="round" />
          <line x1={10} y1={by - 28} x2={4} y2={by - 48} stroke={showPan ? "#777" : "#ccc"} strokeWidth={2} strokeLinecap="round" />
          <rect x={-14} y={by - 52} width={28} height={3} rx={1} fill={showPan ? "#444" : "#bbb"} />
          <line x1={-3} y1={by - 10} x2={-8} y2={by - 20} stroke={showPan ? "#888" : "#ccc"} strokeWidth={1} strokeDasharray="2,2" />
          <line x1={3} y1={by - 10} x2={8} y2={by - 20} stroke={showPan ? "#888" : "#ccc"} strokeWidth={1} strokeDasharray="2,2" />
          {showPan && <line x1={-80} y1={by - 54} x2={80} y2={by - 54} stroke="#333" strokeWidth={1.5} opacity={0.3} />}
        </g>
      </g>}
      {/* しゃりん */}
      <g style={{ opacity: hw ? 1 : 0.12, ...(hw ? wS : {}) }}>
        {isSteam
          ? [150, 180, 210, 268, 288].map((cx, i) => <circle key={i} cx={cx} cy={i < 3 ? 248 : 250} r={i < 3 ? 12 : 7} fill={hw ? (mystery ? "#888" : (i < 3 ? "#8B0000" : "#4A4A4A")) : "#d0d0d0"} />)
          : [[bx + 30, bx + 56], [bx + bw - 56, bx + bw - 30]].map((pair, gi) => (
            <g key={gi}>
              {hw && <rect x={pair[0] - 10} y={bb + 12} width={pair[1] - pair[0] + 20} height={7} rx={2} fill={c.bogie} />}
              {[pair[0], pair[1]].map((cx, wi) => (
                <g key={wi}><circle cx={cx} cy={bb + 20} r={8.5} fill={hw ? "#3A3A3A" : "#d0d0d0"} /><circle cx={cx} cy={bb + 20} r={6} fill={hw ? "#5A5A5A" : "#ddd"} /></g>
              ))}
            </g>
          ))}
      </g>
      {/* mystery ? マーク */}
      {mystery && hb && <g>
        <text x={200} y={by + bh / 2 + 8} textAnchor="middle" fontSize="36" fontWeight="900" fill="#fff" opacity="0.6" style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}>？</text>
      </g>}
      {/* パーツゲット きらきら */}
      {animating && (animProgress || 0) > 0.85 && <g>
        {[{ cx: 140, cy: 238 }, { cx: 200, cy: 228 }, { cx: 260, cy: 234 }].map((s, i) => (
          <g key={i}>
            <line x1={s.cx - 8} y1={s.cy} x2={s.cx + 8} y2={s.cy} stroke="#FFD700" strokeWidth={2.5} strokeLinecap="round"><animate attributeName="opacity" values="1;0" dur="0.6s" fill="freeze" /></line>
            <line x1={s.cx} y1={s.cy - 8} x2={s.cx} y2={s.cy + 8} stroke="#FFD700" strokeWidth={2.5} strokeLinecap="round"><animate attributeName="opacity" values="1;0" dur="0.6s" fill="freeze" /></line>
          </g>
        ))}
      </g>}
    </svg>
  );
};

export default TrainSVG;
