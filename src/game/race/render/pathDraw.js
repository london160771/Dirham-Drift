export function offsetPath(xs, ys, txs, tys, lateral, from = 0, to = xs.length - 1) {
  const out = [];
  for (let i = from; i <= to; i += 1) out.push([xs[i] + tys[i] * lateral, ys[i] - txs[i] * lateral]);
  return out;
}

export function trackOffset(track, lateral) {
  return offsetPath(track.xs, track.ys, track.txs, track.tys, lateral);
}

export function tracePath(ctx, points, closed) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  if (closed) ctx.closePath();
}

export function strokePath(ctx, points, { width, color, closed = false, dash = null, cap = 'butt' }) {
  tracePath(ctx, points, closed);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.lineCap = cap;
  ctx.lineJoin = 'round';
  ctx.setLineDash(dash || []);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function fillPolygon(ctx, points, color) {
  tracePath(ctx, points, true);
  ctx.fillStyle = color;
  ctx.fill();
}

export function withTransform(ctx, x, y, angle, draw) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  draw(ctx);
  ctx.restore();
}

export function frameAt(points, i) {
  const a = points[Math.max(0, i - 1)];
  const b = points[Math.min(points.length - 1, i + 1)];
  return { x: points[i][0], y: points[i][1], angle: Math.atan2(b[1] - a[1], b[0] - a[0]) };
}
