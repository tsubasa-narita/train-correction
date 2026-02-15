// /home/user/train-correction/src/components/running/RunCrossing.jsx
const RunCrossing = ({ visible, crossingX }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute",
      left: `${50 + crossingX * 0.15}%`,
      bottom: "22%",
      zIndex: 18,
      pointerEvents: "none",
      transform: "translateX(-50%)",
    }}>
      <svg width={70} height={130} viewBox="0 0 70 130">
        <defs>
          {/* Barrier stripe pattern */}
          <pattern id="crossBarStripe" x="0" y="0" width="8" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
            <rect width="8" height="6" fill="#FFFFFF" />
            <rect width="4" height="6" fill="#E74C3C" />
          </pattern>
        </defs>

        {/* Main pole */}
        <rect x="31" y="18" width="7" height="112" rx="2" fill="#444" />
        <rect x="31" y="18" width="7" height="112" rx="2" fill="url(#none)" opacity="0" />
        {/* Pole base plate */}
        <rect x="25" y="122" width="20" height="6" rx="2" fill="#555" />

        {/* Warning bell housing (top circle bracket) */}
        <rect x="28" y="22" width="13" height="8" rx="3" fill="#555" />
        <circle cx="34.5" cy="26" r="4" fill="#666" stroke="#444" strokeWidth="0.5" />
        {/* Bell clapper */}
        <line x1="34.5" y1="26" x2="34.5" y2="30" stroke="#888" strokeWidth="1" strokeLinecap="round">
          <animate attributeName="x2" values="33;36;33" dur="0.3s" repeatCount="indefinite" />
        </line>

        {/* X-shaped warning sign */}
        <g transform="translate(34.5, 44)">
          {/* X boards */}
          <rect x="-18" y="-2.5" width="36" height="5" rx="1.5" fill="#FFD814" stroke="#333" strokeWidth="0.6"
            transform="rotate(45)" />
          <rect x="-18" y="-2.5" width="36" height="5" rx="1.5" fill="#FFD814" stroke="#333" strokeWidth="0.6"
            transform="rotate(-45)" />
          {/* Center circle */}
          <circle cx="0" cy="0" r="5" fill="#FFD814" stroke="#333" strokeWidth="0.6" />
        </g>

        {/* Dual alternating lights */}
        {/* Left light */}
        <circle cx="22" cy="60" r="6" fill="#333" stroke="#222" strokeWidth="0.5" />
        <circle cx="22" cy="60" r="4.5" fill="#E74C3C">
          <animate attributeName="opacity" values="1;0.1;1" dur="0.7s" repeatCount="indefinite" />
        </circle>
        {/* Right light (opposite phase) */}
        <circle cx="47" cy="60" r="6" fill="#333" stroke="#222" strokeWidth="0.5" />
        <circle cx="47" cy="60" r="4.5" fill="#E74C3C">
          <animate attributeName="opacity" values="0.1;1;0.1" dur="0.7s" repeatCount="indefinite" />
        </circle>
        {/* Light housing bracket */}
        <rect x="22" y="56" width="25" height="2" rx="1" fill="#444" />

        {/* Barrier arm (horizontal bar with red/white stripes) */}
        <g transform="translate(38, 72)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 0 0; -80 0 0"
            dur="1.5s"
            fill="freeze"
          />
          {/* Arm pivot */}
          <circle cx="0" cy="0" r="3" fill="#666" stroke="#444" strokeWidth="0.5" />
          {/* Barrier bar */}
          <rect x="0" y="-3" width="55" height="6" rx="2" fill="url(#crossBarStripe)" stroke="#333" strokeWidth="0.4" />
          {/* Counterweight */}
          <rect x="-12" y="-2.5" width="12" height="5" rx="1.5" fill="#555" />
          {/* End weight */}
          <circle cx="55" cy="0" r="2.5" fill="#E74C3C" />
        </g>
      </svg>

      {/* Kankan text */}
      <div style={{
        fontSize: "0.85rem", fontWeight: 900, color: "#E74C3C",
        fontFamily: "'Zen Maru Gothic', sans-serif", letterSpacing: 3,
        textAlign: "center", animation: "kankankan 0.3s ease infinite alternate",
        marginTop: -4, textShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }}>カンカン</div>
    </div>
  );
};

export default RunCrossing;
