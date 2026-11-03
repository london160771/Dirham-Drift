import { describe, expect, it, vi } from 'vitest';
import { TILT } from '../../src/game/config/controls.js';
import { SETTING_DEFAULTS } from '../../src/game/config/settings.js';
import { createInputState } from '../../src/game/race/input/inputState.js';
import { landscapeSign, tiltAngle, tiltToSteer } from '../../src/game/race/input/tiltSteer.js';
import { attachTilt, requestTiltPermission } from '../../src/ui/race/tilt.js';

function fakeWindow({ angle = 90, permission } = {}) {
  const win = new EventTarget();
  win.screen = { orientation: { angle } };
  win.setTimeout = vi.fn((fn) => {
    win.fireTimeout = fn;
    return 1;
  });
  win.clearTimeout = vi.fn();
  win.DeviceOrientationEvent = permission ? { requestPermission: permission } : {};
  return win;
}

function tilt(win, beta) {
  const event = new Event('deviceorientation');
  event.beta = beta;
  win.dispatchEvent(event);
}

describe('tilt steering', () => {
  it('is off by default', () => {
    expect(SETTING_DEFAULTS.tiltSteering).toBe(false);
  });

  it('ignores a small tilt and reaches full lock at the configured angle', () => {
    expect(tiltToSteer(TILT.deadZoneDeg)).toBe(0);
    expect(tiltToSteer(-TILT.deadZoneDeg / 2)).toBe(0);
    expect(tiltToSteer(TILT.fullLockDeg)).toBe(1);
    expect(tiltToSteer(-TILT.fullLockDeg * 2)).toBe(-1);
    const half = (TILT.deadZoneDeg + TILT.fullLockDeg) / 2;
    expect(tiltToSteer(half)).toBeCloseTo(0.5);
    expect(tiltToSteer(null)).toBe(0);
  });

  it('flips with the landscape side and gives nothing in portrait', () => {
    expect(landscapeSign(90)).toBe(1);
    expect(landscapeSign(-90)).toBe(-1);
    expect(landscapeSign(270)).toBe(-1);
    expect(landscapeSign(0)).toBe(0);
    expect(tiltAngle(10, 90)).toBeCloseTo(10);
    expect(tiltAngle(10, 270)).toBeCloseTo(-10);
    expect(tiltAngle(170, 90)).toBeCloseTo(10);
    expect(tiltAngle(null, 90)).toBeNull();
    expect(tiltAngle(10, 0)).toBeNull();
  });

  it('feeds a partial steer that buttons override', () => {
    const input = createInputState();
    const win = fakeWindow();
    const detach = attachTilt(input, { onNoData: () => {} }, win);
    tilt(win, (TILT.deadZoneDeg + TILT.fullLockDeg) / 2);
    expect(input.read({}).steer).toBeCloseTo(0.5);
    input.press('touch-steer', 'left');
    expect(input.read({}).steer).toBe(-1);
    input.release('touch-steer', 'left');
    detach();
    expect(input.read({}).steer).toBe(0);
  });

  it('falls back when the sensor sends nothing', () => {
    const onNoData = vi.fn();
    const win = fakeWindow();
    attachTilt(createInputState(), { onNoData }, win);
    win.fireTimeout();
    expect(onNoData).toHaveBeenCalledOnce();
    const quiet = vi.fn();
    const busy = fakeWindow();
    attachTilt(createInputState(), { onNoData: quiet }, busy);
    tilt(busy, 3);
    busy.fireTimeout();
    expect(quiet).not.toHaveBeenCalled();
  });

  it('asks for permission only where the browser needs it', async () => {
    expect(await requestTiltPermission(fakeWindow())).toBe('granted');
    expect(await requestTiltPermission(fakeWindow({ permission: () => Promise.resolve('denied') }))).toBe('denied');
    expect(await requestTiltPermission(fakeWindow({ permission: () => Promise.reject(new Error('no gesture')) }))).toBe('denied');
    expect(await requestTiltPermission({})).toBe('unsupported');
  });
});
