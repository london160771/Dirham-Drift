import { SETTING_DEFAULTS } from '../../game/config/settings.js';

const KEY = 'dirham-drift:settings';

function systemDefaults() {
  const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return { ...SETTING_DEFAULTS, reduceMotion: reduce };
}

export function loadSettings() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...systemDefaults(), ...JSON.parse(raw) } : systemDefaults();
  } catch {
    return systemDefaults();
  }
}

export function saveSettings(settings) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    return settings;
  }
  return settings;
}

export function updateSettings(patch) {
  return saveSettings({ ...loadSettings(), ...patch });
}
