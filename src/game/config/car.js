export const CAR_PHYSICS = {
  length: 44,
  width: 22,
  collisionRadius: 13,
  topSpeed: 560,
  reverseSpeed: 140,
  acceleration: 420,
  brakeDeceleration: 900,
  coastDeceleration: 140,
  steerRate: 2.6,
  steerFullAtSpeed: 160,
  highSpeedSteerLoss: 0.35,
  steerResponse: 9,
  steerReturn: 12,
  grip: 9,
  driftGrip: 2.6,
  driftSteerThreshold: 0.8,
  driftSpeedRatio: 0.72,
  steeringAssist: 0,
};

export const NITRO = {
  fillPerSecond: 0.12,
  burnPerSecond: 0.5,
  minToStart: 0.25,
  speedBoost: 0.3,
  accelerationBoost: 0.6,
};

export const WALLS = {
  bounce: 0.25,
  speedKeptOnHit: 0.55,
  hitSpeedThreshold: 70,
  damagePerSpeed: 0.08,
  maxDamagePerHit: 34,
  hardHitSpeed: 160,
};

export const DAMAGE = {
  max: 100,
  topSpeedLossAtMax: 0.3,
};

export const CAR_CONTACT = {
  push: 0.5,
  speedKept: 0.9,
  impactSpeed: 60,
};

export const UPGRADE_EFFECTS = {
  engine: [0, 0.07, 0.14, 0.22],
  tyres: [0, 0.12, 0.24, 0.36],
  nitro: [0, 0.25, 0.5, 0.8],
};

export const SPEED_TO_KMH = 0.36;
