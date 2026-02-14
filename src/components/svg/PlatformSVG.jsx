import { useMemo } from "react";
import RunTrainSVG from "./RunTrainSVG";

// ============ Station Platform SVG ============
const PlatformSVG = ({ showTrain, train, trainOffsetX, coupled, coupledTrain, doorsLabel, stationLabel, sublabel, boardText, children }) => {
  // Unique gradient IDs per instance to avoid SVG ID collisions
  const pid = useMemo(() => "pl" + Math.random().toString(36).slice(2, 7), []);

  return (
    <svg viewBox="0 0 480 320" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}>
      <defs>
        <linearGradient id={`${pid}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" /><stop offset="60%" stopColor="#B0E0FF" /><stop offset="100%" stopColor="#D8E8F0" />
        </linearGradient>
        <linearGradient id={`${pid}e`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D0C8B8" /><stop offset="100%" stopColor="#A09080" />
        </linearGradient>
        <linearGradient id={`${pid}t`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8E0D4" /><stop offset="40%" stopColor="#DDD5C8" /><stop offset="100%" stopColor="#D0C8BC" />
        </linearGradient>
        <linearGradient id={`${pid}r`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#606870" /><stop offset="100%" stopColor="#505058" />
        </linearGradient>
        <pattern id={`${pid}b`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.5" fill="#9A9080" opacity="0.5" />
          <circle cx="12" cy="11" r="2" fill="#7A7060" opacity="0.4" />
          <circle cx="8" cy="15" r="1.5" fill="#8A8070" opacity="0.45" />
        </pattern>
      </defs>

      <rect x={0} y={0} width={480} height={200} fill={`url(#${pid}s)`} />

      {[20, 60, 95, 140, 180, 230, 280, 330, 370, 410, 440].map((x, i) => {
        const h = 25 + (i * 17) % 35;
        const w = 18 + (i * 11) % 16;
        return <rect key={`b${i}`} x={x} y={118 - h} width={w} height={h} rx={1} fill={["#B8C4D0", "#A0AABB", "#C0C8D4"][i % 3]} opacity={0.4} />;
      })}

      <rect x={10} y={45} width={460} height={8} rx={2} fill={`url(#${pid}r)`} />
      <rect x={10} y={53} width={460} height={2} fill="#484850" />
      {[...Array(23)].map((_, i) => (
        <rect key={`rp${i}`} x={10 + i * 20} y={46} width={18} height={6} rx={1} fill={i % 2 === 0 ? "#586068" : "#505860"} opacity={0.6} />
      ))}
      {[40, 130, 220, 310, 400].map((x, i) => (
        <g key={`pil${i}`}>
          <rect x={x} y={55} width={7} height={148} fill="#6B6B72" />
          <rect x={x - 2} y={55} width={11} height={5} rx={1} fill="#787880" />
          <rect x={x - 2} y={198} width={11} height={5} rx={1} fill="#787880" />
        </g>
      ))}

      <rect x={0} y={203} width={480} height={42} fill={`url(#${pid}t)`} />
      {[...Array(24)].map((_, i) => (
        <line key={`tl${i}`} x1={i * 20} y1={203} x2={i * 20} y2={245} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
      ))}
      <line x1={0} y1={222} x2={480} y2={222} stroke="rgba(0,0,0,0.05)" strokeWidth={1} />
      <rect x={0} y={200} width={480} height={4} rx={1} fill="#FFD814" />
      {[...Array(48)].map((_, i) => (
        <circle key={`td${i}`} cx={5 + i * 10} cy={198} r={2} fill="#FFD814" opacity={0.7} />
      ))}
      <rect x={0} y={245} width={480} height={12} fill={`url(#${pid}e)`} />
      <line x1={0} y1={245} x2={480} y2={245} stroke="rgba(0,0,0,0.15)" strokeWidth={1} />

      <rect x={0} y={257} width={480} height={63} fill="#8B8070" />
      <rect x={0} y={257} width={480} height={63} fill={`url(#${pid}b)`} />
      <rect x={0} y={275} width={480} height={3.5} rx={1} fill="#5A5040" />
      <rect x={0} y={275} width={480} height={1.5} rx={0.5} fill="#8A7860" />
      <rect x={0} y={290} width={480} height={3.5} rx={1} fill="#5A5040" />
      <rect x={0} y={290} width={480} height={1.5} rx={0.5} fill="#8A7860" />
      {[...Array(32)].map((_, i) => (
        <rect key={`tie${i}`} x={5 + i * 15} y={272} width={8} height={24} rx={1} fill="#6A6050" opacity={0.7} />
      ))}

      <g transform="translate(200, 62)">
        <rect x={0} y={0} width={80} height={4} fill="#666" />
        <rect x={10} y={4} width={2} height={12} fill="#888" />
        <rect x={68} y={4} width={2} height={12} fill="#888" />
        <rect x={2} y={16} width={76} height={36} rx={4} fill="#fff" stroke="#444" strokeWidth={1.5} />
        <text x={40} y={29} textAnchor="middle" fontSize={6} fill="#aaa" fontWeight={700}>{sublabel || "えき"}</text>
        <text x={40} y={42} textAnchor="middle" fontSize={11} fill="#333" fontWeight={900} fontFamily="'Zen Maru Gothic', sans-serif">{stationLabel || ""}</text>
      </g>

      <g transform="translate(350, 172)">
        <rect x={0} y={18} width={40} height={3} rx={1} fill="#8B6040" />
        <rect x={2} y={10} width={36} height={3} rx={1} fill="#9B7050" />
        <rect x={3} y={13} width={2} height={15} fill="#6A4828" />
        <rect x={35} y={13} width={2} height={15} fill="#6A4828" />
        <rect x={18} y={13} width={2} height={15} fill="#6A4828" />
      </g>

      <g transform="translate(60, 130)">
        <rect x={0} y={0} width={22} height={72} rx={2} fill="#CC3333" />
        <rect x={2} y={4} width={18} height={30} rx={1} fill="#FFE8D0" />
        <rect x={5} y={8} width={4} height={6} rx={1} fill="#E74C3C" opacity={0.6} />
        <rect x={12} y={8} width={4} height={6} rx={1} fill="#3498DB" opacity={0.6} />
        <rect x={5} y={18} width={4} height={6} rx={1} fill="#2ECC71" opacity={0.6} />
        <rect x={12} y={18} width={4} height={6} rx={1} fill="#F39C12" opacity={0.6} />
        <rect x={3} y={40} width={16} height={8} rx={1} fill="#222" />
      </g>

      <g transform="translate(145, 80)">
        <rect x={0} y={0} width={60} height={28} rx={3} fill="#1A1A2A" />
        <rect x={2} y={2} width={56} height={24} rx={2} fill="#0A0A1A" />
        <text x={30} y={12} textAnchor="middle" fontSize={5} fill="#FF8800" fontWeight={700}>{train ? train.name : ""}</text>
        <text x={30} y={21} textAnchor="middle" fontSize={4.5} fill="#00FF88" fontWeight={600}>{boardText || "まもなく はっしゃ"}</text>
      </g>

      {/* Train on track */}
      {showTrain && (() => {
        if (coupled && coupledTrain) {
          return (
            <g transform={`translate(${trainOffsetX || 0},0)`}>
              <g transform="translate(-30, 120) scale(0.38)">
                <RunTrainSVG train={coupledTrain} svgFlip hideTrack />
              </g>
              <g transform="translate(145, 120) scale(0.38)">
                <RunTrainSVG train={train} hideTrack />
              </g>
            </g>
          );
        }
        return (
          <g transform={`translate(${trainOffsetX || 0},0)`}>
            <g transform="translate(30, 100) scale(0.55)">
              <RunTrainSVG train={train} hideTrack />
            </g>
          </g>
        );
      })()}

      {doorsLabel && <text x={240} y={180} textAnchor="middle" fontSize={13} fill="#E74C3C" fontWeight={900} fontFamily="'Zen Maru Gothic', sans-serif" opacity={0.9}>{doorsLabel}</text>}

      {children}
    </svg>
  );
};

export default PlatformSVG;
