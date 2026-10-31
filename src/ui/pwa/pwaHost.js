import { PWA_RULES } from '../../game/config/app.js';

export function isItchHost(hostname) {
  return PWA_RULES.blockedHostSuffixes.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`));
}

export function pwaAllowed({ hostname, framed, hasServiceWorker }) {
  return hasServiceWorker && !framed && !isItchHost(hostname);
}

function isFramed() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function currentPwaAllowed() {
  return pwaAllowed({ hostname: window.location.hostname, framed: isFramed(), hasServiceWorker: 'serviceWorker' in navigator });
}

export function isStandalone() {
  const standaloneDisplay = typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches;
  return standaloneDisplay || window.navigator.standalone === true;
}
