import { describe, expect, it } from 'vitest';
import { CAMERA } from '../../src/game/config/camera.js';
import { createCar } from '../../src/game/race/sim/carPhysics.js';
import { buildPerformance } from '../../src/game/race/sim/performance.js';
import { cameraFraming, cameraSpeedRatio } from '../../src/game/race/scenes/raceCamera.js';

const PHONE_HEIGHT = 390;
const DESKTOP_HEIGHT = 720;

describe('race camera framing', () => {
  it('shows the same world height on phone and desktop when stopped', () => {
    expect(cameraFraming(PHONE_HEIGHT, 0).viewHeight).toBeCloseTo(CAMERA.worldViewHeight);
    expect(cameraFraming(DESKTOP_HEIGHT, 0).viewHeight).toBeCloseTo(CAMERA.worldViewHeight);
  });

  it('pulls back at top speed and looks further ahead', () => {
    const slow = cameraFraming(PHONE_HEIGHT, 0);
    const fast = cameraFraming(PHONE_HEIGHT, 1);
    expect(fast.zoom).toBeLessThan(slow.zoom);
    expect(fast.viewHeight).toBeCloseTo(CAMERA.worldViewHeight / (1 - CAMERA.speedZoomOut));
    expect(fast.ahead).toBeGreaterThan(slow.ahead);
  });

  it('keeps the car at the same screen spot at any speed', () => {
    [0, 0.5, 1].forEach((ratio) => {
      const { viewHeight, ahead } = cameraFraming(PHONE_HEIGHT, ratio);
      expect(ahead / viewHeight).toBeCloseTo(CAMERA.lookAheadRatio);
    });
  });
});

describe('camera speed ratio', () => {
  it('ignores the nitro boost so nitro pulls the camera back', () => {
    const car = createCar({ id: 'p', x: 0, y: 0, heading: 0, performance: buildPerformance({ nitro: 3 }) });
    car.speed = car.performance.topSpeed;
    car.nitroActive = true;
    expect(cameraSpeedRatio(car)).toBe(1);
    car.speed = car.performance.topSpeed * 1.2;
    expect(cameraSpeedRatio(car)).toBe(1);
  });

  it('works in reverse', () => {
    const car = createCar({ id: 'p', x: 0, y: 0, heading: 0, performance: buildPerformance() });
    car.speed = -car.performance.topSpeed / 4;
    expect(cameraSpeedRatio(car)).toBeCloseTo(0.25);
  });
});
