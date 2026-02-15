import { COLORS } from "../../data/tokens";

const ProgressDots = ({ total, current }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "8px 0",
    position: "relative",
  }}>
    {Array.from({ length: total }, (_, i) => {
      const completed = i < current;
      const active = i === current;
      const future = i > current;

      return (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          {/* Connecting rail-track line between dots */}
          {i > 0 && (
            <div style={{
              width: 20,
              height: 6,
              position: "relative",
              marginLeft: -1,
              marginRight: -1,
            }}>
              {/* Rail ties (sleepers) */}
              <div style={{
                position: "absolute",
                top: -1,
                left: 3,
                right: 3,
                height: 8,
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}>
                {[0, 1].map((t) => (
                  <div key={t} style={{
                    width: 3,
                    height: 8,
                    borderRadius: 1,
                    background: i <= current
                      ? "rgba(255,200,80,0.5)"
                      : "rgba(255,255,255,0.12)",
                    transition: "background 0.4s ease",
                  }} />
                ))}
              </div>
              {/* Top rail */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                borderRadius: 1,
                background: i <= current
                  ? `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.warning})`
                  : "rgba(255,255,255,0.15)",
                transition: "background 0.4s ease",
                boxShadow: i <= current ? `0 0 4px ${COLORS.goldGlow}` : "none",
              }} />
              {/* Bottom rail */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                borderRadius: 1,
                background: i <= current
                  ? `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.warning})`
                  : "rgba(255,255,255,0.15)",
                transition: "background 0.4s ease",
                boxShadow: i <= current ? `0 0 4px ${COLORS.goldGlow}` : "none",
              }} />
            </div>
          )}

          {/* Dot */}
          <div style={{
            width: active ? 36 : 30,
            height: active ? 36 : 30,
            borderRadius: "50%",
            background: completed
              ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.warning})`
              : active
                ? `radial-gradient(circle at 35% 35%, ${COLORS.white}, rgba(220,230,255,0.9))`
                : "rgba(255,255,255,0.15)",
            border: active
              ? `3px solid ${COLORS.warning}`
              : completed
                ? "3px solid transparent"
                : "2px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: active ? "1rem" : "0.85rem",
            transition: "all 0.4s ease",
            boxShadow: completed
              ? `0 2px 8px rgba(255,159,67,0.5), 0 0 12px ${COLORS.goldGlow}`
              : active
                ? `0 0 0 4px rgba(255,159,67,0.25), 0 2px 8px rgba(0,0,0,0.15)`
                : "none",
            animation: active ? "pulse 1.5s infinite" : "none",
            filter: future ? "opacity(0.6)" : "none",
            position: "relative",
            zIndex: active ? 2 : 1,
          }}>
            {completed ? "\u2B50" : active ? "\uD83D\uDE83" : ""}
          </div>
        </div>
      );
    })}
  </div>
);

export default ProgressDots;
