// ============ Sound System (Web Audio API) ============

let _audioCtx = null;

const getAudioCtx = () => {
  if (!_audioCtx) {
    try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  }
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
};

const playTone = (freq, dur, type, vol, delay) => {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime + (delay || 0);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || "sine";
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(vol || 0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur);
};

const playNoise = (dur, vol, delay) => {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime + (delay || 0);
  const bufSize = ctx.sampleRate * dur;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol || 0.05, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start(t);
  src.stop(t + dur);
};

export const SFX = {
  partGet: () => {
    playTone(523, 0.12, "sine", 0.15, 0);
    playTone(659, 0.12, "sine", 0.15, 0.1);
    playTone(784, 0.2, "sine", 0.18, 0.2);
  },
  rapidTap: () => {
    playTone(800 + Math.random() * 200, 0.06, "square", 0.06);
  },
  swipeDone: () => {
    playTone(400, 0.15, "sine", 0.1, 0);
    playTone(600, 0.15, "sine", 0.1, 0.08);
    playTone(800, 0.15, "sine", 0.12, 0.16);
  },
  holdTick: (p) => {
    playTone(300 + p * 500, 0.05, "triangle", 0.06);
  },
  holdDone: () => {
    playTone(600, 0.15, "sine", 0.12, 0);
    playTone(900, 0.25, "sine", 0.15, 0.12);
  },
  doorClose: () => {
    playNoise(0.4, 0.08);
    playTone(200, 0.3, "sine", 0.06, 0.05);
  },
  bell: () => {
    for (let i = 0; i < 4; i++) {
      playTone(1200, 0.15, "sine", 0.12, i * 0.25);
      playTone(900, 0.15, "sine", 0.08, i * 0.25 + 0.12);
    }
  },
  horn: () => {
    playTone(280, 0.8, "sawtooth", 0.08);
    playTone(350, 0.8, "sawtooth", 0.06);
  },
  crossing: () => {
    for (let i = 0; i < 6; i++) playTone(1000, 0.1, "square", 0.07, i * 0.2);
  },
  gatangoton: () => {
    playTone(120, 0.08, "square", 0.04, 0);
    playTone(100, 0.08, "square", 0.04, 0.15);
    playTone(130, 0.08, "square", 0.04, 0.5);
    playTone(110, 0.08, "square", 0.04, 0.65);
  },
  tunnel: () => {
    playTone(80, 1.0, "sine", 0.06);
    playTone(120, 0.8, "triangle", 0.04, 0.1);
  },
  arrival: () => {
    const notes = [523, 659, 784, 1047];
    for (let i = 0; i < notes.length; i++) playTone(notes[i], 0.3, "sine", 0.12, i * 0.25);
  },
  celebrate: () => {
    const notes = [523, 587, 659, 784, 880, 1047];
    for (let i = 0; i < notes.length; i++) playTone(notes[i], 0.18, "sine", 0.1, i * 0.1);
  },
  stamp: () => {
    playTone(440, 0.08, "square", 0.08, 0);
    playTone(880, 0.15, "sine", 0.12, 0.06);
    playTone(1320, 0.25, "sine", 0.1, 0.15);
  },
  couple: () => {
    playNoise(0.15, 0.1);
    playTone(200, 0.2, "sawtooth", 0.08, 0.1);
    playTone(300, 0.15, "sine", 0.06, 0.2);
  },
};
