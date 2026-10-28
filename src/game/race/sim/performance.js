import { CAR_PHYSICS, NITRO, UPGRADE_EFFECTS } from '../../config/car.js';

export function buildPerformance({ engine = 0, tyres = 0, nitro = 0 } = {}, pace = 1) {
  return {
    topSpeed: CAR_PHYSICS.topSpeed * (1 + UPGRADE_EFFECTS.engine[engine]) * pace,
    acceleration: CAR_PHYSICS.acceleration * (1 + UPGRADE_EFFECTS.engine[engine] * 0.5) * pace,
    gripMultiplier: 1 + UPGRADE_EFFECTS.tyres[tyres],
    steerMultiplier: 1 + UPGRADE_EFFECTS.tyres[tyres] * 0.35,
    nitroBoost: NITRO.speedBoost * (1 + UPGRADE_EFFECTS.nitro[nitro]),
    nitroFill: NITRO.fillPerSecond * (1 + UPGRADE_EFFECTS.nitro[nitro] * 0.5),
    damageTaken: 1,
  };
}
