import { currentPwaAllowed } from './pwaHost.js';
import { watchInstallPrompt } from './installPrompt.js';

export function registerPwa() {
  if (!currentPwaAllowed()) return false;
  watchInstallPrompt();
  import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true }));
  return true;
}
