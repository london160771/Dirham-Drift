import { CAR_PHYSICS } from '../../config/car.js';
import { CAR_LOOKS } from '../../config/style.js';
import { NO_UPGRADES, drawCarArt } from './carArt.js';

const TEXTURE_SCALE = 2;
const PAD = CAR_LOOKS.texturePad;

export function createCarTexture(scene, name, colors, levels = NO_UPGRADES, sprite = null) {
  const key = `car-${name}-e${levels.engine}t${levels.tyres}n${levels.nitro}${sprite ? '-art' : ''}`;
  if (scene.textures.exists(key)) return key;
  const canvas = document.createElement('canvas');
  canvas.width = (CAR_PHYSICS.length + PAD) * TEXTURE_SCALE;
  canvas.height = (CAR_PHYSICS.width + PAD) * TEXTURE_SCALE;
  const c = canvas.getContext('2d');
  c.setTransform(TEXTURE_SCALE, 0, 0, TEXTURE_SCALE, canvas.width / 2, canvas.height / 2);
  drawCarArt(c, colors, levels, CAR_PHYSICS.length, CAR_PHYSICS.width, sprite);
  scene.textures.addCanvas(key, canvas);
  return key;
}

export const CAR_TEXTURE_SCALE = 1 / TEXTURE_SCALE;
