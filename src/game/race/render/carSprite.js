export function spriteHalfWidth(sprite, length) {
  return (length * sprite.height) / sprite.width / 2;
}

export function paintOnSprite(sprite, length, paint) {
  const canvas = document.createElement('canvas');
  canvas.width = sprite.width;
  canvas.height = sprite.height;
  const c = canvas.getContext('2d');
  c.drawImage(sprite, 0, 0);
  c.globalCompositeOperation = 'source-atop';
  const k = sprite.width / length;
  c.setTransform(k, 0, 0, k, sprite.width / 2, sprite.height / 2);
  paint(c);
  return canvas;
}
