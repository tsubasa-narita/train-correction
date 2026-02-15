// ============ Storage abstraction (window.storage or localStorage fallback) ============

const storageGet = (key) => {
  if (window.storage && typeof window.storage.get === "function") {
    return window.storage.get(key).then((result) => result ? result.value : null);
  }
  return Promise.resolve(localStorage.getItem(key));
};

const storageSet = (key, value) => {
  if (window.storage && typeof window.storage.set === "function") {
    return window.storage.set(key, value);
  }
  localStorage.setItem(key, value);
  return Promise.resolve();
};

// ============ Stamp Card Storage ============

const STAMP_KEY = "ouchi-stamps";
const COLLECTION_KEY = "ouchi-collection";

export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const loadStamps = (callback) => {
  try {
    storageGet(STAMP_KEY).then((val) => {
      callback(val ? JSON.parse(val) : []);
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
      storageSet(STAMP_KEY, JSON.stringify(stamps)).then(() => {
        if (callback) callback(stamps);
      }).catch(() => { if (callback) callback(stamps); });
    } catch (e) { if (callback) callback(stamps); }
  });
};

// ============ Collection Storage ============

export const loadCollection = (callback) => {
  try {
    storageGet(COLLECTION_KEY).then((val) => {
      callback(val ? JSON.parse(val) : []);
    }).catch(() => { callback([]); });
  } catch (e) { callback([]); }
};

export const saveCollection = (trainId, callback) => {
  loadCollection((col) => {
    const existing = col.find((c) => c.trainId === trainId);
    if (existing) {
      existing.count += 1;
      existing.lastDate = todayStr();
    } else {
      col.push({ trainId, firstGetDate: todayStr(), lastDate: todayStr(), count: 1 });
    }
    try {
      storageSet(COLLECTION_KEY, JSON.stringify(col)).then(() => {
        if (callback) callback(col);
      }).catch(() => { if (callback) callback(col); });
    } catch (e) { if (callback) callback(col); }
  });
};
