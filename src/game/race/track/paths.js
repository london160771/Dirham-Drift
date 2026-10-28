import { resamplePolyline, sampleSpline } from './spline.js';

const ARC_STEPS = 48;

function tangentsOf(points) {
  return points.map((_, i) => {
    const a = points[Math.max(0, i - 1)];
    const b = points[Math.min(points.length - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  });
}

export function offsetPoints(points, distance) {
  const tangents = tangentsOf(points);
  return points.map(([x, y], i) => {
    const [tx, ty] = tangents[i];
    return [x + ty * distance, y - tx * distance];
  });
}

function arc(center, left, forward, radius, flip) {
  const out = [];
  for (let i = 1; i < ARC_STEPS; i += 1) {
    const angle = (Math.PI * i) / ARC_STEPS;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const sign = flip ? -1 : 1;
    out.push([
      center[0] + sign * radius * (left[0] * c + forward[0] * s),
      center[1] + sign * radius * (left[1] * c + forward[1] * s),
    ]);
  }
  return out;
}

export function sampleSpine(spine, spacing) {
  return resamplePolyline(sampleSpline(spine), spacing, false);
}

export function marinaPath(config) {
  const spine = sampleSpine(config.spine, config.sampleSpacing);
  const tangents = tangentsOf(spine);
  const west = offsetPoints(spine, config.sideGap);
  const east = offsetPoints(spine, -config.sideGap).reverse();
  const end = spine.length - 1;
  const leftAt = (i) => [tangents[i][1], -tangents[i][0]];
  const north = arc(spine[end], leftAt(end), tangents[end], config.sideGap, false);
  const south = arc(spine[0], leftAt(0), tangents[0], config.sideGap, true);
  return resamplePolyline([...west, ...north, ...east, ...south], config.sampleSpacing, true);
}

export function sprintPath(config) {
  return resamplePolyline(sampleSpline(config.path), config.sampleSpacing, false);
}
