import { RACE } from '../../config/race.js';
import { marinaPath, sprintPath } from './paths.js';

const SEARCH_WINDOW = 40;

function frames(points, closed) {
  const count = points.length;
  const xs = new Float64Array(count);
  const ys = new Float64Array(count);
  const txs = new Float64Array(count);
  const tys = new Float64Array(count);
  const ss = new Float64Array(count);
  const curvature = new Float64Array(count);
  let length = 0;
  for (let i = 0; i < count; i += 1) {
    xs[i] = points[i][0];
    ys[i] = points[i][1];
    if (i > 0) length += Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]);
    ss[i] = length;
  }
  if (closed) length += Math.hypot(xs[0] - xs[count - 1], ys[0] - ys[count - 1]);
  const at = (i) => (closed ? (i + count) % count : Math.min(count - 1, Math.max(0, i)));
  for (let i = 0; i < count; i += 1) {
    const a = at(i - 1);
    const b = at(i + 1);
    const dx = xs[b] - xs[a];
    const dy = ys[b] - ys[a];
    const len = Math.hypot(dx, dy) || 1;
    txs[i] = dx / len;
    tys[i] = dy / len;
  }
  for (let i = 0; i < count; i += 1) {
    const a = at(i - 1);
    const b = at(i + 1);
    const cross = txs[a] * tys[b] - tys[a] * txs[b];
    const dot = txs[a] * txs[b] + tys[a] * tys[b];
    const ds = Math.hypot(xs[b] - xs[a], ys[b] - ys[a]) || 1;
    curvature[i] = Math.atan2(cross, dot) / ds;
  }
  return { count, xs, ys, txs, tys, ss, curvature, length };
}

function boundsOf(f, margin) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < f.count; i += 1) {
    minX = Math.min(minX, f.xs[i]);
    minY = Math.min(minY, f.ys[i]);
    maxX = Math.max(maxX, f.xs[i]);
    maxY = Math.max(maxY, f.ys[i]);
  }
  return { minX: minX - margin, minY: minY - margin, maxX: maxX + margin, maxY: maxY + margin };
}

function checkpointsFor(startS, endS, count) {
  const out = [];
  for (let i = 1; i <= count; i += 1) out.push(startS + ((endS - startS) * i) / count);
  return out;
}

export function buildTrack(config) {
  const closed = config.kind === 'circuit';
  const points = closed ? marinaPath(config) : sprintPath(config);
  const f = frames(points, closed);
  const startS = config.startDistance;
  const finishS = closed ? startS : f.length - config.finishFromEnd;
  const lapEnd = closed ? startS + f.length : finishS;
  return {
    ...f,
    id: config.id,
    kind: config.kind,
    closed,
    config,
    laps: config.laps,
    halfWidth: config.roadHalfWidth,
    spacing: config.sampleSpacing,
    startS,
    finishS,
    checkpoints: checkpointsFor(startS, lapEnd, RACE.checkpointCount),
    bounds: boundsOf(f, config.margin),
  };
}

export function wrapIndex(track, i) {
  if (track.closed) return ((i % track.count) + track.count) % track.count;
  return Math.min(track.count - 1, Math.max(0, i));
}

function nearestIndex(track, x, y, hint) {
  const { xs, ys, count } = track;
  const global = hint < 0;
  const from = global ? 0 : hint - SEARCH_WINDOW;
  const to = global ? count - 1 : hint + SEARCH_WINDOW;
  let best = 0;
  let bestD = Infinity;
  for (let j = from; j <= to; j += 1) {
    const i = wrapIndex(track, j);
    const dx = x - xs[i];
    const dy = y - ys[i];
    const d = dx * dx + dy * dy;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

export function locate(track, x, y, hint = -1, out = {}) {
  const i = nearestIndex(track, x, y, hint);
  const dx = x - track.xs[i];
  const dy = y - track.ys[i];
  const along = dx * track.txs[i] + dy * track.tys[i];
  out.index = i;
  out.s = track.ss[i] + along;
  out.lateral = dx * track.tys[i] - dy * track.txs[i];
  return out;
}

export function pointAt(track, s, lateral = 0, out = {}) {
  const wrapped = track.closed ? ((s % track.length) + track.length) % track.length : s;
  const i = wrapIndex(track, Math.floor(wrapped / track.spacing));
  const along = wrapped - track.ss[i];
  const tx = track.txs[i];
  const ty = track.tys[i];
  out.x = track.xs[i] + tx * along + ty * lateral;
  out.y = track.ys[i] + ty * along - tx * lateral;
  out.heading = Math.atan2(ty, tx);
  out.index = i;
  return out;
}
