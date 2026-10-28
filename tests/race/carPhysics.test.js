import { describe, expect, it } from 'vitest';
import { DAMAGE, NITRO, WALLS } from '../../src/game/config/car.js';
import { TRACKS } from '../../src/game/config/tracks/index.js';
import { buildTrack, locate, pointAt } from '../../src/game/race/track/buildTrack.js';
import { createCar, stepCar, topSpeedOf } from '../../src/game/race/sim/carPhysics.js';
import { buildPerformance } from '../../src/game/race/sim/performance.js';
import { collideWithWalls } from '../../src/game/race/sim/walls.js';

const DT = 1 / 120;
const GAS = { steer: 0, gas: 1, brake: 0, nitro: false };

function run(car, input, seconds) {
  for (let t = 0; t < seconds; t += DT) stepCar(car, input, DT);
  return car;
}

describe('car physics', () => {
  it('accelerates toward top speed on gas', () => {
    const car = run(createCar({ id: 'p', x: 0, y: 0, heading: 0, performance: buildPerformance() }), GAS, 8);
    expect(car.speed).toBeGreaterThan(topSpeedOf(car) * 0.9);
  });

  it('damage lowers top speed by the configured amount (FR-RACE-005)', () => {
    const clean = createCar({ id: 'a', x: 0, y: 0, heading: 0, performance: buildPerformance() });
    const wrecked = createCar({ id: 'b', x: 0, y: 0, heading: 0, performance: buildPerformance(), damage: DAMAGE.max });
    expect(topSpeedOf(wrecked)).toBeCloseTo(topSpeedOf(clean) * (1 - DAMAGE.topSpeedLossAtMax));
  });

  it('nitro fills over time, empties on use and raises speed (FR-RACE-006)', () => {
    const car = createCar({ id: 'p', x: 0, y: 0, heading: 0, performance: buildPerformance() });
    run(car, GAS, 10);
    expect(car.nitro).toBe(1);
    const cruise = car.speed;
    stepCar(car, { ...GAS, nitro: true }, DT);
    expect(car.nitroActive).toBe(true);
    run(car, GAS, 1 / NITRO.burnPerSecond + 0.1);
    expect(car.nitroActive).toBe(false);
    expect(car.nitro).toBeLessThan(0.1);
    const boosted = createCar({ id: 'q', x: 0, y: 0, heading: 0, performance: buildPerformance() });
    run(boosted, GAS, 10);
    stepCar(boosted, { ...GAS, nitro: true }, DT);
    run(boosted, GAS, 1);
    expect(boosted.speed).toBeGreaterThan(cruise * 1.1);
  });

  it('upgrades raise top speed', () => {
    expect(buildPerformance({ engine: 3 }).topSpeed).toBeGreaterThan(buildPerformance({ engine: 0 }).topSpeed);
  });
});

describe('barrier hits (FR-RACE-005)', () => {
  const track = buildTrack(TRACKS.marina);

  function crashAt(speed) {
    const p = pointAt(track, 2000, track.halfWidth - 20);
    const car = createCar({ id: 'p', x: p.x, y: p.y, heading: p.heading, performance: buildPerformance() });
    const nx = Math.sin(p.heading);
    const ny = -Math.cos(p.heading);
    car.x += nx * 20;
    car.y += ny * 20;
    car.vx = nx * speed;
    car.vy = ny * speed;
    const loc = locate(track, car.x, car.y);
    collideWithWalls(track, car, loc, DT);
    return car;
  }

  it('a hard hit adds damage and slows the car', () => {
    const car = crashAt(400);
    expect(car.damage).toBeGreaterThan(0);
    expect(car.hits).toBe(1);
    expect(Math.hypot(car.vx, car.vy)).toBeLessThan(400 * WALLS.speedKeptOnHit);
  });

  it('a gentle touch adds no damage', () => {
    expect(crashAt(WALLS.hitSpeedThreshold - 10).damage).toBe(0);
  });
});
