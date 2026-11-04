import { MINIMAP } from '../../config/minimap.js';
import { pointAt } from './buildTrack.js';

const QUARTER_TURNS = [
  (x, y) => [x, y],
  (x, y) => [-y, x],
  (x, y) => [-x, -y],
  (x, y) => [y, -x],
];

function boundsOf(points) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return { minX, minY, width: Math.max(...xs) - minX, height: Math.max(...ys) - minY };
}

function samples(track, maxPoints) {
  const step = Math.max(1, Math.ceil(track.count / maxPoints));
  const raw = [];
  for (let i = 0; i < track.count; i += step) raw.push([track.xs[i], track.ys[i]]);
  const last = track.count - 1;
  if (!track.closed && last % step !== 0) raw.push([track.xs[last], track.ys[last]]);
  return raw;
}

function uprightTurn(track, raw) {
  const { width, height } = boundsOf(raw);
  const options = width > height ? [1, 3] : [0, 2];
  const start = pointAt(track, track.startS);
  const [, upY] = QUARTER_TURNS[options[0]](Math.cos(start.heading), Math.sin(start.heading));
  return upY <= 0 ? options[0] : options[1];
}

export function mapPoint(outline, x, y) {
  return QUARTER_TURNS[outline.turn](x, y).map(Math.round);
}

export function trackOutline(track, maxPoints = MINIMAP.outlinePoints) {
  const raw = samples(track, maxPoints);
  const turn = uprightTurn(track, raw);
  const outline = { turn, closed: track.closed };
  const points = raw.map(([x, y]) => mapPoint(outline, x, y));
  const finish = pointAt(track, track.finishS);
  return { ...outline, points, finish: mapPoint(outline, finish.x, finish.y), bounds: boundsOf(points) };
}

export function mapViewBox(bounds) {
  const span = Math.max(bounds.width, bounds.height);
  const pad = span * MINIMAP.paddingRatio;
  return { x: bounds.minX - pad, y: bounds.minY - pad, width: bounds.width + pad * 2, height: bounds.height + pad * 2, span };
}
