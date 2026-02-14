// ============ Time of Day & Weather ============

export const getTimeOfDay = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 7) return "dawn";
  if (h >= 7 && h < 16) return "day";
  if (h >= 16 && h < 18) return "dusk";
  return "night";
};

export const getWeather = () => {
  const r = Math.random();
  if (r < 0.25) return "rain";
  if (r < 0.38) return "rainbow";
  return "clear";
};
