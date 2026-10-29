import { useEffect, useRef, useState } from 'react';
import { CAR_PHYSICS } from '../../game/config/car.js';
import { CAR_COLORS, CAR_SPRITES, GARAGE_PREVIEW } from '../../game/config/style.js';
import { drawCarArt } from '../../game/race/render/carArt.js';
import { RACE_ART_FILES } from '../../game/race/render/raceArt.js';

const { scale, pad, maxPixelRatio } = GARAGE_PREVIEW;
const SPRITE_URL = RACE_ART_FILES[CAR_SPRITES.player];

function usePlayerSprite() {
  const [sprite, setSprite] = useState(null);
  useEffect(() => {
    if (!SPRITE_URL) return undefined;
    const image = new Image();
    image.onload = () => setSprite(image);
    image.src = SPRITE_URL;
    return () => {
      image.onload = null;
    };
  }, []);
  return sprite;
}

export function CarPreview({ levels }) {
  const ref = useRef(null);
  const sprite = usePlayerSprite();
  const ratio = Math.min(maxPixelRatio, globalThis.devicePixelRatio || 1);
  const width = Math.ceil((CAR_PHYSICS.length + pad) * scale);
  const height = Math.ceil((CAR_PHYSICS.width + pad) * scale);
  useEffect(() => {
    const canvas = ref.current;
    const c = canvas.getContext('2d');
    if (!c) return;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.setTransform(scale * ratio, 0, 0, scale * ratio, canvas.width / 2, canvas.height / 2);
    drawCarArt(c, CAR_COLORS.player, levels, CAR_PHYSICS.length, CAR_PHYSICS.width, sprite);
  }, [levels, sprite, ratio]);
  return <canvas ref={ref} className="car-preview" width={width * ratio} height={height * ratio} style={{ width }} data-testid="car-preview" />;
}
