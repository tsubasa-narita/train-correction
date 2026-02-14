// ============ Time-of-Day Color Palettes ============

export const SKY_COLORS = {
  dawn:  { top: "#FF9E6B", mid: "#FFD1A3", low: "#FFE8CC", ground: "#E8DDD0" },
  day:   { top: "#87CEEB", mid: "#B0E0FF", low: "#E8F8FF", ground: "#F0F0E8" },
  dusk:  { top: "#5C3D6E", mid: "#D4738A", low: "#FFBEA0", ground: "#E0D0C0" },
  night: { top: "#0A0E2A", mid: "#1A1E40", low: "#2A3060", ground: "#282830" },
};

export const MTN_COLORS = {
  dawn: ["#C09878", "#B08868", "#D0A888"],
  day: ["#6BAF7A", "#5A9E6A", "#7CBF8A"],
  dusk: ["#7A6080", "#6A5070", "#8A7090"],
  night: ["#2A3050", "#1E2540", "#343860"],
};

export const BLD_COLORS = {
  dawn: ["#B8A898", "#A89888", "#C0B0A0", "#B0A090"],
  day: ["#A8B4C4", "#8899AA", "#95A5B5", "#B0BCC8"],
  dusk: ["#887080", "#786070", "#907888", "#887080"],
  night: ["#1A1E30", "#202440", "#181C2E", "#222640"],
};

// Window glow: night/dusk windows glow warm
export const winColor = (tod, i, j, k) => {
  if (tod === "night") return ((i + j + k) % 3 === 0) ? "#FFE89F" : ((i + j + k) % 5 === 0 ? "#88CCFF" : "#FFD870");
  if (tod === "dusk") return ((i + j + k) % 3 === 0) ? "#FFD870" : "#E0C8B0";
  return ((i + j + k) % 3 === 0) ? "#C8D8E8" : "#FFE89F";
};
