// ============ Game Steps & Settings ============

export const ALL_STEPS = [
  { id: "prepare", label: "しゅっぱつ じゅんび", instruction: "くつを はこう！", emoji: "👟", partName: "しゃりん", partLabel: "しゃりん ゲット！", bgGrad: ["#FFF5D6", "#FFF0B8"], btnColor: "#FF9F43", interact: "rapid", hint: "れんだ！", goal: 6 },
  { id: "walk1", label: "あるいて いこう", instruction: "てくてく あるこう！", emoji: "🚶", partName: "せんろ", partLabel: "せんろ ゲット！", bgGrad: ["#D5F5E3", "#A8E6CF"], btnColor: "#2ECC71", interact: "swipe", hint: "→ スワイプ！" },
  { id: "walk2", label: "どんどん いこう", instruction: "いいちょうし！", emoji: "💨", partName: "ボディ", partLabel: "ボディ ゲット！", bgGrad: ["#FDEBEF", "#F8C8D4"], btnColor: "#E74C8B", interact: "hold", hint: "ながおし！", holdMs: 1500 },
  { id: "halfway", label: "はんぶん きたよ", instruction: "まどを つけよう！", emoji: "⭐", partName: "まど", partLabel: "まど ゲット！", bgGrad: ["#D6EEF8", "#AED8F0"], btnColor: "#3498DB", interact: "tap", hint: "タップ！" },
  { id: "walk3", label: "あとちょっと", instruction: "ドアを つけよう！", emoji: "🚪", partName: "ドア", partLabel: "ドア ゲット！", bgGrad: ["#E8DAEF", "#D2B4DE"], btnColor: "#8E44AD", interact: "swipe", hint: "→ スワイプ！" },
  { id: "walk4", label: "もうすこし", instruction: "やねを のせよう！", emoji: "🏗️", partName: "やね", partLabel: "やね ゲット！", bgGrad: ["#FCF3CF", "#F9E79F"], btnColor: "#F39C12", interact: "hold", hint: "ながおし！", holdMs: 1200 },
  { id: "almost", label: "もうすぐ おうち", instruction: "パンタグラフを つけて！", emoji: "⚡", partName: "パンタグラフ", partLabel: "パンタグラフ ゲット！", bgGrad: ["#D5F5E3", "#B8E6C8"], btnColor: "#27AE60", interact: "rapid", hint: "れんだ！", goal: 5 },
];

export const STATION_NAMES = ["はなえき", "もりえき", "かわえき", "そらえき", "ほしえき", "にじえき"];

export const DEFAULT_SETTINGS = { stepCount: 4, stationName: "おうち", runDuration: 14 };

export const getSteps = (c) => {
  if (c <= 2) return [ALL_STEPS[0], ALL_STEPS[2]];
  if (c === 3) return [ALL_STEPS[0], ALL_STEPS[2], ALL_STEPS[3]];
  if (c === 4) return [ALL_STEPS[0], ALL_STEPS[1], ALL_STEPS[2], ALL_STEPS[3]];
  if (c === 5) return [ALL_STEPS[0], ALL_STEPS[1], ALL_STEPS[2], ALL_STEPS[3], ALL_STEPS[5]];
  if (c === 6) return [ALL_STEPS[0], ALL_STEPS[1], ALL_STEPS[2], ALL_STEPS[3], ALL_STEPS[4], ALL_STEPS[5]];
  return ALL_STEPS;
};
