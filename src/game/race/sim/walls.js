import { CAR_PHYSICS, DAMAGE, WALLS } from '../../config/car.js';

const END_BUFFER = 12;

function hitDamage(impact) {
  if (impact <= WALLS.hitSpeedThreshold) return 0;
  return Math.min(WALLS.maxDamagePerHit, (impact - WALLS.hitSpeedThreshold) * WALLS.damagePerSpeed);
}

function applyImpact(car, nx, ny, overlap) {
  car.x -= nx * overlap;
  car.y -= ny * overlap;
  const outward = car.vx * nx + car.vy * ny;
  if (outward <= 0) return 0;
  car.vx -= nx * outward * (1 + WALLS.bounce);
  car.vy -= ny * outward * (1 + WALLS.bounce);
  if (outward > WALLS.hitSpeedThreshold) {
    car.vx *= WALLS.speedKeptOnHit;
    car.vy *= WALLS.speedKeptOnHit;
  }
  return outward;
}

function scrape(car, dt) {
  const keep = Math.exp(-WALLS.scrapeLossPerSecond * dt);
  car.vx *= keep;
  car.vy *= keep;
}

export function collideWithWalls(track, car, loc, dt) {
  const limit = track.halfWidth - CAR_PHYSICS.collisionRadius;
  const i = loc.index;
  const tx = track.txs[i];
  const ty = track.tys[i];
  let impact = 0;
  if (Math.abs(loc.lateral) > limit) {
    const side = Math.sign(loc.lateral);
    impact = applyImpact(car, ty * side, -tx * side, Math.abs(loc.lateral) - limit);
    scrape(car, dt);
  }
  if (!track.closed && loc.s < END_BUFFER) impact = Math.max(impact, applyImpact(car, -tx, -ty, END_BUFFER - loc.s));
  if (!track.closed && loc.s > track.length - END_BUFFER) {
    impact = Math.max(impact, applyImpact(car, tx, ty, loc.s - (track.length - END_BUFFER)));
  }
  const damage = hitDamage(impact) * car.performance.damageTaken;
  if (damage > 0) {
    car.damage = Math.min(DAMAGE.max, car.damage + damage);
    car.hits += 1;
  }
  return impact;
}
