import { CAMERA } from '../../config/camera.js';
import { wrapAngle } from '../sim/angles.js';

export function cameraSpeedRatio(car) {
  return Math.min(1, Math.abs(car.speed) / car.performance.topSpeed);
}

export function cameraFraming(screenHeight, speedRatio) {
  const zoom = (screenHeight / CAMERA.worldViewHeight) * (1 - CAMERA.speedZoomOut * speedRatio);
  const viewHeight = screenHeight / zoom;
  const ahead = viewHeight * CAMERA.lookAheadRatio * (CAMERA.mode === 'rotate' ? 1 : speedRatio);
  return { zoom, viewHeight, ahead };
}

export function createRaceCamera(camera, car) {
  const state = { x: car.x, y: car.y, heading: car.heading };
  return {
    update(target, speedRatio, dt) {
      const k = Math.min(1, CAMERA.positionLerp * dt);
      const r = Math.min(1, CAMERA.rotationLerp * dt);
      state.heading = wrapAngle(state.heading + wrapAngle(target.heading - state.heading) * r);
      const lookHeading = CAMERA.mode === 'rotate' ? state.heading : Math.atan2(target.vy, target.vx);
      const { zoom, ahead } = cameraFraming(camera.height, speedRatio);
      const tx = target.x + Math.cos(lookHeading) * ahead;
      const ty = target.y + Math.sin(lookHeading) * ahead;
      state.x += (tx - state.x) * k;
      state.y += (ty - state.y) * k;
      camera.setZoom(zoom);
      camera.setRotation(CAMERA.mode === 'rotate' ? -state.heading - Math.PI / 2 : 0);
      camera.centerOn(state.x, state.y);
    },
  };
}
