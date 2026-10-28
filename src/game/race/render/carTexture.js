import { CAR_PHYSICS } from '../../config/car.js';
import { CAR_COLORS } from '../../config/style.js';

const TEXTURE_SCALE = 2;

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fill();
}

function drawCar(c, colors, length, width) {
  const l = length / 2;
  const w = width / 2;
  c.fillStyle = CAR_COLORS.shadow;
  roundRect(c, -l + 3, -w + 3, length, width, 7);
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
  c.fillStyle = CAR_COLORS.headlight;
  roundRect(c, l - 4, -w + 2, 3, 5, 1);
  roundRect(c, l - 4, w - 7, 3, 5, 1);
  c.fillStyle = CAR_COLORS.tailLight;
  c.fillRect(-l, -w + 2, 2, 5);
  c.fillRect(-l, w - 7, 2, 5);
}

function carTextureKey(name) {
  return `car-${name}`;
}

export function createCarTexture(scene, name, colors) {
  const key = carTextureKey(name);
  if (scene.textures.exists(key)) return key;
  const pad = 8;
  const canvas = document.createElement('canvas');
  canvas.width = (CAR_PHYSICS.length + pad) * TEXTURE_SCALE;
  canvas.height = (CAR_PHYSICS.width + pad) * TEXTURE_SCALE;
  const c = canvas.getContext('2d');
  c.setTransform(TEXTURE_SCALE, 0, 0, TEXTURE_SCALE, canvas.width / 2, canvas.height / 2);
  drawCar(c, colors, CAR_PHYSICS.length, CAR_PHYSICS.width);
  scene.textures.addCanvas(key, canvas);
  return key;
}

export const CAR_TEXTURE_SCALE = 1 / TEXTURE_SCALE;
