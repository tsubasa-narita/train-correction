// /home/user/train-correction/src/components/running/RunDecoupleSign.jsx
const RunDecoupleSign = ({ visible, partnerName }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)",
      zIndex: 30, pointerEvents: "none", fontFamily: "'Zen Maru Gothic', sans-serif",
      animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      {/* Inline keyframes for decouple animation */}
      <style>{`
        @keyframes chainSeparate {
          0% { gap: 0px; }
          30% { gap: 2px; }
          60% { gap: 8px; }
          100% { gap: 16px; }
        }
        @keyframes chainLinkShake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        @keyframes sparkFlash {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.5); }
        }
      `}</style>

      <div style={{
        background: "linear-gradient(145deg, #FFE066 0%, #FFB347 50%, #FFA030 100%)",
        border: "3px solid #cc8030",
        borderRadius: 16,
        padding: "12px 28px 14px",
        boxShadow: "0 6px 24px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.4)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Animated chain-link separation icon */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
          animation: "chainSeparate 1s 0.3s ease-out forwards",
          gap: 0,
        }}>
          {/* Left chain link */}
          <svg width={22} height={18} viewBox="0 0 22 18" style={{
            animation: "chainLinkShake 0.4s 0.5s ease-in-out 3",
          }}>
            <rect x="2" y="3" width="16" height="12" rx="6" fill="none" stroke="#7B5500" strokeWidth="2.5" />
            <rect x="10" y="5" width="10" height="8" rx="4" fill="none" stroke="#7B5500" strokeWidth="2" opacity="0.5" />
          </svg>
          {/* Spark effect at break point */}
          <div style={{
            width: 6, height: 6,
            background: "radial-gradient(circle, #FFF 30%, #FFE066 60%, transparent 100%)",
            borderRadius: "50%",
            animation: "sparkFlash 0.6s 0.8s ease-out forwards",
          }} />
          {/* Right chain link */}
          <svg width={22} height={18} viewBox="0 0 22 18" style={{
            animation: "chainLinkShake 0.4s 0.6s ease-in-out 3",
          }}>
            <rect x="4" y="3" width="16" height="12" rx="6" fill="none" stroke="#7B5500" strokeWidth="2.5" />
            <rect x="2" y="5" width="10" height="8" rx="4" fill="none" stroke="#7B5500" strokeWidth="2" opacity="0.5" />
          </svg>
        </div>

        {/* Main text */}
        <div style={{
          fontSize: "1.3rem", fontWeight: 900, color: "#7B3F00",
          letterSpacing: 3,
          textShadow: "0 1px 2px rgba(255,255,255,0.3)",
        }}>きりはなし！</div>

        {/* Subtext */}
        <div style={{
          fontSize: "0.8rem", color: "#996622", marginTop: 3,
          fontWeight: 700,
        }}>{partnerName}と おわかれ</div>

        {/* Decorative corner accents */}
        <div style={{
          position: "absolute", top: 4, left: 6,
          width: 8, height: 8,
          borderTop: "2px solid rgba(123,63,0,0.3)",
          borderLeft: "2px solid rgba(123,63,0,0.3)",
          borderRadius: "2px 0 0 0",
        }} />
        <div style={{
          position: "absolute", top: 4, right: 6,
          width: 8, height: 8,
          borderTop: "2px solid rgba(123,63,0,0.3)",
          borderRight: "2px solid rgba(123,63,0,0.3)",
          borderRadius: "0 2px 0 0",
        }} />
        <div style={{
          position: "absolute", bottom: 4, left: 6,
          width: 8, height: 8,
          borderBottom: "2px solid rgba(123,63,0,0.3)",
          borderLeft: "2px solid rgba(123,63,0,0.3)",
          borderRadius: "0 0 0 2px",
        }} />
        <div style={{
          position: "absolute", bottom: 4, right: 6,
          width: 8, height: 8,
          borderBottom: "2px solid rgba(123,63,0,0.3)",
          borderRight: "2px solid rgba(123,63,0,0.3)",
          borderRadius: "0 0 2px 0",
        }} />
      </div>
    </div>
  );
};

export default RunDecoupleSign;
