import { describe, expect, it } from 'vitest';
import { MINIMAP } from '../../src/game/config/minimap.js';
import { TRACKS } from '../../src/game/config/tracks/index.js';
import { buildTrack } from '../../src/game/race/track/buildTrack.js';
import { mapPoint, mapViewBox, trackOutline } from '../../src/game/race/track/mapOutline.js';

describe('minimap outline', () => {
  for (const id of Object.keys(TRACKS)) {
    it(`${id}: follows the road with whole-number points inside the bounds`, () => {
      const track = buildTrack(TRACKS[id]);
      const outline = trackOutline(track);
      expect(outline.closed).toBe(track.closed);
      expect(outline.points.length).toBeLessThanOrEqual(MINIMAP.outlinePoints + 1);
      expect(outline.points.length).toBeGreaterThan(MINIMAP.outlinePoints / 2);
      const { minX, minY, width, height } = outline.bounds;
      for (const [x, y] of [...outline.points, outline.finish]) {
        expect(Number.isInteger(x) && Number.isInteger(y)).toBe(true);
        expect(x).toBeGreaterThanOrEqual(minX - track.spacing);
        expect(x).toBeLessThanOrEqual(minX + width + track.spacing);
        expect(y).toBeGreaterThanOrEqual(minY - track.spacing);
        expect(y).toBeLessThanOrEqual(minY + height + track.spacing);
      }
      expect(outline.points[0]).toEqual(mapPoint(outline, track.xs[0], track.ys[0]));
      if (!track.closed) expect(outline.points.at(-1)).toEqual(mapPoint(outline, track.xs.at(-1), track.ys.at(-1)));
      expect(height).toBeGreaterThanOrEqual(width);
    });
  }

  it('turns the sprint so the finish is at the top', () => {
    const track = buildTrack(TRACKS.sheikhZayed);
    const outline = trackOutline(track);
    expect(outline.finish[1]).toBeLessThan(outline.points[0][1]);
  });

  it('pads the view box on every side', () => {
    const box = mapViewBox({ minX: 0, minY: 0, width: 1000, height: 500 });
    const pad = 1000 * MINIMAP.paddingRatio;
    expect(box).toEqual({ x: -pad, y: -pad, width: 1000 + pad * 2, height: 500 + pad * 2, span: 1000 });
  });
});
