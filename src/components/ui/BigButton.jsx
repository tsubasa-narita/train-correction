import { useState } from "react";
import { FONT, RADIUS } from "../../data/tokens";

const BigButton = ({ onClick, label, emoji, color, pulse, disabled }) => {
  const [pressed, setPressed] = useState(false);

  const isActive = !disabled && pressed;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        gap: 6,
        width: "min(300px,82vw)",
        padding: "22px 20px",
        border: disabled ? "2px solid rgba(0,0,0,0.06)" : `2px solid ${color}44`,
        borderRadius: RADIUS.xl + 4,
        background: disabled
          ? "linear-gradient(170deg, #d5d5d5, #b8b8b8)"
          : `linear-gradient(170deg, ${color}, ${color}cc, ${color}aa)`,
        color: disabled ? "rgba(255,255,255,0.6)" : "#fff",
        fontSize: "1.5rem",
        fontWeight: 800,
        cursor: disabled ? "default" : "pointer",
        boxShadow: disabled
          ? "0 2px 0 rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15)"
          : isActive
            ? `0 2px 0 ${color}88, 0 4px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)`
            : `0 6px 0 ${color}88, 0 10px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)`,
        fontFamily: FONT,
        letterSpacing: 2,
        animation: pulse && !disabled ? "pulse 1.5s infinite" : "none",
        transform: isActive ? "translateY(4px)" : "translateY(0)",
        transition: "transform 0.1s ease, box-shadow 0.1s ease",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
      }}
    >
      {/* Inner highlight overlay for 3D puffy look */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          borderRadius: `${RADIUS.xl + 4}px ${RADIUS.xl + 4}px 0 0`,
          background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      <span style={{
        fontSize: "2.5rem",
        lineHeight: 1,
        filter: disabled ? "grayscale(0.8) opacity(0.5)" : "none",
        position: "relative",
      }}>
        {emoji}
      </span>
      <span style={{
        position: "relative",
        textShadow: disabled ? "none" : "0 1px 2px rgba(0,0,0,0.2)",
      }}>
        {label}
      </span>
    </button>
  );
};

export default BigButton;
