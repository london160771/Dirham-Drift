import { DECOR } from '../../config/style.js';

function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil(width));
  canvas.height = Math.max(1, Math.ceil(height));
  return canvas;
}

export function bakeRegion(scene, key, rect, scale, draw, depth) {
  const canvas = makeCanvas((rect.maxX - rect.minX) * scale, (rect.maxY - rect.minY) * scale);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(scale, 0, 0, scale, -rect.minX * scale, -rect.minY * scale);
  draw(ctx);
  if (scene.textures.exists(key)) scene.textures.remove(key);
  scene.textures.addCanvas(key, canvas);
  return scene.add.image(rect.minX, rect.minY, key).setOrigin(0, 0).setScale(1 / scale).setDepth(depth);
}

export function bakeLayer(scene, prefix, bounds, scale, draw, depth) {
  const chunkWorld = DECOR.bakeChunk / scale;
  const images = [];
  let index = 0;
  for (let y = bounds.minY; y < bounds.maxY; y += chunkWorld) {
    for (let x = bounds.minX; x < bounds.maxX; x += chunkWorld) {
      const rect = { minX: x, minY: y, maxX: Math.min(bounds.maxX, x + chunkWorld), maxY: Math.min(bounds.maxY, y + chunkWorld) };
      images.push(bakeRegion(scene, `${prefix}-${index}`, rect, scale, draw, depth));
      index += 1;
    }
  }
  return images;
}

export function rotatedRectBounds(x, y, angle, halfLength, halfWidth) {
  const c = Math.abs(Math.cos(angle));
  const s = Math.abs(Math.sin(angle));
  const ex = halfLength * c + halfWidth * s;
  const ey = halfLength * s + halfWidth * c;
  return { minX: x - ex, minY: y - ey, maxX: x + ex, maxY: y + ey };
}
