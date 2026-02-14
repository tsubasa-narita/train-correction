// ============ Depot Mini ============
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
        <linearGradient id={`dbg-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.body} /><stop offset="100%" stopColor={t.bodyLo} /></linearGradient>
        <clipPath id={`dc-${id}`}><rect x={15} y={8} width={120} height={44} rx={isSteam ? 3 : 7} /><path d={mn} /></clipPath>
      </defs>
      <rect x={0} y={55} width={200} height={2} rx={1} fill="#8B7355" />
      <rect x={0} y={59} width={200} height={2} rx={1} fill="#8B7355" />
      <rect x={18} y={48} width={116} height={5} rx={1.5} fill={t.under} />
      <rect x={15} y={8} width={120} height={44} rx={isSteam ? 3 : 7} fill={`url(#dbg-${id})`} />
      <path d={mn} fill={t.nose} />
      <g clipPath={`url(#dc-${id})`}>
        <rect x={0} y={30} width={200} height={t.stripe1W * 0.8} fill={t.stripe1} />
        {t.stripe2 && <rect x={0} y={30 + t.stripe1W * 0.8 + 1} width={200} height={t.stripe2W * 0.7} fill={t.stripe2} />}
        <rect x={0} y={4} width={200} height={7} rx={3} fill={t.roof} />
      </g>
      {!isSteam && [0, 1, 2].map((i) => <rect key={i} x={28 + i * 30} y={16} width={18} height={12} rx={2.5} fill={t.window} stroke={t.winFrame} strokeWidth={1} />)}
      {isSteam && <rect x={28} y={18} width={14} height={10} rx={2} fill={t.window} />}
      <ellipse cx={ntx} cy={30} rx={2.5} ry={2} fill="#FFFBE0" />
      <circle cx={12} cy={30} r={2.5} fill="#AAA" />
      {isSteam
        ? [30, 48, 66, 100, 115].map((cx, i) => <circle key={i} cx={cx} cy={56} r={i < 3 ? 5 : 3.5} fill={i < 3 ? "#8B0000" : "#4A4A4A"} />)
        : [32, 50, 104, 122].map((cx, i) => <circle key={i} cx={cx} cy={56} r={4} fill="#444" />)}
      {isSteam && <rect x={148} y={2} width={8} height={14} rx={2} fill="#333" />}
    </svg>
  );
};

export default DepotTrainSVG;
