import { useState } from "react";

const SettingsModal = ({ settings, onChange, onClose }) => {
  const [local, setLocal] = useState({ ...settings });
  const [ni, setNi] = useState(settings.stationName);

  const apply = () => { onChange({ ...local, stationName: ni }); onClose(); };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", fontFamily: "'Zen Maru Gothic', sans-serif", animation: "fadeIn 0.2s ease" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 24, padding: "28px 24px", width: "min(360px,90vw)", maxHeight: "80vh", overflow: "auto", boxShadow: "0 16px 48px rgba(0,0,0,0.3)", animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }} onClick={(e) => { e.stopPropagation(); }}>
        <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#5B3A1A", letterSpacing: 2, marginBottom: 20, textAlign: "center" }}>⚙️ ほごしゃ せってい</div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#666", marginBottom: 8 }}>ステップすう</div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {[2, 3, 4, 5, 6, 7].map((n) => (
              <button key={n} onClick={() => { setLocal({ ...local, stepCount: n }); }} style={{
                width: 44, height: 44, borderRadius: 12, border: "none",
                background: local.stepCount === n ? "linear-gradient(135deg,#FFE066,#FF9F43)" : "#f0f0f0",
                color: local.stepCount === n ? "#7B3F00" : "#999",
                fontSize: "1.1rem", fontWeight: 800, cursor: "pointer", fontFamily: "'Zen Maru Gothic', sans-serif",
              }}>{n}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#666", marginBottom: 8 }}>おうちえきの なまえ</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#f5f5f5", borderRadius: 14, padding: "8px 14px", border: "2px solid #e0e0e0" }}>
            <input value={ni} onChange={(e) => { setNi(e.target.value.slice(0, 10)); }} placeholder="おうち" style={{ flex: 1, border: "none", background: "transparent", fontSize: "1.1rem", fontWeight: 700, outline: "none", fontFamily: "'Zen Maru Gothic', sans-serif", color: "#5B3A1A" }} />
            <span style={{ fontSize: "0.85rem", color: "#bbb", fontWeight: 600 }}>えき</span>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#666", marginBottom: 8 }}>そうこうじかん</div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {[{ v: 8, l: "みじかい" }, { v: 14, l: "ふつう" }, { v: 20, l: "ながい" }].map((o) => (
              <button key={o.v} onClick={() => { setLocal({ ...local, runDuration: o.v }); }} style={{
                padding: "8px 16px", borderRadius: 12, border: "none",
                background: local.runDuration === o.v ? "linear-gradient(135deg,#88D8F7,#3498DB)" : "#f0f0f0",
                color: local.runDuration === o.v ? "#fff" : "#999",
                fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Zen Maru Gothic', sans-serif",
              }}>{o.l}</button>
            ))}
          </div>
        </div>
        <button onClick={apply} style={{ width: "100%", padding: "14px", borderRadius: 16, border: "none", background: "linear-gradient(145deg,#FFE066,#FF9F43)", color: "#7B3F00", fontSize: "1.1rem", fontWeight: 800, cursor: "pointer", fontFamily: "'Zen Maru Gothic', sans-serif", boxShadow: "0 4px 0 #cc8030" }}>けってい</button>
      </div>
    </div>
  );
};

export default SettingsModal;
