import { SIZE_STEPS } from '../game/config/settings.js';

const FLAGS = { colorBlind: 'cb-safe', reduceMotion: 'reduce-motion', leftHanded: 'left-handed' };

export function applySettings(settings, root = document.documentElement) {
  for (const [key, className] of Object.entries(FLAGS)) root.classList.toggle(className, Boolean(settings[key]));
  root.style.setProperty('--text-scale', String(SIZE_STEPS.textSize[settings.textSize] ?? 1));
  root.style.setProperty('--control-scale', String(SIZE_STEPS.controlSize[settings.controlSize] ?? 1));
}
