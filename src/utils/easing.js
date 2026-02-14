// ============ Easing ============

export const easeProgress = (rawP) => {
  if (rawP < 0.08) return rawP * rawP / 0.08 * 0.08;
  if (rawP > 0.88) {
    const q = (rawP - 0.88) / 0.12;
    return 0.88 + 0.12 * (1 - (1 - q) * (1 - q));
  }
  return rawP;
};
