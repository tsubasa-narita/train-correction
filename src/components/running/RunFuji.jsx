// /home/user/train-correction/src/components/running/RunFuji.jsx
const RunFuji = ({ visible, opacity }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", right: "5%", top: "6%", zIndex: 6, pointerEvents: "none",
      opacity, transition: "opacity 1.5s ease",
    }}>
      <svg width={160} height={130} viewBox="0 0 200 160">
        <defs>
          {/* Atmospheric haze gradient */}
          <linearGradient id="fujiHaze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8899BB" stopOpacity="0" />
            <stop offset="70%" stopColor="#AABBDD" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#CCDDEE" stopOpacity="0.5" />
          </linearGradient>
          {/* Mountain body gradient */}
          <linearGradient id="fujiBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5566AA" />
            <stop offset="40%" stopColor="#6677AA" />
            <stop offset="100%" stopColor="#7788AA" />
          </linearGradient>
          {/* Snow cap gradient */}
          <linearGradient id="fujiSnow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E8EEFF" />
          </linearGradient>
          {/* Warm glow at base */}
          <radialGradient id="fujiGlow" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="#FFCC88" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFCC88" stopOpacity="0" />
          </radialGradient>
          {/* Blur filter for atmosphere */}
          <filter id="fujiBlur">
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
          <filter id="fujiHazeFilter">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Back ridge (furthest, lightest) */}
        <path
          d="M30,150 L55,85 Q62,78 70,82 L85,65 Q90,58 95,62 L100,55 L105,60 Q110,55 115,62 L130,80 Q135,76 142,82 L165,150 Z"
          fill="#8899BB" opacity={0.4} filter="url(#fujiBlur)"
        />

        {/* Mid ridge */}
        <path
          d="M40,150 L65,90 Q72,85 78,88 L90,70 Q95,63 100,58 L105,63 Q108,58 113,65 L125,85 Q130,82 136,88 L155,150 Z"
          fill="#7788AA" opacity={0.6} filter="url(#fujiBlur)"
        />

        {/* Main mountain body with realistic ridges */}
        <path
          d="M20,150 L50,95 Q58,88 65,92 L78,72 Q85,60 92,50 L97,38 Q100,28 103,38 L108,50 Q115,60 122,72 L135,92 Q142,88 150,95 L180,150 Z"
          fill="url(#fujiBody)" opacity={0.85}
        />

        {/* Ridge detail lines on main body */}
        <path
          d="M70,120 L92,55 Q95,45 100,35"
          fill="none" stroke="rgba(70,85,140,0.3)" strokeWidth="0.8"
        />
        <path
          d="M130,120 L108,55 Q105,45 100,35"
          fill="none" stroke="rgba(70,85,140,0.25)" strokeWidth="0.6"
        />
        <path
          d="M55,140 L80,80"
          fill="none" stroke="rgba(90,100,150,0.15)" strokeWidth="0.5"
        />
        <path
          d="M145,140 L120,80"
          fill="none" stroke="rgba(90,100,150,0.15)" strokeWidth="0.5"
        />

        {/* Snow cap with irregular edge */}
        <path
          d="M87,62 Q90,55 93,48 L96,40 Q98,33 100,28 Q102,33 104,40 L107,48 Q110,55 113,62
             Q111,65 108,60 Q106,63 103,58 Q101,62 98,58 Q96,63 93,60 Q90,65 87,62 Z"
          fill="url(#fujiSnow)" opacity={0.92}
        />
        {/* Snow streaks running down */}
        <path
          d="M93,60 Q92,68 90,78 Q89,82 91,80 Q93,75 94,68 Z"
          fill="white" opacity={0.5}
        />
        <path
          d="M107,60 Q108,68 110,78 Q111,82 109,80 Q107,75 106,68 Z"
          fill="white" opacity={0.45}
        />
        <path
          d="M100,58 Q99,65 98,75 Q97,80 100,78 Q101,72 101,65 Z"
          fill="white" opacity={0.35}
        />

        {/* Warm glow at base */}
        <ellipse cx="100" cy="155" rx="80" ry="25" fill="url(#fujiGlow)" />

        {/* Atmospheric haze overlay */}
        <rect x="0" y="80" width="200" height="80" fill="url(#fujiHaze)" filter="url(#fujiHazeFilter)" />
      </svg>
      <div style={{
        textAlign: "center", fontSize: "0.75rem", fontWeight: 900,
        color: "#5B6BAA", fontFamily: "'Zen Maru Gothic', sans-serif", marginTop: -10,
        textShadow: "0 1px 4px rgba(255,255,255,0.6)",
      }}>ふじさん！</div>
    </div>
  );
};

export default RunFuji;
