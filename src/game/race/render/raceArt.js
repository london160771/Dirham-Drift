import { byFileName } from '../../assets/fileSlots.js';

const FILES = import.meta.glob('../../../assets/race/*.{png,jpg,jpeg,webp,avif}', { eager: true, query: '?url', import: 'default' });

export const RACE_ART_FILES = byFileName(FILES);

const textureKey = (name) => `art-${name}`;

export function preloadRaceArt(load) {
  for (const [name, url] of Object.entries(RACE_ART_FILES)) load.image(textureKey(name), url);
}

export function collectRaceArt(textures) {
  const art = {};
  for (const name of Object.keys(RACE_ART_FILES)) {
    if (textures.exists(textureKey(name))) art[name] = textures.get(textureKey(name)).getSourceImage();
  }
  return art;
}

export function artList(art, names) {
  const images = names.map((name) => art[name]).filter(Boolean);
  return images.length ? images : null;
}

export function tiledFill(ctx, image, tileWorld, fallback) {
  if (!image) return fallback;
  const pattern = ctx.createPattern(image, 'repeat');
  pattern.setTransform(new DOMMatrix().scale(tileWorld / image.width));
  return pattern;
}

export function drawImageCentered(ctx, image, length) {
  const height = (length * image.height) / image.width;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, -length / 2, -height / 2, length, height);
}
