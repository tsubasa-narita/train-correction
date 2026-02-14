import { NOSE_FNS, NOSE_TIP_X } from "../../data/trains";

// ============ RunTrainSVG (compact for running/passing) ============
// flip: CSS scaleX for HTML contexts
// svgFlip: SVG transform for nested SVG contexts
const RunTrainSVG = ({ train: t, flip, svgFlip, scaleY, hideTrack }) => {
  const id = `run-${t.id}${flip || svgFlip ? "-f" : ""}`;
  const isSteam = t.kind === "steam";
  const nosePath = NOSE_FNS[t.noseType]();
  const tipX = NOSE_TIP_X[t.noseType];
  const bx = 70, by = isSteam ? 145 : 128, bw = 250, bh = isSteam ? 73 : 100, bb = by + bh;
  const wins = isSteam
    ? [{ x: 88, y: 155, w: 22, h: 16 }]
    : t.kind === "commuter"
      ? [0, 1, 2, 3, 4, 5].map((i) => ({ x: 90 + i * 36, y: 140, w: 24, h: 26 }))
      : [0, 1, 2, 3, 4].map((i) => ({ x: 100 + i * 40, y: 142, w: 26, h: 22 }));
  const cwx = t.noseType === "flat" ? 308 : 300;
  const cww = t.noseType === "flat" ? 18 : 20;
  const txf = flip ? "scaleX(-1)" : "none";
  const innerTransform = svgFlip ? "translate(480,0) scale(-1,1)" : null;

  return (
    <svg viewBox="0 0 480 275" style={{ width: "100%", height: "auto", display: "block", overflow: "visible", transform: svgFlip ? "none" : txf }}>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.body} /><stop offset="100%" stopColor={t.bodyLo} /></linearGradient>
        <linearGradient id={`sh-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.35)" /><stop offset="100%" stopColor="rgba(0,0,0,0.05)" /></linearGradient>
        <clipPath id={`bc-${id}`}><rect x={bx} y={by} width={bw} height={bh} rx={isSteam ? 4 : 10} /><path d={nosePath} /></clipPath>
        <filter id={`sd-${id}`}><feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.15" /></filter>
      </defs>
      <g transform={innerTransform || undefined}>
        {!hideTrack && <g><rect x={0} y={250} width={480} height={3.5} rx={1.5} fill="#8B7355" /><rect x={0} y={261} width={480} height={3.5} rx={1.5} fill="#8B7355" /></g>}
        {isSteam && <g><rect x={160} y={148} width={195} height={70} rx={35} fill="#222" /><rect x={340} y={145} width={25} height={73} rx={4} fill="#2A2A2A" /><rect x={348} y={115} width={14} height={33} rx={3} fill="#333" /><rect x={345} y={112} width={20} height={6} rx={2} fill="#444" /><ellipse cx={280} cy={148} rx={12} ry={8} fill="#333" /><ellipse cx={355} cy={105} rx={10} ry={7} fill="#AAA" opacity={0.35}><animate attributeName="cy" values="105;60" dur="2.5s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.35;0" dur="2.5s" repeatCount="indefinite" /></ellipse></g>}
        <rect x={bx + 8} y={bb} width={bw - 16} height={12} rx={2} fill={t.under} />
        <rect x={bx + 4} y={bb + 8} width={bw - 8} height={8} rx={2} fill={t.skirt} />
        <g filter={`url(#sd-${id})`}>
          <rect x={bx} y={by} width={bw} height={bh} rx={isSteam ? 4 : 10} fill={`url(#bg-${id})`} />
          <path d={nosePath} fill={t.nose} />
          {!isSteam && <path d={`M${bx},${by + 4} Q${bx - 12},${by + bh / 2} ${bx},${bb - 4}`} fill={t.bodyLo} />}
          {!isSteam && <circle cx={bx - 5} cy={by + bh / 2} r={5} fill={t.under} stroke={t.bodyLo} strokeWidth={1.5} />}
          <g clipPath={`url(#bc-${id})`}>
            <rect x={bx - 20} y={by} width={bw + tipX - bx + 20} height={bh} fill={`url(#sh-${id})`} />
            <rect x={bx - 20} y={t.stripe1Y} width={tipX - bx + 30} height={t.stripe1W} fill={t.stripe1} />
            {t.stripe2 && <rect x={bx - 20} y={t.stripe2Y} width={tipX - bx + 30} height={t.stripe2W} fill={t.stripe2} />}
            <rect x={bx - 5} y={by - 2} width={bw + tipX - bx + 15} height={14} rx={5} fill={t.roof} />
          </g>
          <ellipse cx={isSteam ? tipX + 2 : tipX - 4} cy={isSteam ? 155 : 170} rx={t.hlW / 2} ry={t.hlH / 2} fill="#FFFBE0" />
          <ellipse cx={isSteam ? tipX + 2 : tipX - 4} cy={isSteam ? 155 : 170} rx={t.hlW / 2 + 5} ry={t.hlH / 2 + 4} fill="#FFFBE0" opacity={0.2}><animate attributeName="opacity" values="0.2;0.45;0.2" dur="0.8s" repeatCount="indefinite" /></ellipse>
          {!isSteam && <rect x={bx - 8} y={185} width={6} height={3.5} rx={1.5} fill="#E74C3C" opacity={0.85} />}
        </g>
        {!isSteam && <g><line x1={bx + 70} y1={by + 14} x2={bx + 70} y2={bb - 2} stroke="rgba(0,0,0,0.1)" strokeWidth={2} /><line x1={bx + 170} y1={by + 14} x2={bx + 170} y2={bb - 2} stroke="rgba(0,0,0,0.1)" strokeWidth={2} /></g>}
        {wins.map((w, i) => (<g key={i}><rect x={w.x} y={w.y} width={w.w} height={w.h} rx={3} fill={t.winBg} /><rect x={w.x + 1.5} y={w.y + 1.5} width={w.w - 3} height={w.h - 3} rx={2} fill={t.window} /></g>))}
        {!isSteam && <g><rect x={cwx} y={144} width={cww} height={18} rx={3} fill={t.winBg} /><rect x={cwx + 1.5} y={145.5} width={cww - 3} height={15} rx={2} fill="#88C8FF" /></g>}
        {isSteam
          ? [150, 180, 210, 268, 288].map((cx, i) => (<circle key={i} cx={cx} cy={i < 3 ? 248 : 250} r={i < 3 ? 12 : 7} fill={i < 3 ? "#8B0000" : "#4A4A4A"} />))
          : [[bx + 30, bx + 56], [bx + bw - 56, bx + bw - 30]].map((pair, gi) => (
            <g key={gi}>
              <rect x={pair[0] - 10} y={bb + 12} width={pair[1] - pair[0] + 20} height={7} rx={2} fill={t.bogie} />
              {[pair[0], pair[1]].map((cx, wi) => (
                <g key={wi}>
                  <circle cx={cx} cy={bb + 20} r={8.5} fill="#3A3A3A" />
                  <circle cx={cx} cy={bb + 20} r={6} fill="#5A5A5A" />
                  <circle cx={cx} cy={bb + 20} r={2} fill="#888" />
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${bb + 20}`} to={`360 ${cx} ${bb + 20}`} dur="0.25s" repeatCount="indefinite" />
                </g>
              ))}
            </g>
          ))}
        {!isSteam && t.noseType !== "flat" && <g opacity={0.5}><line x1={200} y1={by} x2={195} y2={by - 14} stroke="#666" strokeWidth={2} /><line x1={205} y1={by} x2={210} y2={by - 14} stroke="#666" strokeWidth={2} /><line x1={192} y1={by - 14} x2={213} y2={by - 14} stroke="#555" strokeWidth={2.5} /><line x1={198} y1={by - 24} x2={208} y2={by - 24} stroke="#444" strokeWidth={2} /></g>}
      </g>
    </svg>
  );
};

export default RunTrainSVG;
