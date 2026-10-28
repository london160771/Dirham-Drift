const ALPHA = 0.5;
const EPSILON = 1e-4;

function knot(t, a, b) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return t + Math.max(Math.pow(d, ALPHA), EPSILON);
}

function segmentPoint(p0, p1, p2, p3, u) {
  const t0 = 0;
  const t1 = knot(t0, p0, p1);
  const t2 = knot(t1, p1, p2);
  const t3 = knot(t2, p2, p3);
  const t = t1 + (t2 - t1) * u;
  const lerp = (a, b, ta, tb) => [
    ((tb - t) / (tb - ta)) * a[0] + ((t - ta) / (tb - ta)) * b[0],
    ((tb - t) / (tb - ta)) * a[1] + ((t - ta) / (tb - ta)) * b[1],
  ];
  const a1 = lerp(p0, p1, t0, t1);
  const a2 = lerp(p1, p2, t1, t2);
  const a3 = lerp(p2, p3, t2, t3);
  const b1 = lerp(a1, a2, t0, t2);
  const b2 = lerp(a2, a3, t1, t3);
  return lerp(b1, b2, t1, t2);
}

function extendEnds(points) {
  const first = points[0];
  const second = points[1];
  const last = points[points.length - 1];
  const beforeLast = points[points.length - 2];
  const head = [2 * first[0] - second[0], 2 * first[1] - second[1]];
  const tail = [2 * last[0] - beforeLast[0], 2 * last[1] - beforeLast[1]];
  return [head, ...points, tail];
}

export function sampleSpline(points, { closed = false, stepsPerSegment = 24 } = {}) {
  const ring = closed ? [points[points.length - 1], ...points, points[0], points[1]] : extendEnds(points);
  const out = [];
  const segments = ring.length - 3;
  for (let i = 0; i < segments; i += 1) {
    for (let s = 0; s < stepsPerSegment; s += 1) {
      out.push(segmentPoint(ring[i], ring[i + 1], ring[i + 2], ring[i + 3], s / stepsPerSegment));
    }
  }
  if (!closed) out.push(points[points.length - 1]);
  return out;
}

export function resamplePolyline(points, spacing, closed) {
  const path = closed ? [...points, points[0]] : points;
  const out = [path[0]];
  let carry = 0;
  for (let i = 1; i < path.length; i += 1) {
    const [ax, ay] = path[i - 1];
    const [bx, by] = path[i];
    const length = Math.hypot(bx - ax, by - ay);
    let d = spacing - carry;
    while (d <= length) {
      const u = d / length;
      out.push([ax + (bx - ax) * u, ay + (by - ay) * u]);
      d += spacing;
    }
    carry = length - (d - spacing);
  }
  if (closed) {
    const [fx, fy] = out[0];
    const [lx, ly] = out[out.length - 1];
    if (Math.hypot(fx - lx, fy - ly) < spacing * 0.5) out.pop();
  } else if (carry > spacing * 0.25) {
    out.push(path[path.length - 1]);
  }
  return out;
}
