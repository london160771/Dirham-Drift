import { PWA_RULES } from '../../game/config/app.js';

const MS_PER_MINUTE = 60 * 1000;
const state = { apply: null, listeners: new Set() };

function notify() {
  state.listeners.forEach((fn) => fn(Boolean(state.apply)));
}

export function setUpdateReady(apply) {
  state.apply = apply;
  notify();
}

export function isUpdateReady() {
  return Boolean(state.apply);
}

export function onUpdateChange(fn) {
  state.listeners.add(fn);
  return () => state.listeners.delete(fn);
}

export function applyUpdate() {
  if (state.apply) state.apply();
}

export function showsUpdateBar(screenName) {
  return PWA_RULES.updateBarScreens.includes(screenName);
}

export function watchForUpdates(registration, { win = window, doc = document } = {}) {
  const check = () => {
    if (win.navigator.onLine !== false) registration.update().catch(() => {});
  };
  win.setInterval(check, PWA_RULES.updateCheckMinutes * MS_PER_MINUTE);
  doc.addEventListener('visibilitychange', () => {
    if (doc.visibilityState === 'visible') check();
  });
}
