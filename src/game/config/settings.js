import { DEFAULT_DIFFICULTY } from './race.js';

export const SETTING_DEFAULTS = {
  showFps: false,
  hintsSeen: false,
  pitTipsSeen: false,
  steeringAssist: false,
  autoAccelerate: false,
  chillMode: false,
  textSize: 'M',
  colorBlind: false,
  reduceMotion: false,
  leftHanded: false,
  controlSize: 'M',
  vibration: true,
  musicVolume: 60,
  effectsVolume: 80,
  language: 'en',
  difficulty: DEFAULT_DIFFICULTY,
};

export const SIZE_STEPS = {
  textSize: { S: 0.9, M: 1, L: 1.18 },
  controlSize: { S: 0.85, M: 1, L: 1.2 },
};

export const VOLUME = {
  step: 10,
  max: 100,
};

export const ASSISTS = {
  steeringStrength: 2.4,
  steeringLookAhead: 140,
  chillRivalPace: 0.9,
  chillDamageTaken: 0.5,
  vibrationMs: 40,
};
