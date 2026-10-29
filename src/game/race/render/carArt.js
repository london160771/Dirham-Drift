import { CAR_COLORS, CAR_LOOKS as L } from '../../config/style.js';
import { paintOnSprite, spriteHalfWidth } from './carSprite.js';

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fill();
}

function drawAura(c, l, levels) {
  const total = levels.engine + levels.tyres + levels.nitro;
  if (total === 0) return;
  const radius = l * L.auraRadius * 2;
  const glow = c.createRadialGradient(0, 0, l * 0.3, 0, 0, radius);
  glow.addColorStop(0, CAR_COLORS.aura.replace('{alpha}', String(total * L.auraPerLevel)));
  glow.addColorStop(1, CAR_COLORS.aura.replace('{alpha}', '0'));
  c.fillStyle = glow;
  c.beginPath();
  c.arc(0, 0, radius, 0, Math.PI * 2);
  c.fill();
}

function drawWheels(c, l, w, tyres) {
  if (tyres === 0) return;
  const thick = L.wheelBase + tyres * L.wheelPerLevel;
  for (const x of [l * 0.55, -l * 0.6]) {
    for (const side of [-1, 1]) {
      const y = side > 0 ? w - thick + L.wheelOut : -w - L.wheelOut;
      c.fillStyle = CAR_COLORS.tyre;
      roundRect(c, x - L.wheelLength / 2, y, L.wheelLength, thick, 2);
      c.fillStyle = CAR_COLORS.rim;
      roundRect(c, x - L.wheelLength / 4, y + thick * 0.3, L.wheelLength / 2, thick * 0.4, 1);
    }
  }
}

function drawStripes(c, l, w) {
  c.fillStyle = CAR_COLORS.engineStripe;
  const stripe = w * 2 * L.stripeWidth;
  c.fillRect(-l, -stripe * 1.2, l * 2, stripe * 0.8);
  c.fillRect(-l, stripe * 0.4, l * 2, stripe * 0.8);
}

function drawScoop(c, l, w) {
  c.fillStyle = CAR_COLORS.scoop;
  roundRect(c, l * 0.45, (-w * 2 * L.scoopWidth) / 2, l * 2 * L.scoopLength, w * 2 * L.scoopWidth, 3);
}

function drawWing(c, l, w) {
  c.fillStyle = CAR_COLORS.wing;
  roundRect(c, -l - L.wingDepth / 2, -w - L.wingOverhang, L.wingDepth, (w + L.wingOverhang) * 2, 2);
}

function drawBodyParts(c, l, w, engine) {
  if (engine >= 1) drawStripes(c, l, w);
  if (engine >= 2) drawScoop(c, l, w);
}

function drawNitro(c, l, w, nitro) {
  if (nitro === 0) return;
  c.fillStyle = CAR_COLORS.nitroTank;
  const width = L.tankWidth + nitro * L.tankPerLevel;
  for (const side of [-1, 1]) roundRect(c, -l * 0.7, side > 0 ? w - 1 : -w - width + 1, l * 2 * L.tankLength, width, width / 2);
  roundRect(c, -l - width, -width / 2, width, width, width / 2);
}

function drawCodeBody(c, colors, levels, l, w) {
  c.fillStyle = colors.body;
  roundRect(c, -l, -w, l * 2, w * 2, 7);
  drawBodyParts(c, l, w, levels.engine);
  if (levels.engine >= 3) drawWing(c, l, w);
  c.fillStyle = colors.trim;
  roundRect(c, -l * 0.2, -w * 0.78, l * 0.95, w * 2 * 0.78, 4);
  c.fillStyle = colors.glass;
  roundRect(c, l * 0.12, -w * 0.7, l * 0.42, w * 2 * 0.7, 3);
  roundRect(c, -l * 0.42, -w * 0.62, l * 0.2, w * 2 * 0.62, 2);
  c.fillStyle = CAR_COLORS.headlight;
  roundRect(c, l - 4, -w + 2, 3, 5, 1);
  roundRect(c, l - 4, w - 7, 3, 5, 1);
  c.fillStyle = CAR_COLORS.tailLight;
  c.fillRect(-l, -w + 2, 2, 5);
  c.fillRect(-l, w - 7, 2, 5);
}

export function drawCarArt(c, colors, levels, length, width, sprite) {
  const l = length / 2;
  const w = sprite ? spriteHalfWidth(sprite, length) : width / 2;
  drawAura(c, l, levels);
  c.fillStyle = CAR_COLORS.shadow;
  roundRect(c, -l + 3, -w + 3, length, w * 2, 7);
  drawWheels(c, l, w, levels.tyres);
  drawNitro(c, l, w, levels.nitro);
  if (!sprite) {
    drawCodeBody(c, colors, levels, l, w);
    return;
  }
  c.imageSmoothingQuality = 'high';
  c.drawImage(paintOnSprite(sprite, length, (p) => drawBodyParts(p, l, w, levels.engine)), -l, -w, length, w * 2);
  if (levels.engine >= 3) drawWing(c, l, w);
}

export const NO_UPGRADES = { engine: 0, tyres: 0, nitro: 0 };
