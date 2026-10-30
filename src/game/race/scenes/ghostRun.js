import { GHOST } from '../../config/ghost.js';
import { CAR_COLORS, DEPTH } from '../../config/style.js';
import { ghostPose } from '../ghost/playback.js';
import { createGhostRecorder } from '../ghost/recorder.js';
import { CAR_TEXTURE_SCALE, createCarTexture } from '../render/carTexture.js';

export function createGhostRun(scene, setup) {
  const recorder = setup.recordGhost ? createGhostRecorder(setup.trackId) : null;
  const frames = setup.ghost?.frames;
  const pose = {};
  const sprite = frames
    ? scene.add.image(frames[0][0], frames[0][1], createCarTexture(scene, 'ghost', CAR_COLORS.ghost)).setScale(CAR_TEXTURE_SCALE).setAlpha(GHOST.alpha).setDepth(DEPTH.cars)
    : null;
  return {
    record(race) {
      recorder?.sample(race);
    },
    sync(race) {
      if (!sprite) return;
      ghostPose(frames, race.time, pose);
      sprite.setPosition(pose.x, pose.y).setRotation(pose.heading);
    },
    attach(results) {
      return recorder ? { ...results, ghost: recorder.ghost(results.timeMs) } : results;
    },
  };
}
