import { TILT } from '../../config/controls.js';

const DEG = 180 / Math.PI;

export function landscapeSign(screenAngle) {
  const angle = ((Math.round(screenAngle) % 360) + 360) % 360;
  if (angle === 90) return 1;
  if (angle === 270) return -1;
  return 0;
}

export function tiltAngle(beta, screenAngle) {
  const sign = landscapeSign(screenAngle);
  if (sign === 0 || typeof beta !== 'number' || Number.isNaN(beta)) return null;
  return Math.asin(Math.sin(beta / DEG)) * DEG * sign;
}

export function tiltToSteer(angleDeg, config = TILT) {
  if (angleDeg === null) return 0;
  const size = Math.abs(angleDeg);
  if (size <= config.deadZoneDeg) return 0;
  const share = Math.min(1, (size - config.deadZoneDeg) / (config.fullLockDeg - config.deadZoneDeg));
  return Math.sign(angleDeg) * share;
}
