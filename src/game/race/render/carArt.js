import { CAR_COLORS, PALETTE } from '../../config/style.js';

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fill();
}

function drawWheels(c, l, w, tyres) {
  if (tyres === 0) return;
  const size = 3 + tyres;
  c.fillStyle = CAR_COLORS.tyre;
  for (const x of [l * 0.55, -l * 0.62]) {
    for (const side of [-1, 1]) roundRect(c, x - size, side * w - (side > 0 ? 1 : size - 1), size * 2, size, 2);
  }
}

function drawEngine(c, l, w, engine, colors) {
  if (engine >= 1) {
    c.fillStyle = CAR_COLORS.engineStripe;
    c.fillRect(l * 0.55, -w * 0.32, l * 0.4, w * 0.16);
    c.fillRect(l * 0.55, w * 0.16, l * 0.4, w * 0.16);
  }
  if (engine >= 2) {
    c.fillStyle = colors.trim;
    roundRect(c, l * 0.6, -w * 0.14, l * 0.28, w * 0.28, 2);
  }
  if (engine >= 3) {
    c.fillStyle = colors.trim;
    c.fillRect(-l - 3, -w - 1, 5, w * 2 + 2);
  }
}

function drawNitro(c, l, w, nitro) {
  c.fillStyle = PALETTE.teal;
  for (let i = 0; i < nitro; i += 1) roundRect(c, -l - 2, -w * 0.5 + i * (w * 0.5), 3, 3, 1);
  if (nitro >= 3) {
    roundRect(c, -l * 0.5, -w - 2, l * 0.5, 3, 1);
    roundRect(c, -l * 0.5, w - 1, l * 0.5, 3, 1);
  }
}

export function drawCarArt(c, colors, levels, length, width) {
  const l = length / 2;
  const w = width / 2;
  c.fillStyle = CAR_COLORS.shadow;
  roundRect(c, -l + 3, -w + 3, length, width, 7);
  drawWheels(c, l, w, levels.tyres);
  c.fillStyle = colors.body;
  roundRect(c, -l, -w, length, width, 7);
  c.fillStyle = colors.trim;
  roundRect(c, -l * 0.2, -w * 0.78, l * 0.95, width * 0.78, 4);
  c.fillStyle = colors.glass;
  roundRect(c, l * 0.12, -w * 0.7, l * 0.42, width * 0.7, 3);
  roundRect(c, -l * 0.42, -w * 0.62, l * 0.2, width * 0.62, 2);
  c.fillStyle = colors.trim;
  c.fillRect(-l, -w * 0.12, length * 0.92, width * 0.06);
  c.fillRect(-l, w * 0.06, length * 0.92, width * 0.06);
  drawEngine(c, l, w, levels.engine, colors);
  drawNitro(c, l, w, levels.nitro);
  c.fillStyle = CAR_COLORS.headlight;
  roundRect(c, l - 4, -w + 2, 3, 5, 1);
  roundRect(c, l - 4, w - 7, 3, 5, 1);
  c.fillStyle = CAR_COLORS.tailLight;
  c.fillRect(-l, -w + 2, 2, 5);
  c.fillRect(-l, w - 7, 2, 5);
}

export const NO_UPGRADES = { engine: 0, tyres: 0, nitro: 0 };
