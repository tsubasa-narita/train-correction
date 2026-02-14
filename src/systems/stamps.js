// ============ Stamp Card Storage ============

const STAMP_KEY = "ouchi-stamps";

export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const loadStamps = (callback) => {
  try {
    window.storage.get(STAMP_KEY).then((result) => {
      callback(result ? JSON.parse(result.value) : []);
    }).catch(() => { callback([]); });
  } catch (e) { callback([]); }
};

export const saveStamp = (trainId, callback) => {
  loadStamps((stamps) => {
    const today = todayStr();
    const exists = stamps.some((s) => s.date === today && s.trainId === trainId);
    if (!exists) stamps.push({ date: today, trainId: trainId });
    // Keep last 60 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 60);
    const cutStr = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, "0")}-${String(cutoff.getDate()).padStart(2, "0")}`;
    stamps = stamps.filter((s) => s.date >= cutStr);
    try {
      window.storage.set(STAMP_KEY, JSON.stringify(stamps)).then(() => {
        if (callback) callback(stamps);
      }).catch(() => { if (callback) callback(stamps); });
    } catch (e) { if (callback) callback(stamps); }
  });
};
