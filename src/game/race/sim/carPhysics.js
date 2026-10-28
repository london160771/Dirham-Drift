import { CAR_PHYSICS, DAMAGE, NITRO } from '../../config/car.js';
import { clamp, wrapAngle } from './angles.js';

export function createCar({ id, x, y, heading, performance, damage = 0, isPlayer = false }) {
  return {
    id,
    isPlayer,
    x,
    y,
    heading,
    vx: 0,
    vy: 0,
    speed: 0,
    steer: 0,
    nitro: 0,
    nitroActive: false,
    drifting: false,
    damage,
    hits: 0,
    performance,
  };
}

export function topSpeedOf(car) {
  const damageLoss = 1 - (car.damage / DAMAGE.max) * DAMAGE.topSpeedLossAtMax;
  const boost = car.nitroActive ? 1 + car.performance.nitroBoost : 1;
  return car.performance.topSpeed * damageLoss * boost;
}

function updateNitro(car, wantsNitro, dt) {
  if (!car.nitroActive && wantsNitro && car.nitro >= NITRO.minToStart) car.nitroActive = true;
  if (car.nitroActive) {
    car.nitro = Math.max(0, car.nitro - NITRO.burnPerSecond * dt);
    if (car.nitro === 0) car.nitroActive = false;
  } else {
    car.nitro = Math.min(1, car.nitro + car.performance.nitroFill * dt);
  }
}

function updateSteer(car, target, dt) {
  const rate = Math.abs(target) > Math.abs(car.steer) ? CAR_PHYSICS.steerResponse : CAR_PHYSICS.steerReturn;
  car.steer += (target - car.steer) * Math.min(1, rate * dt);
}

function longitudinal(car, input, forward, top, dt) {
  const p = CAR_PHYSICS;
  const accel = car.performance.acceleration * (car.nitroActive ? 1 + NITRO.accelerationBoost : 1);
  let v = forward;
  if (input.gas > 0 && v >= 0) {
    if (v < top) v += accel * input.gas * (1 - (v / top) * (v / top)) * dt;
    else v = Math.max(top, v - p.coastDeceleration * 2 * dt);
  } else if (input.brake > 0) {
    if (v > 0) v = Math.max(0, v - p.brakeDeceleration * input.brake * dt);
    else v = Math.max(-p.reverseSpeed, v - accel * 0.5 * dt);
  } else if (input.gas > 0) {
    v = Math.min(0, v + p.brakeDeceleration * dt);
  } else {
    const coast = p.coastDeceleration * dt;
    v = v > 0 ? Math.max(0, v - coast) : Math.min(0, v + coast);
  }
  if (v > top) v = Math.max(top, v - p.coastDeceleration * 2 * dt);
  return v;
}

export function stepCar(car, input, dt) {
  const p = CAR_PHYSICS;
  updateNitro(car, input.nitro, dt);
  updateSteer(car, input.steer, dt);
  const fx = Math.cos(car.heading);
  const fy = Math.sin(car.heading);
  let forward = car.vx * fx + car.vy * fy;
  let lateral = -car.vx * fy + car.vy * fx;
  const top = topSpeedOf(car);
  forward = longitudinal(car, input, forward, top, dt);
  const ratio = clamp(Math.abs(forward) / top, 0, 1);
  const turnFactor = Math.min(1, Math.abs(forward) / p.steerFullAtSpeed) * (1 - p.highSpeedSteerLoss * ratio);
  const direction = forward >= 0 ? 1 : -1;
  car.heading += car.steer * p.steerRate * car.performance.steerMultiplier * turnFactor * direction * dt;
  const assist = input.assist ?? p.steeringAssist;
  if (assist > 0 && input.assistHeading !== undefined && forward > 0) {
    car.heading += wrapAngle(input.assistHeading - car.heading) * assist * Math.min(1, ratio * 2) * dt;
  }
  car.heading = wrapAngle(car.heading);
  car.drifting = Math.abs(car.steer) > p.driftSteerThreshold && ratio > p.driftSpeedRatio;
  const grip = car.drifting ? p.driftGrip : p.grip * car.performance.gripMultiplier;
  lateral *= Math.exp(-grip * dt);
  const nx = Math.cos(car.heading);
  const ny = Math.sin(car.heading);
  car.vx = nx * forward - ny * lateral;
  car.vy = ny * forward + nx * lateral;
  car.speed = forward;
  car.x += car.vx * dt;
  car.y += car.vy * dt;
}
