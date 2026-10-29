const state = { event: null, listeners: new Set() };

function notify() {
  state.listeners.forEach((fn) => fn(Boolean(state.event)));
}

export function watchInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    state.event = event;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    state.event = null;
    notify();
  });
}

export function canPromptInstall() {
  return Boolean(state.event);
}

export function onInstallPromptChange(fn) {
  state.listeners.add(fn);
  return () => state.listeners.delete(fn);
}

export async function promptInstall() {
  if (!state.event) return false;
  const event = state.event;
  state.event = null;
  notify();
  await event.prompt();
  return true;
}
