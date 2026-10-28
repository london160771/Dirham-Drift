import { DECOR, DEPTH, PALETTE } from '../../config/style.js';
import { pointAt } from '../track/buildTrack.js';
import { bakeLayer, bakeRegion, rotatedRectBounds } from '../render/bake.js';
import { drawMarina } from '../render/marinaScene.js';
import { withTransform } from '../render/pathDraw.js';
import { drawOverpass, drawSheikhZayed } from '../render/sheikhZayedScene.js';

const DRAWERS = { marina: drawMarina, sheikhZayed: drawSheikhZayed };
const OVERPASS_HALF_LENGTH = 900;
const GANTRY_OVERHANG = 30;

function drawGantry(ctx, track, s) {
  const p = pointAt(track, s, 0);
  const half = track.halfWidth + GANTRY_OVERHANG;
  withTransform(ctx, p.x, p.y, p.heading, (c) => {
    c.fillStyle = PALETTE.gantryDark;
    c.fillRect(-DECOR.startGantryDepth / 2, -half, DECOR.startGantryDepth, half * 2);
    c.fillStyle = PALETTE.gantry;
    c.fillRect(-DECOR.startGantryDepth / 2, -half, DECOR.startGantryDepth, 5);
    c.fillRect(-DECOR.startGantryDepth / 2, half - 5, DECOR.startGantryDepth, 5);
    for (let k = -half + 24; k < half - 20; k += 28) {
      c.fillStyle = PALETTE.danger;
      c.beginPath();
      c.arc(0, k, 4, 0, Math.PI * 2);
      c.fill();
    }
  });
}

function bakeGantry(scene, track, key, s, scale) {
  const p = pointAt(track, s, 0);
  const rect = rotatedRectBounds(p.x, p.y, p.heading, DECOR.startGantryDepth, track.halfWidth + GANTRY_OVERHANG + 4);
  return bakeRegion(scene, key, rect, scale, (ctx) => drawGantry(ctx, track, s), DEPTH.overlay);
}

function bakeOverpasses(scene, track, scale) {
  return track.config.interchanges.map((s, i) => {
    const p = pointAt(track, s, 0);
    const rect = rotatedRectBounds(p.x, p.y, p.heading + track.config.interchangeAngle, OVERPASS_HALF_LENGTH, track.config.interchangeWidth / 2);
    return bakeRegion(scene, `overpass-${i}`, rect, scale, (ctx) => drawOverpass(ctx, track, s), DEPTH.overlay);
  });
}

export function bakeScaleFor(zoom) {
  return Math.min(DECOR.bakeScaleMax, Math.max(DECOR.bakeScaleMin, zoom * DECOR.bakeScalePerZoom));
}

export function buildTrackVisuals(scene, track, scale) {
  const images = bakeLayer(scene, `track-${track.id}`, track.bounds, scale, (ctx) => DRAWERS[track.id](ctx, track), DEPTH.track);
  images.push(bakeGantry(scene, track, 'gantry-start', track.startS + DECOR.startGantryDepth, scale));
  if (!track.closed) {
    images.push(bakeGantry(scene, track, 'gantry-finish', track.finishS, scale));
    images.push(...bakeOverpasses(scene, track, scale));
  }
  return images;
}
