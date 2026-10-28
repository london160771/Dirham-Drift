export const SOUND_IDS = ['hit', 'coin', 'thud', 'click', 'nitro', 'beep', 'go', 'repo'];
export const MUSIC_IDS = ['hub', 'race'];

export const SOUND_GAIN = {
  hit: 0.7,
  coin: 0.55,
  thud: 0.6,
  click: 0.35,
  nitro: 0.5,
  beep: 0.35,
  go: 0.4,
  repo: 0.6,
};

export const SYNTH_SOUNDS = {
  hit: { type: 'noise', duration: 0.25, filter: 900 },
  coin: { type: 'tones', wave: 'square', notes: [988, 1319], step: 0.07, duration: 0.12 },
  thud: { type: 'drop', wave: 'sine', from: 160, to: 45, duration: 0.3 },
  click: { type: 'tones', wave: 'triangle', notes: [1400], step: 0, duration: 0.04 },
  nitro: { type: 'noise', duration: 0.6, filter: 2400, sweep: 5200 },
  beep: { type: 'tones', wave: 'square', notes: [660], step: 0, duration: 0.15 },
  go: { type: 'tones', wave: 'square', notes: [1320], step: 0, duration: 0.35 },
  repo: { type: 'drop', wave: 'sawtooth', from: 420, to: 60, duration: 0.7 },
};

export const ENGINE_SOUND = {
  idleHz: 52,
  topHz: 190,
  nitroHz: 30,
  smoothing: 0.08,
  gain: 0.14,
  subRatio: 0.5,
  filterHz: 900,
};

export const MUSIC = {
  sampleRate: 22050,
  gain: 0.32,
  scale: [0, 1, 4, 5, 7, 8, 10],
  root: 146.83,
  hub: { bpm: 84, bars: 8, chords: [0, 5, 3, 4], arp: [0, 2, 4, 2], drums: false },
  race: { bpm: 128, bars: 8, chords: [0, 0, 5, 4], arp: [0, 2, 4, 6, 4, 2, 0, 2], drums: true },
  seed: 1115,
};

export const AUDIO_RULES = {
  maxSimultaneous: 8,
  fadeSeconds: 0.6,
  voiceMs: 1000,
};
