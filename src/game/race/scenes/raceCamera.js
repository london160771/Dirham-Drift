import { CAMERA } from '../../config/camera.js';
import { wrapAngle } from '../sim/angles.js';

export function createRaceCamera(camera, car) {
  const state = { x: car.x, y: car.y, heading: car.heading };
  const baseZoom = () => camera.height / CAMERA.worldViewHeight;
  return {
    baseZoom,
    update(target, speedRatio, dt) {
      const k = Math.min(1, CAMERA.positionLerp * dt);
      const r = Math.min(1, CAMERA.rotationLerp * dt);
      state.heading = wrapAngle(state.heading + wrapAngle(target.heading - state.heading) * r);
      const lookHeading = CAMERA.mode === 'rotate' ? state.heading : Math.atan2(target.vy, target.vx);
      const ahead = CAMERA.worldViewHeight * CAMERA.lookAheadRatio * (CAMERA.mode === 'rotate' ? 1 : speedRatio);
      const tx = target.x + Math.cos(lookHeading) * ahead;
      const ty = target.y + Math.sin(lookHeading) * ahead;
      state.x += (tx - state.x) * k;
      state.y += (ty - state.y) * k;
      camera.setZoom(baseZoom() * (1 - CAMERA.speedZoomOut * speedRatio));
      camera.setRotation(CAMERA.mode === 'rotate' ? -state.heading - Math.PI / 2 : 0);
      camera.centerOn(state.x, state.y);
    },
  };
}
