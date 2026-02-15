import { useState, useEffect } from "react";
import ParticleBurst from "../ui/ParticleBurst";
import DepotTrainSVG from "../svg/DepotTrainSVG";
import { FONT, COLORS, FONT_SIZE, SPACE, RADIUS } from "../../data/tokens";

const RewardScreen = ({ train, isNewCollect, collectCount, onReset }) => {
  const [sel, setSel] = useState(null);
  const [show, setShow] = useState(false);
  const [collectShown, setCollectShown] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => { setCollectShown(true); }, 600);
    const t2 = setTimeout(() => { setShow(true); }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const rewards = [
    { id: "bath", emoji: "🛁", label: "おふろ", msg: "おふろに はいろう！\nぽっかぽかに なるよ", color: "#88D8F7" },
    { id: "food", emoji: "🍚", label: "ごはん", msg: "ごはんを たべよう！\nもぐもぐ おいしいね", color: "#FFB347" },
    { id: "sleep", emoji: "🌙", label: "おやすみ", msg: "おやすみなさい！\nいい ゆめ みてね", color: "#B8A9D4" },
  ];

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(180deg,#FFF8E1 0%,#FFECB3 50%,#FFE082 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: FONT, padding: SPACE.xl, position: "relative", overflow: "hidden",
    }}>

      {/* Decorative sparkles in title area */}
      <div style={{ position: "relative", textAlign: "center", marginBottom: SPACE.sm }}>
        {["✨", "⭐", "✨"].map((icon, i) => (
          <span key={`title-sparkle-${i}`} style={{
            position: "absolute",
            top: i === 1 ? -6 : 2,
            ...(i === 0 ? { left: -20 } : i === 2 ? { right: -20 } : { left: "50%", transform: "translateX(-50%)" }),
            fontSize: i === 1 ? "0.8rem" : "0.65rem",
            animation: `twinkle 1s ${i * 0.3}s ease-in-out infinite alternate`,
            pointerEvents: "none",
          }}>
            {icon}
          </span>
        ))}
        <div style={{
          fontSize: FONT_SIZE.xl, fontWeight: 900, color: COLORS.textBrown,
          letterSpacing: 3, animation: "fadeIn 0.5s ease",
          textShadow: `0 2px 8px rgba(255,255,255,0.6), 0 0 16px ${COLORS.goldGlow}`,
        }}>
          🏠 おうちに ついたよ！
        </div>
      </div>
      <div style={{
        fontSize: FONT_SIZE.sm, color: "#888", marginBottom: SPACE.lg,
        animation: "fadeIn 0.8s ease",
      }}>
        {train.name}の たびは たのしかったね！
      </div>

      {/* Collection registration card */}
      {collectShown && (
        <div style={{
          background: isNewCollect
            ? "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,248,225,0.9))"
            : "rgba(255,255,255,0.75)",
          borderRadius: RADIUS.xl,
          padding: `${SPACE.lg}px ${SPACE.xl}px ${SPACE.xl}px`,
          marginBottom: SPACE.xl,
          textAlign: "center",
          animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          position: "relative",
          overflow: "hidden",
          border: isNewCollect ? `2px solid ${COLORS.gold}` : "2px solid rgba(255,255,255,0.5)",
          boxShadow: isNewCollect
            ? `0 4px 24px ${COLORS.goldGlow}, 0 0 40px ${COLORS.goldGlow}, inset 0 1px 0 rgba(255,255,255,0.8)`
            : "0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}>
          {isNewCollect && <ParticleBurst />}

          {/* "NEW!" ribbon for new collection */}
          {isNewCollect && (
            <div style={{
              position: "absolute", top: 10, right: -28,
              background: `linear-gradient(135deg, ${COLORS.red}, ${COLORS.redDark})`,
              color: COLORS.white,
              fontSize: FONT_SIZE.xs, fontWeight: 900,
              padding: `${SPACE.xs}px ${SPACE.xxl}px`,
              transform: "rotate(35deg)",
              boxShadow: "0 2px 6px rgba(229,37,60,0.3)",
              letterSpacing: 1,
              zIndex: 5,
            }}>
              NEW!
            </div>
          )}

          {/* Inner golden shimmer for new collection */}
          {isNewCollect && (
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              background: `linear-gradient(135deg, transparent 30%, ${COLORS.goldGlow} 50%, transparent 70%)`,
              pointerEvents: "none",
              animation: "fadeIn 1s ease",
            }} />
          )}

          <div style={{ width: 160, height: 58, margin: `0 auto ${SPACE.sm}px`, position: "relative", zIndex: 2 }}>
            <DepotTrainSVG train={train} />
          </div>
          {isNewCollect ? (
            <>
              <div style={{
                fontSize: FONT_SIZE.lg, fontWeight: 900, color: COLORS.red,
                letterSpacing: 2, position: "relative", zIndex: 2,
                textShadow: "0 1px 4px rgba(229,37,60,0.15)",
              }}>
                あたらしい でんしゃ ゲット！
              </div>
              <div style={{
                fontSize: FONT_SIZE.sm, color: "#888", marginTop: SPACE.xs,
                position: "relative", zIndex: 2,
              }}>
                コレクションに ついか されたよ
              </div>
            </>
          ) : (
            <>
              <div style={{
                fontSize: FONT_SIZE.lg, fontWeight: 900, color: "#2B6CB0",
                letterSpacing: 2, position: "relative", zIndex: 2,
              }}>
                {collectCount}かいめの {train.name}！
              </div>
              <div style={{
                fontSize: FONT_SIZE.sm, color: "#888", marginTop: SPACE.xs,
                position: "relative", zIndex: 2,
              }}>
                またあえて うれしいね
              </div>
            </>
          )}
        </div>
      )}

      {/* Reward selection */}
      {show && !sel && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: SPACE.md }}>
          <div style={{
            fontSize: FONT_SIZE.lg, fontWeight: 800, color: "#7B3F00",
            letterSpacing: 2, marginBottom: SPACE.xs,
            animation: "slideUp 0.4s ease",
            textShadow: "0 1px 2px rgba(255,255,255,0.6)",
          }}>
            つぎは なにする？
          </div>
          <div style={{ display: "flex", gap: SPACE.md }}>
            {rewards.map((r, i) => (
              <button key={r.id} onClick={() => { setSel(r); }} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: SPACE.sm,
                width: 105, padding: `${SPACE.lg}px ${SPACE.sm}px`,
                borderRadius: RADIUS.xl, border: "none",
                background: `linear-gradient(160deg, ${r.color}, ${r.color}cc)`,
                cursor: "pointer",
                boxShadow: `0 6px 0 ${r.color}88, 0 8px 16px ${r.color}33`,
                animation: `popIn 0.5s ${0.2 + i * 0.15}s cubic-bezier(0.34,1.56,0.64,1) both`,
                fontFamily: FONT,
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}>
                {/* Inner shine highlight */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "45%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
                  borderRadius: `${RADIUS.xl}px ${RADIUS.xl}px 0 0`,
                  pointerEvents: "none",
                }} />
                <span style={{
                  fontSize: "2.8rem",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                  position: "relative", zIndex: 1,
                }}>{r.emoji}</span>
                <span style={{
                  fontSize: FONT_SIZE.md, fontWeight: 800,
                  color: COLORS.white, letterSpacing: 2,
                  textShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  position: "relative", zIndex: 1,
                }}>{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected reward display */}
      {sel && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: SPACE.md,
          animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          position: "relative",
        }}>
          <ParticleBurst />

          {/* Warm backdrop glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 200, height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${sel.color}44 0%, transparent 70%)`,
            pointerEvents: "none",
            filter: "blur(20px)",
          }} />

          <div style={{
            fontSize: "4.5rem",
            animation: "float 2s ease-in-out infinite",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
            position: "relative", zIndex: 2,
          }}>
            {sel.emoji}
          </div>

          {/* Message card with decorative border */}
          <div style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.75))",
            borderRadius: RADIUS.xl,
            padding: `${SPACE.xl}px ${SPACE.xxxl}px`,
            textAlign: "center",
            position: "relative", zIndex: 2,
            border: `2px solid ${sel.color}44`,
            boxShadow: `0 4px 20px ${sel.color}22, inset 0 1px 0 rgba(255,255,255,0.9)`,
          }}>
            {/* Corner decorative dots */}
            {[
              { top: 8, left: 8 }, { top: 8, right: 8 },
              { bottom: 8, left: 8 }, { bottom: 8, right: 8 },
            ].map((pos, i) => (
              <div key={`corner-${i}`} style={{
                position: "absolute", ...pos,
                width: 6, height: 6,
                borderRadius: RADIUS.pill,
                background: sel.color,
                opacity: 0.5,
              }} />
            ))}
            <div style={{
              fontSize: FONT_SIZE.lg, fontWeight: 900, color: COLORS.textBrown,
              whiteSpace: "pre-line", lineHeight: 1.7, letterSpacing: 2,
              textShadow: "0 1px 2px rgba(255,255,255,0.5)",
            }}>
              {sel.msg}
            </div>
          </div>

          {/* "Play again" button */}
          <button onClick={onReset} style={{
            marginTop: SPACE.lg,
            padding: `${SPACE.lg}px ${SPACE.xxxl}px`,
            borderRadius: RADIUS.xl,
            border: "none",
            background: "linear-gradient(145deg,#FFE066,#FF9F43)",
            color: "#7B3F00",
            fontSize: FONT_SIZE.lg, fontWeight: 900,
            cursor: "pointer", fontFamily: FONT,
            boxShadow: "0 5px 0 #cc8030, 0 8px 20px rgba(255,159,67,0.3)",
            letterSpacing: 2,
            position: "relative",
            overflow: "hidden",
            textShadow: "0 1px 0 rgba(255,255,255,0.4)",
          }}>
            {/* Inner shine highlight */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "50%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)",
              borderRadius: `${RADIUS.xl}px ${RADIUS.xl}px 0 0`,
              pointerEvents: "none",
            }} />
            もういっかい あそぶ
          </button>
        </div>
      )}
    </div>
  );
};

export default RewardScreen;
