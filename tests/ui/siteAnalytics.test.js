import { describe, expect, it } from 'vitest';
import { analyticsAllowed } from '../../src/ui/siteAnalytics.js';

const site = { hostname: 'dirham-drift.vercel.app', framed: false, production: true };

describe('Vercel Web Analytics switch', () => {
  it('is on for the production website only', () => {
    expect(analyticsAllowed(site)).toBe(true);
    expect(analyticsAllowed({ ...site, hostname: 'html-classic.itch.zone' })).toBe(false);
    expect(analyticsAllowed({ ...site, framed: true })).toBe(false);
    expect(analyticsAllowed({ ...site, production: false })).toBe(false);
  });
});
