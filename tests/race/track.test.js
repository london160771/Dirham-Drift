import { describe, expect, it } from 'vitest';
import { TRACKS } from '../../src/game/config/tracks/index.js';
import { buildTrack, locate, pointAt } from '../../src/game/race/track/buildTrack.js';

describe('track geometry', () => {
  const marina = buildTrack(TRACKS.marina);
  const sprint = buildTrack(TRACKS.sheikhZayed);

  it('builds the Marina circuit as a closed loop with evenly spaced samples', () => {
    expect(marina.closed).toBe(true);
    expect(marina.count).toBeGreaterThan(500);
    const lastGap = Math.hypot(marina.xs[0] - marina.xs[marina.count - 1], marina.ys[0] - marina.ys[marina.count - 1]);
    expect(lastGap).toBeLessThan(marina.spacing * 1.5);
  });

  it('builds the Sheikh Zayed sprint as an open road with the finish before the end', () => {
    expect(sprint.closed).toBe(false);
    expect(sprint.finishS).toBeGreaterThan(sprint.startS);
    expect(sprint.finishS).toBeLessThan(sprint.length);
  });

  it('locates a point back onto the centre line', () => {
    for (const track of [marina, sprint]) {
      const p = pointAt(track, 1500, 40);
      const loc = locate(track, p.x, p.y);
      expect(loc.s).toBeCloseTo(1500, 0);
      expect(loc.lateral).toBeCloseTo(40, 0);
    }
  });

  it('puts the start line on a straight part of the Marina circuit', () => {
    const i = Math.round(marina.startS / marina.spacing);
    expect(Math.abs(marina.curvature[i])).toBeLessThan(0.002);
  });
});
