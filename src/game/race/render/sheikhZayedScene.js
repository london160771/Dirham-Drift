import { RACE } from '../../config/race.js';
import { DECOR, PALETTE } from '../../config/style.js';
import { createRng } from '../../engine/rng.js';
import { pointAt } from '../track/buildTrack.js';
import { drawLamp, drawTower } from './decor.js';
import { strokePath, trackOffset, withTransform } from './pathDraw.js';
import { drawFinishLine, drawRoad, drawStartLine } from './road.js';

const SCENE_SEED = 7300;

export function sheikhZayedLayout(track) {
  const c = track.config;
  const medianCenter = track.halfWidth + c.medianWidth / 2;
  const oncomingCenter = track.halfWidth + c.medianWidth + c.oncomingWidth / 2;
  return { medianCenter, oncomingCenter, metroCenter: -(track.halfWidth + c.metroOffset) };
}

function drawMedian(ctx, track, layout) {
  const c = track.config;
  strokePath(ctx, trackOffset(track, layout.oncomingCenter), { width: c.oncomingWidth, color: PALETTE.asphalt });
  strokePath(ctx, trackOffset(track, layout.oncomingCenter), { width: 3, color: PALETTE.laneMark, dash: [DECOR.laneDash, DECOR.laneGap] });
  strokePath(ctx, trackOffset(track, layout.medianCenter), { width: c.medianWidth, color: PALETTE.medianCore });
  strokePath(ctx, trackOffset(track, layout.medianCenter), { width: 10, color: PALETTE.medianGlow });
  for (let s = 0; s < track.length; s += DECOR.lampSpacing / 2) {
    const p = pointAt(track, s, layout.medianCenter);
    ctx.fillStyle = PALETTE.teal;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMetro(ctx, track, layout) {
  const center = trackOffset(track, layout.metroCenter);
  for (let s = 0; s < track.length; s += 160) {
    const p = pointAt(track, s, layout.metroCenter);
    withTransform(ctx, p.x, p.y, p.heading, (c) => {
      c.fillStyle = PALETTE.metroPillar;
      c.fillRect(-14, -26, 28, 52);
    });
  }
  strokePath(ctx, center, { width: 52, color: PALETTE.metroTrack });
  for (const side of [-1, 1]) strokePath(ctx, trackOffset(track, layout.metroCenter + side * 9), { width: 3, color: PALETTE.overpassEdge });
}

function drawSides(ctx, track, layout, rng) {
  for (let s = 0; s < track.length; s += DECOR.lampSpacing) {
    for (const lateral of [-(track.halfWidth + 24), layout.oncomingCenter + track.config.oncomingWidth / 2 + 24]) {
      const p = pointAt(track, s, lateral);
      drawLamp(ctx, p.x, p.y);
    }
  }
  for (let s = 0; s < track.length; s += DECOR.towerSpacing) {
    const size = rng.range(DECOR.towerMin, DECOR.towerMax);
    const north = pointAt(track, s, layout.oncomingCenter + track.config.oncomingWidth / 2 + 90 + size / 2);
    drawTower(ctx, north.x, north.y, north.heading, size, rng);
    const southSize = rng.range(DECOR.towerMin, DECOR.towerMax);
    const south = pointAt(track, s + DECOR.towerSpacing / 2, layout.metroCenter - 70 - southSize / 2);
    drawTower(ctx, south.x, south.y, south.heading, southSize, rng);
  }
}

function drawInterchangeShadows(ctx, track) {
  const c = track.config;
  for (const s of c.interchanges) {
    const p = pointAt(track, s, 0);
    withTransform(ctx, p.x + 30, p.y + 30, p.heading + c.interchangeAngle, (g) => {
      g.fillStyle = PALETTE.overpassShadow;
      g.fillRect(-900, -c.interchangeWidth / 2, 1800, c.interchangeWidth);
    });
  }
}

export function drawSheikhZayed(ctx, track) {
  const { bounds } = track;
  const rng = createRng(SCENE_SEED);
  const layout = sheikhZayedLayout(track);
  ctx.fillStyle = PALETTE.sand;
  ctx.fillRect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
  drawMedian(ctx, track, layout);
  drawRoad(ctx, track, { lanes: track.config.laneCount });
  drawStartLine(ctx, track, RACE.carCount, RACE.gridRowSpacing, RACE.gridLaneOffset);
  drawFinishLine(ctx, track);
  drawMetro(ctx, track, layout);
  drawSides(ctx, track, layout, rng);
  drawInterchangeShadows(ctx, track);
}

export function drawOverpass(ctx, track, s) {
  const c = track.config;
  const p = pointAt(track, s, 0);
  withTransform(ctx, p.x, p.y, p.heading + c.interchangeAngle, (g) => {
    g.fillStyle = PALETTE.overpass;
    g.fillRect(-900, -c.interchangeWidth / 2, 1800, c.interchangeWidth);
    g.fillStyle = PALETTE.overpassEdge;
    g.fillRect(-900, -c.interchangeWidth / 2, 1800, 6);
    g.fillRect(-900, c.interchangeWidth / 2 - 6, 1800, 6);
    g.setLineDash([DECOR.laneDash, DECOR.laneGap]);
    g.strokeStyle = PALETTE.laneMark;
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(-900, 0);
    g.lineTo(900, 0);
    g.stroke();
    g.setLineDash([]);
  });
}
