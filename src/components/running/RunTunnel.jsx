// /home/user/train-correction/src/components/running/RunTunnel.jsx
const RunTunnel = ({ phase }) => {
  if (!phase) return null;

  const isEnter = phase === "enter";
  const isInside = phase === "inside";
  const isExit = phase === "exit";

  // Tunnel entrance scale grows as train approaches
  const archScale = isEnter ? 1.0 : isInside ? 1.8 : isExit ? 2.5 : 1.0;
  const overlayOpacity = isEnter ? 0.3 : isInside ? 0.92 : isExit ? 0.2 : 0;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none",
      overflow: "hidden",
    }}>
      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `rgba(0,0,0,${overlayOpacity})`,
        transition: "background 0.6s ease",
      }} />

      {/* Tunnel arch entrance SVG */}
      {(isEnter || isExit) && (
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          transform: `translate(-50%, -50%) scale(${archScale})`,
          transition: "transform 0.8s ease-in-out",
          zIndex: 51,
        }}>
          <svg width={320} height={260} viewBox="0 0 320 260">
            <defs>
              {/* Stone/brick pattern */}
              <pattern id="tunnelBrick" x="0" y="0" width="24" height="12" patternUnits="userSpaceOnUse">
                <rect width="24" height="12" fill="#5A534A" />
                <rect x="0" y="0" width="11" height="5" rx="0.5" fill="#6B635A" stroke="#4A443C" strokeWidth="0.3" />
                <rect x="13" y="0" width="11" height="5" rx="0.5" fill="#635B52" stroke="#4A443C" strokeWidth="0.3" />
                <rect x="6" y="6" width="11" height="5" rx="0.5" fill="#6B635A" stroke="#4A443C" strokeWidth="0.3" />
                <rect x="19" y="6" width="5" height="5" rx="0.5" fill="#5E564E" stroke="#4A443C" strokeWidth="0.3" />
                <rect x="0" y="6" width="4" height="5" rx="0.5" fill="#5E564E" stroke="#4A443C" strokeWidth="0.3" />
              </pattern>
              {/* Arch clip for the opening */}
              <clipPath id="tunnelArchClip">
                <rect x="0" y="0" width="320" height="260" />
              </clipPath>
              {/* Radial shadow inside arch */}
              <radialGradient id="tunnelInnerGlow" cx="50%" cy="45%" r="40%">
                <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0a0a14" stopOpacity="0.95" />
              </radialGradient>
            </defs>
            {/* Outer arch structure with brick pattern */}
            <path
              d="M0,260 L0,80 Q0,0 80,0 L240,0 Q320,0 320,80 L320,260 Z"
              fill="url(#tunnelBrick)"
            />
            {/* Inner arch opening (dark inside) */}
            <path
              d="M30,260 L30,95 Q30,25 95,25 L225,25 Q290,25 290,95 L290,260 Z"
              fill="url(#tunnelInnerGlow)"
            />
            {/* Arch keystone at the top */}
            <path
              d="M145,0 L175,0 L170,28 L150,28 Z"
              fill="#7A726A" stroke="#4A443C" strokeWidth="0.5"
            />
            {/* Arch border trim */}
            <path
              d="M30,260 L30,95 Q30,25 95,25 L225,25 Q290,25 290,95 L290,260"
              fill="none" stroke="#3E3830" strokeWidth="3"
            />
            {/* Decorative capstones along the arch */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
              const angle = -Math.PI / 2 + (Math.PI * i) / 7;
              const cx = 160 + Math.cos(angle) * 135;
              const cy = 95 + Math.sin(angle) * 72;
              if (cy > 120) return null;
              return (
                <rect
                  key={i}
                  x={cx - 5} y={cy - 3}
                  width={10} height={6} rx={1}
                  fill="#7A726A" stroke="#4A443C" strokeWidth="0.4"
                  transform={`rotate(${(angle * 180) / Math.PI + 90}, ${cx}, ${cy})`}
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Inside tunnel view */}
      {isInside && (
        <>
          {/* Light at the end of the tunnel */}
          <div style={{
            position: "absolute",
            left: "50%", top: "38%",
            transform: "translate(-50%, -50%)",
            width: 24, height: 32,
            borderRadius: "50% 50% 45% 45%",
            background: "radial-gradient(ellipse, rgba(200,220,255,0.9) 0%, rgba(150,180,220,0.4) 50%, transparent 70%)",
            animation: "tunnelLightPulse 2s ease-in-out infinite",
            zIndex: 52,
          }} />
          {/* Faint track lines going to vanishing point */}
          <svg style={{
            position: "absolute", inset: 0, zIndex: 51,
          }} viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="45" y1="38" x2="20" y2="100" stroke="rgba(80,80,90,0.3)" strokeWidth="0.3" />
            <line x1="55" y1="38" x2="80" y2="100" stroke="rgba(80,80,90,0.3)" strokeWidth="0.3" />
            {/* Curved ceiling ribs */}
            {[0, 1, 2, 3].map(i => (
              <ellipse
                key={i}
                cx="50" cy={48 + i * 14}
                rx={12 + i * 10} ry={3 + i * 1.5}
                fill="none" stroke="rgba(60,60,70,0.2)" strokeWidth="0.3"
              />
            ))}
          </svg>
          {/* Tunnel text */}
          <div style={{
            position: "absolute", left: "50%", top: "58%",
            transform: "translate(-50%, -50%)",
            fontSize: "1.3rem", fontWeight: 900,
            color: "#FFE066",
            fontFamily: "'Zen Maru Gothic', sans-serif",
            letterSpacing: 4,
            textShadow: "0 0 20px rgba(255,224,102,0.5), 0 0 40px rgba(255,224,102,0.2)",
            animation: "fadeIn 0.5s ease",
            zIndex: 53,
          }}>
            トンネル つうか ちゅう…
          </div>
          {/* Inline keyframes for tunnel-specific animations */}
          <style>{`
            @keyframes tunnelLightPulse {
              0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default RunTunnel;
