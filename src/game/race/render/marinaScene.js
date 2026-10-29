import { RACE } from '../../config/race.js';
import { DECOR, PALETTE, SCENE_ART } from '../../config/style.js';
import { createRng } from '../../engine/rng.js';
import { sampleSpine } from '../track/paths.js';
import { drawLamp, drawPalm, drawTower, drawWater, drawYacht } from './decor.js';
import { frameAt, offsetPath, strokePath, trackOffset } from './pathDraw.js';
import { artList, tiledFill } from './raceArt.js';
import { drawRoad, drawStartLine } from './road.js';

const SCENE_SEED = 4100;

function spineFrames(config) {
  const spine = sampleSpine(config.spine, config.sampleSpacing);
  const xs = spine.map((p) => p[0]);
  const ys = spine.map((p) => p[1]);
  const t = spine.map((_, i) => frameAt(spine, i).angle);
  return { spine, xs, ys, txs: t.map(Math.cos), tys: t.map(Math.sin), angles: t };
}

function canalPolygon(f, half, seaY) {
  const left = offsetPath(f.xs, f.ys, f.txs, f.tys, half);
  const right = offsetPath(f.xs, f.ys, f.txs, f.tys, -half).reverse();
  const top = [left[left.length - 1][0], seaY];
  const topRight = [right[0][0], seaY];
  return [...left, top, topRight, ...right];
}

function alongSpine(f, spacing, from, to, visit) {
  const step = Math.max(1, Math.round(spacing / 8));
  for (let i = from; i < f.spine.length - to; i += step) visit(i);
}

function sidePoint(f, i, lateral) {
  return [f.xs[i] + f.tys[i] * lateral, f.ys[i] - f.txs[i] * lateral];
}

function drawCanalSide(ctx, f, config, rng, art) {
  const roofs = artList(art, SCENE_ART.roofs);
  const promenade = config.sideGap - config.roadHalfWidth - config.promenadeWidth / 2;
  const outer = config.sideGap + config.roadHalfWidth + 26;
  const towerBase = config.sideGap + config.roadHalfWidth + DECOR.towerSetback;
  alongSpine(f, DECOR.palmSpacing, 2, 2, (i) => {
    for (const s of [-1, 1]) drawPalm(ctx, ...sidePoint(f, i, s * promenade), rng, art[SCENE_ART.palm]);
  });
  alongSpine(f, DECOR.lampSpacing, 0, 0, (i) => {
    for (const s of [-1, 1]) drawLamp(ctx, ...sidePoint(f, i, s * outer));
  });
  alongSpine(f, DECOR.towerSpacing, 8, 8, (i) => {
    for (const s of [-1, 1]) {
      const size = rng.range(DECOR.towerMin, DECOR.towerMax);
      drawTower(ctx, ...sidePoint(f, i, s * (towerBase + size / 2)), f.angles[i], size, rng, roofs);
    }
  });
  alongSpine(f, 280, 6, 6, (i) => {
    if (rng.next() < 0.6) drawYacht(ctx, ...sidePoint(f, i, rng.range(-30, 30)), f.angles[i], rng.range(60, 96), art[SCENE_ART.yacht]);
  });
}

function drawSea(ctx, config, bounds, rng, art, water) {
  const seaY = config.seaEdgeY;
  drawWater(ctx, [[bounds.minX, bounds.minY], [bounds.maxX, bounds.minY], [bounds.maxX, seaY], [bounds.minX, seaY]], rng, water);
  for (let k = 0; k < DECOR.yachtCount; k += 1) {
    drawYacht(ctx, rng.range(bounds.minX + 80, bounds.maxX - 80), rng.range(bounds.minY + 60, seaY - 160), rng.range(-0.4, 0.4), rng.range(70, 140), art[SCENE_ART.yacht]);
  }
}

export function drawMarina(ctx, track, art) {
  const { config, bounds } = track;
  const rng = createRng(SCENE_SEED);
  const f = spineFrames(config);
  const water = tiledFill(ctx, art.water, SCENE_ART.textureTiles.water, PALETTE.water);
  ctx.fillStyle = PALETTE.ground;
  ctx.fillRect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
  strokePath(ctx, f.spine, { width: (config.sideGap + config.roadHalfWidth + 60) * 2, color: tiledFill(ctx, art.promenade, SCENE_ART.textureTiles.promenade, PALETTE.promenade), cap: 'round' });
  strokePath(ctx, trackOffset(track, 0), { width: config.roadHalfWidth * 2 + 70, color: PALETTE.promenadeTile, closed: true });
  drawSea(ctx, config, bounds, rng, art, water);
  drawWater(ctx, canalPolygon(f, config.sideGap - config.roadHalfWidth - config.promenadeWidth, config.seaEdgeY), rng, water);
  drawRoad(ctx, track, { lanes: 3, barrierColor: PALETTE.bridgeRail });
  drawStartLine(ctx, track, RACE.carCount, RACE.gridRowSpacing, RACE.gridLaneOffset);
  drawCanalSide(ctx, f, config, rng, art);
}
