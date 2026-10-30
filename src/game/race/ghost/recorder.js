import { GHOST } from '../../config/ghost.js';
import { wrapAngle } from '../sim/angles.js';

const EPSILON = 1e-6;

export function createGhostRecorder(trackId) {
  const frames = [];
  let done = false;
  return {
    sample(race) {
      if (done) return;
      const player = race.entries[0];
      while (race.time + EPSILON >= frames.length / GHOST.sampleHz) {
        const { x, y, heading } = player.car;
        frames.push([Math.round(x), Math.round(y), Math.round(wrapAngle(heading) * GHOST.headingScale)]);
      }
      if (player.lap.finished) done = true;
    },
    ghost(timeMs) {
      return { track: trackId, timeMs, frames: frames.slice() };
    },
  };
}
