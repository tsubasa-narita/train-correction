import { useState, useEffect } from "react";
import ParticleBurst from "../ui/ParticleBurst";
import DepotTrainSVG from "../svg/DepotTrainSVG";

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
    <div style={{ minHeight: "100dvh", background: "linear-gradient(180deg,#FFF8E1 0%,#FFECB3 50%,#FFE082 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Zen Maru Gothic', sans-serif", padding: 20 }}>
      <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 3, marginBottom: 6, animation: "fadeIn 0.5s ease" }}>🏠 おうちに ついたよ！</div>
      <div style={{ fontSize: "0.95rem", color: "#888", marginBottom: 12 }}>{train.name}の たびは たのしかったね！</div>

      {/* Collection registration */}
      {collectShown && (
        <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 20, padding: "14px 24px", marginBottom: 16, textAlign: "center", animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)", position: "relative" }}>
          {isNewCollect && <ParticleBurst />}
          <div style={{ width: 140, height: 52, margin: "0 auto 8px" }}>
            <DepotTrainSVG train={train} />
          </div>
          {isNewCollect ? (
            <>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#E5253C", letterSpacing: 2 }}>あたらしい でんしゃ ゲット！</div>
              <div style={{ fontSize: "0.85rem", color: "#888", marginTop: 2 }}>コレクションに ついか されたよ</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#2B6CB0", letterSpacing: 2 }}>{collectCount}かいめの {train.name}！</div>
              <div style={{ fontSize: "0.85rem", color: "#888", marginTop: 2 }}>またあえて うれしいね</div>
            </>
          )}
        </div>
      )}

      {show && !sel && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#7B3F00", letterSpacing: 2, marginBottom: 4, animation: "slideUp 0.4s ease" }}>つぎは なにする？</div>
        <div style={{ display: "flex", gap: 12 }}>
          {rewards.map((r, i) => (
            <button key={r.id} onClick={() => { setSel(r); }} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              width: 100, padding: "16px 8px", borderRadius: 20, border: "none",
              background: `linear-gradient(145deg,${r.color},${r.color}cc)`,
              cursor: "pointer", boxShadow: `0 6px 0 ${r.color}88`,
              animation: `popIn 0.5s ${0.2 + i * 0.15}s cubic-bezier(0.34,1.56,0.64,1) both`,
              fontFamily: "'Zen Maru Gothic', sans-serif",
            }}>
              <span style={{ fontSize: "2.5rem" }}>{r.emoji}</span>
              <span style={{ fontSize: "1rem", fontWeight: 800, color: "#fff", letterSpacing: 2 }}>{r.label}</span>
            </button>
          ))}
        </div>
      </div>}
      {sel && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)", position: "relative" }}>
        <ParticleBurst />
        <div style={{ fontSize: "4rem", animation: "float 2s ease-in-out infinite" }}>{sel.emoji}</div>
        <div style={{ background: "rgba(255,255,255,0.8)", borderRadius: 20, padding: "18px 32px", textAlign: "center" }}>
          <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#5B3A1A", whiteSpace: "pre-line", lineHeight: 1.6, letterSpacing: 2 }}>{sel.msg}</div>
        </div>
        <button onClick={onReset} style={{ marginTop: 12, padding: "12px 32px", borderRadius: 18, border: "none", background: "linear-gradient(145deg,#FFE066,#FF9F43)", color: "#7B3F00", fontSize: "1rem", fontWeight: 800, cursor: "pointer", fontFamily: "'Zen Maru Gothic', sans-serif", boxShadow: "0 4px 0 #cc8030" }}>もういっかい あそぶ</button>
      </div>}
    </div>
  );
};

export default RewardScreen;
