import { DECOR, PALETTE } from '../../config/style.js';
import { strokePath, trackOffset, withTransform } from './pathDraw.js';
import { pointAt } from '../track/buildTrack.js';

function drawCurbs(ctx, track) {
  const offset = track.halfWidth - DECOR.curbWidth / 2;
  const every = Math.max(1, Math.round(DECOR.curbLength / track.spacing));
  for (let i = 0; i < track.count; i += every) {
    const k = track.curvature[i];
    if (Math.abs(k) < DECOR.curbCurvature) continue;
    const side = k > 0 ? -1 : 1;
    const color = Math.floor(i / every) % 2 === 0 ? PALETTE.curbRed : PALETTE.curbWhite;
    for (const s of [side, -side]) {
      const x = track.xs[i] + track.tys[i] * offset * s;
      const y = track.ys[i] - track.txs[i] * offset * s;
      withTransform(ctx, x, y, Math.atan2(track.tys[i], track.txs[i]), (c) => {
        c.fillStyle = color;
        c.fillRect(-DECOR.curbLength / 2, -DECOR.curbWidth / 2, DECOR.curbLength, DECOR.curbWidth);
      });
    }
  }
}

function drawLaneMarks(ctx, track, lanes) {
  const laneWidth = (track.halfWidth * 2) / lanes;
  for (let l = 1; l < lanes; l += 1) {
    strokePath(ctx, trackOffset(track, -track.halfWidth + laneWidth * l), {
      width: 3,
      color: PALETTE.laneMark,
      closed: track.closed,
      dash: [DECOR.laneDash, DECOR.laneGap],
    });
  }
}

export function drawRoad(ctx, track, { lanes, barrierColor = PALETTE.barrier }) {
  const hw = track.halfWidth;
  const center = trackOffset(track, 0);
  strokePath(ctx, center, { width: hw * 2 + DECOR.barrierWidth * 2, color: barrierColor, closed: track.closed });
  strokePath(ctx, center, { width: hw * 2, color: PALETTE.asphalt, closed: track.closed });
  strokePath(ctx, center, { width: hw * 1.2, color: PALETTE.asphaltLight, closed: track.closed });
  strokePath(ctx, center, { width: hw * 0.9, color: PALETTE.asphalt, closed: track.closed });
  drawLaneMarks(ctx, track, lanes);
  for (const side of [-1, 1]) {
    strokePath(ctx, trackOffset(track, side * (hw - 8)), { width: DECOR.edgeLineWidth, color: PALETTE.edgeLine, closed: track.closed });
    strokePath(ctx, trackOffset(track, side * (hw + DECOR.barrierWidth / 2)), { width: 3, color: PALETTE.barrierTop, closed: track.closed });
  }
  drawCurbs(ctx, track);
}

function checkerLine(ctx, track, s, rows) {
  const p = pointAt(track, s, 0);
  const size = (track.halfWidth * 2) / 12;
  withTransform(ctx, p.x, p.y, p.heading, (c) => {
    for (let r = 0; r < rows; r += 1) {
      for (let k = 0; k < 12; k += 1) {
        c.fillStyle = (k + r) % 2 === 0 ? PALETTE.startLine : PALETTE.asphalt;
        c.fillRect(-size * rows * 0.5 + r * size, -track.halfWidth + k * size, size, size);
      }
    }
  });
}

export function drawStartLine(ctx, track, slots, gridSpacing, laneOffset) {
  checkerLine(ctx, track, track.startS, 2);
  for (let slot = 0; slot < slots; slot += 1) {
    const row = Math.floor(slot / 2);
    const s = track.startS - gridSpacing * (row + 0.5) - (slot % 2) * (gridSpacing / 2);
    const p = pointAt(track, s, slot % 2 === 0 ? -laneOffset : laneOffset);
    withTransform(ctx, p.x, p.y, p.heading, (c) => {
      c.strokeStyle = PALETTE.startLine;
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(DECOR.gridBoxLength / 2, -16);
      c.lineTo(DECOR.gridBoxLength / 2, 16);
      c.stroke();
    });
  }
}

export function drawFinishLine(ctx, track) {
  checkerLine(ctx, track, track.finishS, 3);
}
