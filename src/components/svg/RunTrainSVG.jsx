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
  const isModern = !isSteam;
  const hlCx = isSteam ? tipX + 2 : tipX - 4;
  const hlCy = isSteam ? 155 : 170;

  return (
    <svg viewBox="0 0 480 275" style={{ width: "100%", height: "auto", display: "block", overflow: "visible", transform: svgFlip ? "none" : txf }}>
      <defs>
        {/* Body gradient (top → bottom) */}
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.body} />
          <stop offset="100%" stopColor={t.bodyLo} />
        </linearGradient>

        {/* Highlight overlay: white at top → transparent mid → dark at bottom */}
        <linearGradient id={`hl-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.40)" />
          <stop offset="35%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0.0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
        </linearGradient>

        {/* Window reflection gradient (light blue → darker blue) */}
        <linearGradient id={`wg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#88D4FF" />
          <stop offset="50%" stopColor="#5EAADD" />
          <stop offset="100%" stopColor="#3878AA" />
        </linearGradient>

        {/* Rail shine gradient */}
        <linearGradient id={`rs-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Clip path for body + nose */}
        <clipPath id={`bc-${id}`}>
          <rect x={bx} y={by} width={bw} height={bh} rx={isSteam ? 4 : 10} />
          <path d={nosePath} />
        </clipPath>

        {/* Drop shadow filter */}
        <filter id={`sd-${id}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.18" />
        </filter>

        {/* Headlight glow filter */}
        <filter id={`glow-${id}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Tail light glow filter */}
        <filter id={`tglow-${id}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="tblur" />
          <feMerge>
            <feMergeNode in="tblur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Wheel hub radial gradient */}
        <radialGradient id={`wh-${id}`} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#888" />
          <stop offset="50%" stopColor="#5A5A5A" />
          <stop offset="100%" stopColor="#3A3A3A" />
        </radialGradient>

        {/* Brake disc gradient */}
        <radialGradient id={`bd-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#777" />
          <stop offset="100%" stopColor="#555" />
        </radialGradient>
      </defs>

      <g transform={innerTransform || undefined}>

        {/* ===== Rails with shine highlights ===== */}
        {!hideTrack && (
          <g>
            {/* Rail ties (sleepers) */}
            {[...Array(24)].map((_, i) => (
              <rect key={i} x={2 + i * 20} y={252} width={10} height={14} rx={1} fill="#9E8E6E" opacity={0.3} />
            ))}
            {/* Top rail */}
            <rect x={0} y={250} width={480} height={3.5} rx={1.5} fill="#8B7355" />
            <rect x={0} y={250} width={480} height={1.5} rx={0.5} fill={`url(#rs-${id})`} />
            {/* Bottom rail */}
            <rect x={0} y={261} width={480} height={3.5} rx={1.5} fill="#8B7355" />
            <rect x={0} y={261} width={480} height={1.5} rx={0.5} fill={`url(#rs-${id})`} />
          </g>
        )}

        {/* ===== Steam locomotive boiler + chimney ===== */}
        {isSteam && (
          <g>
            {/* Boiler barrel */}
            <rect x={160} y={148} width={195} height={70} rx={35} fill="#222" />
            <rect x={160} y={148} width={195} height={25} rx={12} fill="rgba(255,255,255,0.06)" />
            {/* Cab */}
            <rect x={340} y={145} width={25} height={73} rx={4} fill="#2A2A2A" />
            {/* Chimney */}
            <rect x={348} y={115} width={14} height={33} rx={3} fill="#333" />
            <rect x={345} y={112} width={20} height={6} rx={2} fill="#444" />
            <ellipse cx={355} cy={112} rx={10} ry={3} fill="#555" />
            {/* Boiler bands */}
            <ellipse cx={280} cy={148} rx={12} ry={8} fill="#333" />
            <ellipse cx={240} cy={148} rx={10} ry={7} fill="#333" opacity={0.6} />

            {/* ===== Enhanced smoke: multiple rising ellipses ===== */}
            {/* Small puff 1 */}
            <ellipse cx={355} cy={105} rx={7} ry={5} fill="#BBB" opacity={0.3}>
              <animate attributeName="cy" values="105;55" dur="2.0s" repeatCount="indefinite" />
              <animate attributeName="rx" values="7;14" dur="2.0s" repeatCount="indefinite" />
              <animate attributeName="ry" values="5;10" dur="2.0s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0" dur="2.0s" repeatCount="indefinite" />
            </ellipse>
            {/* Medium puff 2 (delayed) */}
            <ellipse cx={358} cy={105} rx={10} ry={7} fill="#AAA" opacity={0}>
              <animate attributeName="cy" values="105;40" dur="2.8s" begin="0.6s" repeatCount="indefinite" />
              <animate attributeName="rx" values="10;20" dur="2.8s" begin="0.6s" repeatCount="indefinite" />
              <animate attributeName="ry" values="7;14" dur="2.8s" begin="0.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0" dur="2.8s" begin="0.6s" repeatCount="indefinite" />
            </ellipse>
            {/* Large puff 3 (further delayed) */}
            <ellipse cx={352} cy={105} rx={12} ry={8} fill="#C0C0C0" opacity={0}>
              <animate attributeName="cy" values="105;30" dur="3.2s" begin="1.3s" repeatCount="indefinite" />
              <animate attributeName="rx" values="12;26" dur="3.2s" begin="1.3s" repeatCount="indefinite" />
              <animate attributeName="ry" values="8;18" dur="3.2s" begin="1.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0" dur="3.2s" begin="1.3s" repeatCount="indefinite" />
            </ellipse>
            {/* Small wisp 4 */}
            <ellipse cx={356} cy={108} rx={5} ry={4} fill="#D0D0D0" opacity={0}>
              <animate attributeName="cy" values="108;65" dur="1.8s" begin="0.3s" repeatCount="indefinite" />
              <animate attributeName="cx" values="356;348" dur="1.8s" begin="0.3s" repeatCount="indefinite" />
              <animate attributeName="rx" values="5;11" dur="1.8s" begin="0.3s" repeatCount="indefinite" />
              <animate attributeName="ry" values="4;8" dur="1.8s" begin="0.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.25;0" dur="1.8s" begin="0.3s" repeatCount="indefinite" />
            </ellipse>
          </g>
        )}

        {/* ===== Underframe + skirt ===== */}
        <rect x={bx + 8} y={bb} width={bw - 16} height={12} rx={2} fill={t.under} />
        <rect x={bx + 4} y={bb + 8} width={bw - 8} height={8} rx={2} fill={t.skirt} />
        {/* Skirt highlight edge */}
        <rect x={bx + 4} y={bb + 8} width={bw - 8} height={2} rx={1} fill="rgba(255,255,255,0.15)" />

        {/* ===== Body with highlight overlay ===== */}
        <g filter={`url(#sd-${id})`}>
          {/* Base body fill */}
          <rect x={bx} y={by} width={bw} height={bh} rx={isSteam ? 4 : 10} fill={`url(#bg-${id})`} />
          {/* Nose */}
          <path d={nosePath} fill={t.nose} />
          {/* Rear coupler bulge (non-steam only) */}
          {isModern && (
            <path d={`M${bx},${by + 4} Q${bx - 12},${by + bh / 2} ${bx},${bb - 4}`} fill={t.bodyLo} />
          )}
          {isModern && (
            <circle cx={bx - 5} cy={by + bh / 2} r={5} fill={t.under} stroke={t.bodyLo} strokeWidth={1.5} />
          )}

          {/* Clipped decorations: highlight overlay, stripes, roof, panel seams */}
          <g clipPath={`url(#bc-${id})`}>
            {/* Highlight gradient overlay (white top -> dark bottom) */}
            <rect x={bx - 20} y={by} width={bw + tipX - bx + 20} height={bh} fill={`url(#hl-${id})`} />

            {/* Stripe 1 */}
            <rect x={bx - 20} y={t.stripe1Y} width={tipX - bx + 30} height={t.stripe1W} fill={t.stripe1} />
            {/* Stripe 2 */}
            {t.stripe2 && (
              <rect x={bx - 20} y={t.stripe2Y} width={tipX - bx + 30} height={t.stripe2W} fill={t.stripe2} />
            )}

            {/* Roof piece */}
            <rect x={bx - 5} y={by - 2} width={bw + tipX - bx + 15} height={14} rx={5} fill={t.roof} />
            {/* Roof highlight edge */}
            <rect x={bx - 5} y={by - 2} width={bw + tipX - bx + 15} height={3} rx={1.5} fill="rgba(255,255,255,0.15)" />

            {/* Panel seam lines for modern trains */}
            {isModern && (
              <g opacity={0.12}>
                <line x1={bx + 70} y1={by + 14} x2={bx + 70} y2={bb - 2} stroke="#000" strokeWidth={1} />
                <line x1={bx + 130} y1={by + 14} x2={bx + 130} y2={bb - 2} stroke="#000" strokeWidth={0.7} />
                <line x1={bx + 170} y1={by + 14} x2={bx + 170} y2={bb - 2} stroke="#000" strokeWidth={1} />
              </g>
            )}

            {/* Door panel separation lines visible during running */}
            {isModern && (
              <g opacity={0.1}>
                {t.kind === "commuter" ? (
                  /* Commuter: 3 door positions */
                  <>
                    <rect x={78} y={by + 14} width={12} height={bh - 16} rx={1} fill="rgba(0,0,0,0.06)" />
                    <line x1={84} y1={by + 14} x2={84} y2={bb - 2} stroke="#000" strokeWidth={0.8} />
                    <rect x={150} y={by + 14} width={12} height={bh - 16} rx={1} fill="rgba(0,0,0,0.06)" />
                    <line x1={156} y1={by + 14} x2={156} y2={bb - 2} stroke="#000" strokeWidth={0.8} />
                    <rect x={222} y={by + 14} width={12} height={bh - 16} rx={1} fill="rgba(0,0,0,0.06)" />
                    <line x1={228} y1={by + 14} x2={228} y2={bb - 2} stroke="#000" strokeWidth={0.8} />
                  </>
                ) : (
                  /* Shinkansen: 2 door positions */
                  <>
                    <rect x={83} y={by + 14} width={14} height={bh - 16} rx={1} fill="rgba(0,0,0,0.05)" />
                    <line x1={90} y1={by + 14} x2={90} y2={bb - 2} stroke="#000" strokeWidth={0.7} />
                    <rect x={215} y={by + 14} width={14} height={bh - 16} rx={1} fill="rgba(0,0,0,0.05)" />
                    <line x1={222} y1={by + 14} x2={222} y2={bb - 2} stroke="#000" strokeWidth={0.7} />
                  </>
                )}
              </g>
            )}

            {/* Bottom shadow strip */}
            <rect x={bx - 20} y={bb - 6} width={bw + tipX - bx + 20} height={6} fill="rgba(0,0,0,0.08)" />
          </g>

          {/* ===== Enhanced headlight with glow filter ===== */}
          <g filter={`url(#glow-${id})`}>
            {/* Headlight housing */}
            <ellipse cx={hlCx} cy={hlCy} rx={t.hlW / 2 + 2} ry={t.hlH / 2 + 1.5} fill="rgba(80,80,80,0.4)" />
            {/* Core headlight */}
            <ellipse cx={hlCx} cy={hlCy} rx={t.hlW / 2} ry={t.hlH / 2} fill="#FFFBE0" />
            {/* Inner bright spot */}
            <ellipse cx={hlCx} cy={hlCy} rx={t.hlW / 4} ry={t.hlH / 4} fill="#FFFFF0" opacity={0.8} />
          </g>
          {/* Headlight glow halo (pulsing) */}
          <ellipse cx={hlCx} cy={hlCy} rx={t.hlW / 2 + 8} ry={t.hlH / 2 + 6} fill="#FFFBE0" opacity={0.15}>
            <animate attributeName="opacity" values="0.12;0.28;0.12" dur="0.9s" repeatCount="indefinite" />
          </ellipse>

          {/* ===== Better tail light (rounded, with glow) ===== */}
          {isModern && (
            <g filter={`url(#tglow-${id})`}>
              <rect x={bx - 9} y={183} width={7} height={5} rx={2.5} fill="#E74C3C" opacity={0.9} />
              <rect x={bx - 8} y={184} width={5} height={3} rx={1.5} fill="#FF6B5B" opacity={0.6} />
            </g>
          )}
        </g>

        {/* ===== Windows with reflection gradient ===== */}
        {wins.map((w, i) => (
          <g key={i}>
            {/* Window frame */}
            <rect x={w.x - 1} y={w.y - 1} width={w.w + 2} height={w.h + 2} rx={3.5} fill={t.winBg} />
            {/* Window glass with reflection gradient */}
            <rect x={w.x} y={w.y} width={w.w} height={w.h} rx={3} fill={`url(#wg-${id})`} />
            {/* Sky reflection highlight on upper portion */}
            <rect x={w.x + 1} y={w.y + 1} width={w.w - 2} height={w.h * 0.35} rx={2} fill="rgba(255,255,255,0.2)" />
          </g>
        ))}

        {/* Cab window */}
        {isModern && (
          <g>
            <rect x={cwx - 1} y={143} width={cww + 2} height={20} rx={3.5} fill={t.winBg} />
            <rect x={cwx} y={144} width={cww} height={18} rx={3} fill={`url(#wg-${id})`} />
            <rect x={cwx + 1} y={145} width={cww - 2} height={6} rx={2} fill="rgba(255,255,255,0.18)" />
          </g>
        )}

        {/* ===== Coupler detail at rear ===== */}
        {isModern && (
          <g opacity={0.6}>
            {/* Coupler mounting plate */}
            <rect x={bx - 14} y={bb + 2} width={12} height={8} rx={1.5} fill="#666" />
            {/* Coupler shaft */}
            <rect x={bx - 18} y={bb + 4} width={8} height={4} rx={1} fill="#777" />
            {/* Coupler knuckle */}
            <rect x={bx - 20} y={bb + 3} width={4} height={6} rx={1} fill="#888" />
          </g>
        )}

        {/* ===== Improved wheels with hub details and brake disc hint ===== */}
        {isSteam
          ? [150, 180, 210, 268, 288].map((cx, i) => {
              const isBig = i < 3;
              const r = isBig ? 12 : 7;
              const hubR = isBig ? 3 : 2;
              return (
                <g key={i}>
                  {/* Wheel rim */}
                  <circle cx={cx} cy={isBig ? 248 : 250} r={r} fill={isBig ? "#8B0000" : "#4A4A4A"} />
                  {/* Inner rim highlight */}
                  <circle cx={cx} cy={isBig ? 248 : 250} r={r - 1.5} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                  {/* Hub center */}
                  <circle cx={cx} cy={isBig ? 248 : 250} r={hubR} fill="#555" />
                  <circle cx={cx} cy={isBig ? 248 : 250} r={1.2} fill="#777" />
                  {/* Spokes for large wheels */}
                  {isBig && [0, 45, 90, 135].map((a) => (
                    <line
                      key={a}
                      x1={cx + Math.cos(a * Math.PI / 180) * hubR}
                      y1={248 + Math.sin(a * Math.PI / 180) * hubR}
                      x2={cx + Math.cos(a * Math.PI / 180) * (r - 2)}
                      y2={248 + Math.sin(a * Math.PI / 180) * (r - 2)}
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth={1}
                    />
                  ))}
                  {/* Wheel rotation animation */}
                  <animateTransform
                    attributeName="transform" type="rotate"
                    from={`0 ${cx} ${isBig ? 248 : 250}`}
                    to={`360 ${cx} ${isBig ? 248 : 250}`}
                    dur="0.3s" repeatCount="indefinite"
                  />
                </g>
              );
            })
          : [[bx + 30, bx + 56], [bx + bw - 56, bx + bw - 30]].map((pair, gi) => (
              <g key={gi}>
                {/* Bogie frame */}
                <rect x={pair[0] - 10} y={bb + 12} width={pair[1] - pair[0] + 20} height={7} rx={2} fill={t.bogie} />
                {/* Bogie frame highlight */}
                <rect x={pair[0] - 10} y={bb + 12} width={pair[1] - pair[0] + 20} height={2} rx={1} fill="rgba(255,255,255,0.1)" />
                {/* Spring detail between bogie and body */}
                <path
                  d={`M${pair[0] - 2},${bb + 8} Q${pair[0]},${bb + 5} ${pair[0] + 2},${bb + 8}`}
                  fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1}
                />

                {[pair[0], pair[1]].map((cx, wi) => (
                  <g key={wi}>
                    {/* Outer wheel rim */}
                    <circle cx={cx} cy={bb + 20} r={9} fill="#2A2A2A" />
                    {/* Brake disc hint (darker ring) */}
                    <circle cx={cx} cy={bb + 20} r={7.5} fill={`url(#bd-${id})`} />
                    {/* Wheel face with radial gradient */}
                    <circle cx={cx} cy={bb + 20} r={6} fill={`url(#wh-${id})`} />
                    {/* Brake disc scoring lines */}
                    <circle cx={cx} cy={bb + 20} r={6.8} fill="none" stroke="rgba(200,200,200,0.12)" strokeWidth={0.5} />
                    {/* Hub detail */}
                    <circle cx={cx} cy={bb + 20} r={3} fill="#666" />
                    <circle cx={cx} cy={bb + 20} r={1.5} fill="#999" />
                    {/* Hub bolt hints */}
                    {[0, 90, 180, 270].map((a) => (
                      <circle
                        key={a}
                        cx={cx + Math.cos(a * Math.PI / 180) * 2.2}
                        cy={bb + 20 + Math.sin(a * Math.PI / 180) * 2.2}
                        r={0.5}
                        fill="#AAA"
                      />
                    ))}
                    {/* Wheel highlight arc */}
                    <circle cx={cx} cy={bb + 20} r={5.5} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} />
                    {/* Rotation animation */}
                    <animateTransform
                      attributeName="transform" type="rotate"
                      from={`0 ${cx} ${bb + 20}`}
                      to={`360 ${cx} ${bb + 20}`}
                      dur="0.25s" repeatCount="indefinite"
                    />
                  </g>
                ))}
              </g>
            ))}

        {/* ===== Pantograph (non-steam, non-flat) ===== */}
        {isModern && t.noseType !== "flat" && (
          <g opacity={0.5}>
            <line x1={200} y1={by} x2={195} y2={by - 14} stroke="#666" strokeWidth={2} />
            <line x1={205} y1={by} x2={210} y2={by - 14} stroke="#666" strokeWidth={2} />
            <line x1={192} y1={by - 14} x2={213} y2={by - 14} stroke="#555" strokeWidth={2.5} />
            <line x1={198} y1={by - 24} x2={208} y2={by - 24} stroke="#444" strokeWidth={2} />
          </g>
        )}
      </g>
    </svg>
  );
};

export default RunTrainSVG;
