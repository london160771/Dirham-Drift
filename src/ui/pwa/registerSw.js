import { currentPwaAllowed } from './pwaHost.js';
import { watchInstallPrompt } from './installPrompt.js';
import { setUpdateReady, watchForUpdates } from './appUpdate.js';

let reloading = false;

function reloadOnce() {
  if (reloading) return;
  reloading = true;
  window.location.reload();
}

export function registerPwa() {
  if (!currentPwaAllowed()) return false;
  watchInstallPrompt();
  import('virtual:pwa-register').then(({ registerSW }) => {
    const updateSW = registerSW({
      immediate: true,
      onNeedReload: reloadOnce,
      onNeedRefresh: () =>
        setUpdateReady(() => {
          navigator.serviceWorker.addEventListener('controllerchange', reloadOnce, { once: true });
          updateSW();
        }),
      onRegisteredSW: (_url, registration) => registration && watchForUpdates(registration),
    });
  });
  return true;
}
