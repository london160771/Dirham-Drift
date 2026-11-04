import { inject } from '@vercel/analytics';
import { isFramed, isItchHost } from './pwa/pwaHost.js';

export function analyticsAllowed({ hostname, framed, production }) {
  return production && !framed && !isItchHost(hostname);
}

export function startSiteAnalytics() {
  if (!analyticsAllowed({ hostname: window.location.hostname, framed: isFramed(), production: import.meta.env.PROD })) return false;
  inject({ framework: 'vite' });
  return true;
}
