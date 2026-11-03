import { TILT } from '../../game/config/controls.js';
import { tiltAngle, tiltToSteer } from '../../game/race/input/tiltSteer.js';

const SOURCE = 'tilt';

export function tiltSupported(win = window) {
  return typeof win.DeviceOrientationEvent !== 'undefined';
}

export async function requestTiltPermission(win = window) {
  if (!tiltSupported(win)) return 'unsupported';
  const ask = win.DeviceOrientationEvent.requestPermission;
  if (typeof ask !== 'function') return 'granted';
  try {
    return await ask.call(win.DeviceOrientationEvent);
  } catch {
    return 'denied';
  }
}

function screenAngle(win) {
  return win.screen?.orientation?.angle ?? win.orientation ?? 0;
}

export function attachTilt(input, { onNoData }, win = window) {
  let seen = false;
  const listen = (event) => {
    const angle = tiltAngle(event.beta, screenAngle(win));
    if (angle === null) return;
    seen = true;
    input.setAxis(SOURCE, tiltToSteer(angle));
  };
  win.addEventListener('deviceorientation', listen);
  const timer = win.setTimeout(() => seen || onNoData(), TILT.noDataMs);
  return () => {
    win.removeEventListener('deviceorientation', listen);
    win.clearTimeout(timer);
    input.releaseSource(SOURCE);
  };
}
