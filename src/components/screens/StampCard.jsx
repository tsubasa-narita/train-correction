import { useState, useEffect } from "react";
import { loadStamps, loadCollection } from "../../systems/stamps";
import { TRAINS } from "../../data/trains";
import DepotTrainSVG from "../svg/DepotTrainSVG";
import { FONT, COLORS, FONT_SIZE, SPACE, RADIUS } from "../../data/tokens";

const StampCard = ({ onBack }) => {
  const [stamps, setStamps] = useState([]);
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let loaded = 0;
    const check = () => { if (++loaded >= 2) setLoading(false); };
    loadStamps((data) => { setStamps(data); check(); });
    loadCollection((data) => { setCollection(data); check(); });
  }, []);

  const colMap = {};
  collection.forEach((c) => { colMap[c.trainId] = c; });
  const totalCollected = Object.keys(colMap).length;

  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const dayStamps = stamps.filter((s) => s.date === ds);
    const dayLabel = `${d.getMonth() + 1}/${d.getDate()}`;
    const dayOfWeek = ["にち", "げつ", "か", "すい", "もく", "きん", "ど"][d.getDay()];
    days.push({ date: ds, label: dayLabel, dow: dayOfWeek, dowIdx: d.getDay(), stamps: dayStamps, isToday: i === 0 });
  }

  const progressPct = totalCollected / TRAINS.length * 100;

  /* Section header style helper */
  const sectionHeader = (text) => (
    <div style={{
      fontSize: FONT_SIZE.sm, fontWeight: 900, color: "#7B3F00",
      textAlign: "center", marginBottom: SPACE.md,
      letterSpacing: 3, position: "relative",
      display: "inline-flex", alignItems: "center", gap: SPACE.sm,
    }}>
      <div style={{
        width: 20, height: 2,
        background: "linear-gradient(90deg, transparent, #D4A600)",
        borderRadius: RADIUS.pill,
      }} />
      {text}
      <div style={{
        width: 20, height: 2,
        background: "linear-gradient(90deg, #D4A600, transparent)",
        borderRadius: RADIUS.pill,
      }} />
    </div>
  );

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(180deg,#FFF8E1 0%,#FFECB3 50%,#FFE082 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      fontFamily: FONT, padding: `${SPACE.xl}px ${SPACE.lg}px`, overflow: "auto",
    }}>

      {/* Top bar with back button and title */}
      <div style={{
        display: "flex", alignItems: "center", gap: SPACE.md,
        marginBottom: SPACE.lg, width: "100%", maxWidth: 400,
      }}>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.5)",
          borderRadius: RADIUS.pill,
          padding: `${SPACE.sm}px ${SPACE.lg}px`,
          cursor: "pointer",
          fontSize: FONT_SIZE.sm, fontFamily: FONT, fontWeight: 800,
          color: "#7B3F00",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
          display: "flex", alignItems: "center", gap: SPACE.xs,
          letterSpacing: 1,
        }}>
          <span style={{ fontSize: FONT_SIZE.md }}>←</span>
          もどる
        </button>
        <div style={{
          fontSize: FONT_SIZE.lg, fontWeight: 900, color: COLORS.textBrown,
          letterSpacing: 3,
          textShadow: `0 1px 4px rgba(255,255,255,0.6)`,
        }}>
          コレクション
        </div>
      </div>

      {/* Completion progress section */}
      <div style={{
        width: "100%", maxWidth: 400,
        background: "linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.55))",
        borderRadius: RADIUS.xl,
        padding: `${SPACE.md}px ${SPACE.lg}px`,
        marginBottom: SPACE.lg,
        boxShadow: "0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: "1px solid rgba(255,255,255,0.5)",
      }}>
        <div style={{
          fontSize: FONT_SIZE.sm, fontWeight: 800, color: "#7B3F00",
          marginBottom: SPACE.sm, letterSpacing: 1,
          display: "flex", alignItems: "center", gap: SPACE.xs,
        }}>
          <span style={{ fontSize: FONT_SIZE.md }}>🏆</span>
          しゃしゅ コンプリート
          <span style={{
            marginLeft: "auto",
            fontSize: FONT_SIZE.md, fontWeight: 900,
            color: COLORS.goldDark,
          }}>
            {totalCollected} / {TRAINS.length}
          </span>
        </div>
        <div style={{
          height: 14, background: "rgba(0,0,0,0.06)",
          borderRadius: RADIUS.pill, overflow: "hidden",
          position: "relative",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
        }}>
          <div style={{
            width: `${progressPct}%`, height: "100%",
            background: "linear-gradient(90deg,#FFE066,#FF9F43,#FFE066)",
            backgroundSize: "200% 100%",
            borderRadius: RADIUS.pill,
            transition: "width 0.5s ease",
            position: "relative",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
          }}>
            {/* Shimmer overlay */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "50%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)",
              borderRadius: `${RADIUS.pill}px ${RADIUS.pill}px 0 0`,
            }} />
          </div>
          {/* Sparkle at the filled end */}
          {totalCollected > 0 && (
            <div style={{
              position: "absolute", top: "50%", left: `${progressPct}%`,
              transform: "translate(-50%, -50%)",
              width: 8, height: 8,
              borderRadius: RADIUS.pill,
              background: COLORS.white,
              boxShadow: `0 0 6px ${COLORS.gold}, 0 0 12px ${COLORS.goldGlow}`,
              animation: "twinkle 1s ease-in-out infinite alternate",
            }} />
          )}
        </div>
      </div>

      {/* Train collection grid */}
      <div style={{
        width: "100%", maxWidth: 400,
        background: "linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.55))",
        borderRadius: RADIUS.xl,
        padding: `${SPACE.lg}px ${SPACE.md}px`,
        marginBottom: SPACE.lg,
        boxShadow: "0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: "1px solid rgba(255,255,255,0.5)",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        {sectionHeader("でんしゃ ずかん")}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: SPACE.sm, width: "100%",
        }}>
          {TRAINS.map((tr) => {
            const got = colMap[tr.id];
            return (
              <div key={tr.id} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: `${SPACE.sm}px ${SPACE.xs}px`,
                borderRadius: RADIUS.lg,
                background: got
                  ? "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))"
                  : "rgba(0,0,0,0.02)",
                border: got
                  ? `2px solid ${tr.body}66`
                  : "2px solid rgba(0,0,0,0.04)",
                boxShadow: got
                  ? `0 2px 8px ${tr.body}18, inset 0 1px 0 rgba(255,255,255,0.8)`
                  : "inset 0 2px 6px rgba(0,0,0,0.04)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Gradient top accent for collected trains */}
                {got && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${tr.body}88, ${tr.body}, ${tr.body}88)`,
                    borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0`,
                  }} />
                )}
                <div style={{
                  width: "100%", height: 38,
                  opacity: got ? 1 : 0.12,
                  filter: got ? "none" : "grayscale(100%)",
                }}>
                  <DepotTrainSVG train={tr} />
                </div>
                <div style={{
                  fontSize: FONT_SIZE.xs, fontWeight: 800,
                  color: got ? COLORS.textBrown : "#ccc",
                  textAlign: "center", lineHeight: 1.2,
                }}>
                  {got ? tr.name : "？？？"}
                </div>
                {got && (
                  <div style={{
                    fontSize: "0.5rem", color: "#999", fontWeight: 700,
                    background: "rgba(0,0,0,0.04)",
                    padding: "1px 6px", borderRadius: RADIUS.pill,
                  }}>
                    ×{got.count}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stamp calendar */}
      <div style={{
        width: "100%", maxWidth: 400,
        background: "linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.55))",
        borderRadius: RADIUS.xl,
        padding: `${SPACE.lg}px ${SPACE.md}px`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: "1px solid rgba(255,255,255,0.5)",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        {sectionHeader("📅 さいきん 14にちかん")}

        {/* Day-of-week headers */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(7,1fr)",
          gap: SPACE.xs, marginBottom: SPACE.xs, width: "100%",
        }}>
          {["にち", "げつ", "か", "すい", "もく", "きん", "ど"].map((dw, i) => (
            <div key={dw} style={{
              fontSize: "0.55rem",
              color: i === 0 ? "#E57373" : i === 6 ? "#64B5F6" : "#999",
              fontWeight: 800, textAlign: "center",
              letterSpacing: 1,
            }}>
              {dw}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(7,1fr)",
          gap: SPACE.xs, width: "100%",
        }}>
          {(() => {
            const pad = [];
            const firstDow = days[0] ? days[0].dowIdx : 0;
            for (let p = 0; p < firstDow; p++) { pad.push(<div key={`pad${p}`} />); }
            return pad;
          })()}
          {days.map((day) => {
            const hasStamp = day.stamps.length > 0;
            const lastStamp = hasStamp ? day.stamps[day.stamps.length - 1] : null;
            const trainForDay = lastStamp ? TRAINS.find((t) => t.id === lastStamp.trainId) : null;
            return (
              <div key={day.date} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: `${SPACE.xs}px 2px ${SPACE.xs}px`,
                borderRadius: RADIUS.lg,
                background: day.isToday
                  ? "linear-gradient(135deg, rgba(255,224,102,0.2), rgba(255,159,67,0.15))"
                  : "transparent",
                border: day.isToday
                  ? `2px solid ${COLORS.gold}`
                  : "2px solid transparent",
                boxShadow: day.isToday
                  ? `0 0 12px ${COLORS.goldGlow}, inset 0 0 8px ${COLORS.goldGlow}`
                  : "none",
                transition: "all 0.3s ease",
              }}>
                <div style={{
                  fontSize: "0.7rem", fontWeight: 800,
                  color: day.isToday ? COLORS.goldDark : "#666",
                  letterSpacing: 0.5,
                }}>
                  {day.label}
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: hasStamp
                    ? "linear-gradient(135deg,#FFE066,#FF9F43)"
                    : "rgba(0,0,0,0.03)",
                  fontSize: hasStamp ? "1.1rem" : "0.7rem",
                  boxShadow: hasStamp
                    ? "0 3px 8px rgba(255,159,67,0.35), inset 0 1px 0 rgba(255,255,255,0.5)"
                    : "inset 0 1px 3px rgba(0,0,0,0.04)",
                  position: "relative",
                  border: hasStamp ? "2px solid rgba(255,255,255,0.5)" : "2px solid transparent",
                }}>
                  {hasStamp ? (trainForDay ? (trainForDay.kind === "steam" ? "🚂" : "🚄") : "⭐") : ""}
                  {day.stamps.length > 1 && (
                    <div style={{
                      position: "absolute", top: -4, right: -4,
                      width: 16, height: 16, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${COLORS.red}, ${COLORS.redDark})`,
                      color: COLORS.white,
                      fontSize: "0.45rem", fontWeight: 900,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 1px 4px rgba(229,37,60,0.3)",
                      border: `1.5px solid ${COLORS.white}`,
                    }}>
                      {day.stamps.length}
                    </div>
                  )}
                </div>
                {hasStamp && trainForDay && (
                  <div style={{
                    fontSize: "0.45rem", color: "#888", fontWeight: 700,
                    textAlign: "center", lineHeight: 1.1,
                    maxWidth: 44, overflow: "hidden",
                  }}>
                    {trainForDay.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {loading && (
        <div style={{
          marginTop: SPACE.xl,
          fontSize: FONT_SIZE.md, color: "#999",
          animation: "pulse 1.5s ease-in-out infinite",
        }}>
          よみこみちゅう...
        </div>
      )}
    </div>
  );
};

export default StampCard;
