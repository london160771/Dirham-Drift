import { DECOR, PALETTE } from '../../config/style.js';
import { withTransform } from './pathDraw.js';

export function drawPalm(ctx, x, y, rng) {
  const r = DECOR.palmRadius * rng.range(0.8, 1.15);
  const leaves = 7;
  const turn = rng.range(0, Math.PI);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.arc(x + 6, y + 6, r * 0.9, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < leaves; i += 1) {
    withTransform(ctx, x, y, turn + (i * Math.PI * 2) / leaves, (c) => {
      c.fillStyle = i % 2 === 0 ? PALETTE.palmLeaf : PALETTE.palmLeafLight;
      c.beginPath();
      c.ellipse(r * 0.5, 0, r * 0.55, r * 0.17, 0, 0, Math.PI * 2);
      c.fill();
    });
  }
  ctx.fillStyle = PALETTE.palmTrunk;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.16, 0, Math.PI * 2);
  ctx.fill();
}

export function drawLamp(ctx, x, y) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, DECOR.lampGlowRadius);
  glow.addColorStop(0, PALETTE.lampGlow);
  glow.addColorStop(1, 'rgba(255, 214, 140, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, DECOR.lampGlowRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.lampCore;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawWindows(c, w, h, rng) {
  const gap = 14;
  for (let wx = -w / 2 + 10; wx < w / 2 - 8; wx += gap) {
    for (let wy = -h / 2 + 10; wy < h / 2 - 8; wy += gap) {
      const roll = rng.next();
      if (roll > 0.55) continue;
      c.fillStyle = roll < 0.12 ? PALETTE.towerWindowTeal : PALETTE.towerWindow;
      c.fillRect(wx, wy, 5, 5);
    }
  }
}

function drawRoof(c, w, h, rng) {
  const roll = rng.next();
  if (roll < 0.35) {
    c.fillStyle = PALETTE.pool;
    c.fillRect(-w * 0.3, -h * 0.18, w * 0.6, h * 0.36);
  } else if (roll < 0.65) {
    const r = Math.min(w, h) * 0.3;
    c.fillStyle = PALETTE.helipad;
    c.beginPath();
    c.arc(0, 0, r, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = PALETTE.towerBase;
    c.beginPath();
    c.arc(0, 0, r * 0.82, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = PALETTE.helipadMark;
    c.font = `bold ${Math.round(r)}px sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('H', 0, 0);
  }
}

export function drawTower(ctx, x, y, angle, size, rng) {
  const w = size;
  const h = size * rng.range(0.75, 1.25);
  withTransform(ctx, x, y, angle, (c) => {
    c.fillStyle = 'rgba(0,0,0,0.45)';
    c.fillRect(-w / 2 + 14, -h / 2 + 14, w, h);
    c.fillStyle = PALETTE.towerBase;
    c.fillRect(-w / 2, -h / 2, w, h);
    c.strokeStyle = PALETTE.towerEdge;
    c.lineWidth = 4;
    c.strokeRect(-w / 2, -h / 2, w, h);
    drawWindows(c, w, h, rng);
    drawRoof(c, w, h, rng);
  });
}

export function drawYacht(ctx, x, y, angle, length) {
  const w = length * 0.32;
  withTransform(ctx, x, y, angle, (c) => {
    c.fillStyle = 'rgba(0,0,0,0.3)';
    c.beginPath();
    c.ellipse(4, 4, length / 2, w / 2, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = PALETTE.yachtHull;
    c.beginPath();
    c.moveTo(length / 2, 0);
    c.quadraticCurveTo(length * 0.2, -w / 2, -length / 2, -w * 0.42);
    c.lineTo(-length / 2, w * 0.42);
    c.quadraticCurveTo(length * 0.2, w / 2, length / 2, 0);
    c.fill();
    c.fillStyle = PALETTE.yachtDeck;
    c.fillRect(-length * 0.3, -w * 0.24, length * 0.42, w * 0.48);
    c.fillStyle = PALETTE.teal;
    c.fillRect(-length * 0.05, -w * 0.12, length * 0.12, w * 0.24);
  });
}

export function drawWater(ctx, points, rng) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (const [x, y] of points) ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fillStyle = PALETTE.water;
  ctx.fill();
  ctx.clip();
  ctx.strokeStyle = PALETTE.waterShine;
  ctx.lineWidth = 2;
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  for (let y = minY; y < maxY; y += 46) {
    const x = rng.range(minX, maxX);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + rng.range(30, 90), y);
    ctx.stroke();
  }
  ctx.restore();
}
