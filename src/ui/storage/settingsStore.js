const KEY = 'dirham-drift:settings';
const DEFAULTS = { showFps: false, hintsSeen: false };

export function loadSettings() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
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
