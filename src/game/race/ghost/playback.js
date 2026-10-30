import { GHOST } from '../../config/ghost.js';
import { wrapAngle } from '../sim/angles.js';

export function ghostPose(frames, time, out = {}) {
  const at = Math.max(0, time * GHOST.sampleHz);
  const i = Math.min(Math.floor(at), frames.length - 1);
  const a = frames[i];
  const b = frames[Math.min(i + 1, frames.length - 1)];
  const k = i === frames.length - 1 ? 0 : at - i;
  const ha = a[2] / GHOST.headingScale;
  const hb = b[2] / GHOST.headingScale;
  out.x = a[0] + (b[0] - a[0]) * k;
  out.y = a[1] + (b[1] - a[1]) * k;
  out.heading = ha + wrapAngle(hb - ha) * k;
  return out;
}
