import { useEffect, useRef } from 'react';
import { CAR_PHYSICS } from '../../game/config/car.js';
import { CAR_COLORS, GARAGE_PREVIEW } from '../../game/config/style.js';
import { drawCarArt } from '../../game/race/render/carArt.js';

const { scale, pad } = GARAGE_PREVIEW;

export function CarPreview({ levels }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const c = canvas.getContext('2d');
    if (!c) return;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.setTransform(scale, 0, 0, scale, canvas.width / 2, canvas.height / 2);
    drawCarArt(c, CAR_COLORS.player, levels, CAR_PHYSICS.length, CAR_PHYSICS.width);
  }, [levels]);
  const width = Math.ceil((CAR_PHYSICS.length + pad) * scale);
  const height = Math.ceil((CAR_PHYSICS.width + pad) * scale);
  return <canvas ref={ref} className="car-preview" width={width} height={height} data-testid="car-preview" />;
}
