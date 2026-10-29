import { describe, expect, it } from 'vitest';
import { isItchHost, pwaAllowed } from '../../src/ui/pwa/pwaHost.js';

const site = { hostname: 'dirham-drift.vercel.app', framed: false, hasServiceWorker: true };

describe('PWA switch (FR-PWA-002)', () => {
  it('recognises itch.io game domains', () => {
    for (const host of ['itch.io', 'ayyoweb3.itch.io', 'html-classic.itch.zone', 'v6p9d9t4.ssl.hwcdn.net']) expect(isItchHost(host)).toBe(true);
    expect(isItchHost('dirham-drift.vercel.app')).toBe(false);
    expect(isItchHost('notitch.io.example.com')).toBe(false);
  });

  it('is on for the website and off on itch.io, inside any iframe, or without service workers', () => {
    expect(pwaAllowed(site)).toBe(true);
    expect(pwaAllowed({ ...site, hostname: 'html.itch.zone' })).toBe(false);
    expect(pwaAllowed({ ...site, framed: true })).toBe(false);
    expect(pwaAllowed({ ...site, hasServiceWorker: false })).toBe(false);
  });
});
