// ============ Depot Mini (Enhanced) ============
const DepotTrainSVG = ({ train: t }) => {
  const id = `dep-${t.id}`;
  const isSteam = t.kind === "steam";
  const isFlat = t.noseType === "flat";

  const mn = t.noseType === "e5" || t.noseType === "e6"
    ? "M135,8 C145,8 158,14 164,24 C166,28 166,32 164,36 C158,46 145,52 135,52"
    : t.noseType === "e7"
      ? "M135,8 C148,10 158,18 160,30 C158,42 148,50 135,52"
      : t.noseType === "n700"
        ? "M135,8 C144,9 154,15 160,24 C162,28 162,32 160,36 C154,45 144,51 135,52"
        : isFlat
          ? "M135,8 L145,8 Q150,8 150,15 L150,45 Q150,52 145,52 L135,52"
          : t.noseType === "steam"
            ? "M135,14 L155,14 Q160,14 160,20 L160,44 Q160,50 155,50 L135,50"
            : t.noseType === "linear"
              ? "M135,8 C150,8 168,14 176,24 C178,28 178,32 176,36 C168,46 150,52 135,52"
              : "M135,8 C150,8 165,16 172,30 C165,44 150,52 135,52";

  const ntx = t.noseType === "e5" ? 162
    : t.noseType === "e6" ? 162
    : t.noseType === "e7" ? 158
    : t.noseType === "n700" ? 158
    : t.noseType === "linear" ? 174
    : isFlat ? 148
    : t.noseType === "steam" ? 158
    : 170;

  return (
    <svg viewBox="0 0 200 62" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id={`dbg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.body} />
          <stop offset="100%" stopColor={t.bodyLo} />
        </linearGradient>
        <linearGradient id={`dhl-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={`dwg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8E0FF" />
          <stop offset="100%" stopColor="#5A8CAA" />
        </linearGradient>
        <clipPath id={`dc-${id}`}>
          <rect x={15} y={8} width={120} height={44} rx={isSteam ? 3 : 7} />
          <path d={mn} />
        </clipPath>
      </defs>

      {/* Ballast / ground */}
      <rect x={0} y={54} width={200} height={8} rx={1} fill="#C8B898" />
      {/* Rails */}
      <rect x={0} y={55} width={200} height={1.8} rx={0.5} fill="#8B7355" />
      <rect x={0} y={59} width={200} height={1.8} rx={0.5} fill="#8B7355" />
      {/* Rail shine */}
      <rect x={0} y={55} width={200} height={0.6} fill="#A09070" opacity="0.5" />
      <rect x={0} y={59} width={200} height={0.6} fill="#A09070" opacity="0.5" />
      {/* Sleepers */}
      {[0, 16, 32, 48, 64, 80, 96, 112, 128, 144, 160, 176, 192].map((sx) => (
        <rect key={sx} x={sx} y={54.5} width={6} height={7} rx={0.5} fill="#9E8B70" opacity="0.4" />
      ))}

      {/* Underframe */}
      <rect x={18} y={48} width={116} height={5} rx={1.5} fill={t.under} />
      {/* Underframe equipment bumps */}
      <rect x={40} y={49} width={12} height={3} rx={1} fill={t.under} opacity="0.6" />
      <rect x={80} y={49} width={16} height={3} rx={1} fill={t.under} opacity="0.6" />

      {/* Body */}
      <rect x={15} y={8} width={120} height={44} rx={isSteam ? 3 : 7} fill={`url(#dbg-${id})`} />
      {/* Nose */}
      <path d={mn} fill={t.nose} />
      {/* Body highlight overlay */}
      <rect x={15} y={8} width={120} height={44} rx={isSteam ? 3 : 7} fill={`url(#dhl-${id})`} />
      <path d={mn} fill={`url(#dhl-${id})`} />

      {/* Stripes, roof clipped */}
      <g clipPath={`url(#dc-${id})`}>
        <rect x={0} y={30} width={200} height={t.stripe1W * 0.8} fill={t.stripe1} />
        {t.stripe2 && <rect x={0} y={30 + t.stripe1W * 0.8 + 1} width={200} height={t.stripe2W * 0.7} fill={t.stripe2} />}
        <rect x={0} y={4} width={200} height={7} rx={3} fill={t.roof} />
        {/* Roof AC unit bumps */}
        {!isSteam && [35, 65, 95].map((ax) => (
          <rect key={ax} x={ax} y={5} width={8} height={2.5} rx={1} fill={t.roof} opacity="0.5" />
        ))}
      </g>

      {/* Panel seam lines */}
      {!isSteam && [50, 80, 110].map((lx) => (
        <line key={lx} x1={lx} y1={10} x2={lx} y2={50} stroke="#000" strokeWidth="0.3" opacity="0.08" />
      ))}

      {/* Windows */}
      {!isSteam && [0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={28 + i * 30} y={16} width={18} height={12} rx={2.5} fill={`url(#dwg-${id})`} stroke={t.winFrame} strokeWidth={1} />
          {/* Window reflection glint */}
          <rect x={29 + i * 30} y={17} width={6} height={2} rx={1} fill="#fff" opacity="0.3" />
        </g>
      ))}
      {isSteam && (
        <g>
          <rect x={28} y={18} width={14} height={10} rx={2} fill={t.window} stroke={t.winFrame} strokeWidth={0.8} />
          <rect x={29} y={19} width={4} height={2} rx={0.5} fill="#fff" opacity="0.25" />
        </g>
      )}

      {/* Door outlines */}
      {!isSteam && (
        <g opacity="0.15">
          <rect x={62} y={20} width={10} height={28} rx={1} stroke="#000" strokeWidth="0.5" fill="none" />
          <rect x={100} y={20} width={10} height={28} rx={1} stroke="#000" strokeWidth="0.5" fill="none" />
        </g>
      )}

      {/* Headlight with glow */}
      <ellipse cx={ntx} cy={30} rx={3} ry={2.2} fill="#FFFBE0" />
      <ellipse cx={ntx} cy={30} rx={2} ry={1.4} fill="#FFF" opacity="0.8" />
      <ellipse cx={ntx} cy={30} rx={5} ry={3.5} fill="#FFFBE0" opacity="0.15" />

      {/* Tail light */}
      <circle cx={12} cy={34} r={2} fill="#CC3333" />
      <circle cx={12} cy={34} r={1.2} fill="#FF5555" opacity="0.7" />

      {/* Coupler */}
      <rect x={6} y={38} width={8} height={4} rx={1} fill="#666" />
      <rect x={4} y={39} width={3} height={2} rx={0.5} fill="#555" />

      {/* Wheels with detail */}
      {isSteam
        ? [30, 48, 66, 100, 115].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy={56} r={i < 3 ? 5 : 3.5} fill={i < 3 ? "#8B0000" : "#4A4A4A"} />
            <circle cx={cx} cy={56} r={i < 3 ? 3.5 : 2.2} fill={i < 3 ? "#6B0000" : "#3A3A3A"} />
            <circle cx={cx} cy={56} r={i < 3 ? 1.5 : 1} fill="#888" />
            {/* SL spokes */}
            {i < 3 && [0, 45, 90, 135].map((a) => (
              <line key={a} x1={cx} y1={56} x2={cx + Math.cos(a * Math.PI / 180) * 4} y2={56 + Math.sin(a * Math.PI / 180) * 4} stroke="#999" strokeWidth="0.5" />
            ))}
          </g>
        ))
        : [32, 50, 104, 122].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy={56} r={4} fill="#444" />
            <circle cx={cx} cy={56} r={2.8} fill="#333" />
            <circle cx={cx} cy={56} r={1.2} fill="#666" />
            {/* Brake disc ring */}
            <circle cx={cx} cy={56} r={3.4} fill="none" stroke="#555" strokeWidth="0.4" />
          </g>
        ))}

      {/* SL extras */}
      {isSteam && (
        <g>
          {/* Chimney */}
          <rect x={148} y={2} width={8} height={14} rx={2} fill="#333" />
          <rect x={147} y={1} width={10} height={3} rx={1.5} fill="#444" />
          {/* Steam dome */}
          <ellipse cx={120} cy={8} rx={6} ry={4} fill="#2A2A2A" />
          {/* Boiler highlight */}
          <rect x={40} y={14} width={95} height={2} rx={1} fill="#fff" opacity="0.08" />
          {/* Connecting rod */}
          <line x1={30} y1={56} x2={66} y2={56} stroke="#777" strokeWidth="1.2" />
        </g>
      )}

      {/* Pantograph for shinkansen */}
      {!isSteam && t.kind !== "commuter" && (
        <g opacity="0.6">
          <line x1={70} y1={6} x2={70} y2={0} stroke="#666" strokeWidth="0.8" />
          <line x1={65} y1={0} x2={75} y2={0} stroke="#666" strokeWidth="0.8" />
          <line x1={67} y1={6} x2={70} y2={2} stroke="#666" strokeWidth="0.6" />
          <line x1={73} y1={6} x2={70} y2={2} stroke="#666" strokeWidth="0.6" />
        </g>
      )}
    </svg>
  );
};

export default DepotTrainSVG;
