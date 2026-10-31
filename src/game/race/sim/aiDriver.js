import { AI, DIFFICULTY } from '../../config/race.js';
import { pointAt, wrapIndex } from '../track/buildTrack.js';
import { clamp, wrapAngle } from './angles.js';

export function createAiBrain(lane, rng, skill = DIFFICULTY.easy) {
  return { lane, currentLane: lane, targetLane: lane, rng, skill, variation: 1, nextVariation: 0, stuckTime: 0 };
}

function maxCurvatureAhead(track, index, distance) {
  const steps = Math.ceil(distance / track.spacing);
  let max = 0;
  for (let k = 0; k <= steps; k += 1) {
    const value = Math.abs(track.curvature[wrapIndex(track, index + k)]);
    if (value > max) max = value;
  }
  return max;
}

function updateVariation(brain, dt) {
  brain.nextVariation -= dt;
  if (brain.nextVariation > 0) return;
  brain.variation = 1 + brain.rng.range(-brain.skill.paceVariation, brain.skill.paceVariation);
  brain.nextVariation = brain.rng.range(AI.variationMinSeconds, AI.variationMaxSeconds);
}

const target = {};

export function driveAi(track, car, loc, brain, pace, dt, out) {
  updateVariation(brain, dt);
  const speed = Math.max(0, car.speed);
  pointAt(track, loc.s + AI.lookBase + speed * AI.lookPerSpeed, brain.currentLane, target);
  const desired = Math.atan2(target.y - car.y, target.x - car.x);
  out.steer = clamp(wrapAngle(desired - car.heading) * AI.steerGain, -1, 1);
  const curvature = maxCurvatureAhead(track, loc.index, AI.brakeLookBase + speed * AI.brakeLookPerSpeed);
  const cornerSpeed = curvature > 0 ? Math.sqrt((AI.cornerGrip * pace) / curvature) : Infinity;
  const targetSpeed = Math.max(AI.minCornerSpeed, Math.min(car.performance.topSpeed * brain.variation * car.catchUp, cornerSpeed));
  out.gas = speed < targetSpeed ? 1 : 0;
  out.brake = speed > targetSpeed * AI.brakeMargin ? 1 : 0;
  out.nitro = curvature < AI.nitroCurvature && car.nitro >= 1 && brain.rng.next() < brain.skill.nitroChancePerSecond * dt;
  return out;
}

export function updateStuck(brain, car, dt) {
  brain.stuckTime = Math.abs(car.speed) < AI.stuckSpeed ? brain.stuckTime + dt : 0;
  return brain.stuckTime > AI.stuckSeconds;
}

export function catchUpFactor(brain, gapBehindPlayer) {
  return 1 + brain.skill.catchUp * clamp(gapBehindPlayer / AI.catchUpFullGap, 0, 1);
}
