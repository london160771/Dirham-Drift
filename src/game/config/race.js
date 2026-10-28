export const RACE = {
  fixedStep: 1 / 120,
  maxFrameDelta: 0.1,
  countdownSeconds: 3,
  finishGraceSeconds: 2.5,
  timeLimitAfterFirstFinish: 25,
  telemetryHz: 12,
  carCount: 5,
  gridRowSpacing: 70,
  gridLaneOffset: 34,
  checkpointCount: 10,
};

export const RACE_SEEDS = {
  quickRace: 20261026,
  perRaceStep: 7919,
};

export const SEED_RANGE = 2147483647;

export const RIVAL_PACE = {
  rookie: 0.92,
  pro: 1,
  final: 1.06,
};

export const AI = {
  lanes: [-52, -18, 18, 52],
  steerGain: 2.4,
  lookBase: 70,
  lookPerSpeed: 0.22,
  brakeLookBase: 120,
  brakeLookPerSpeed: 0.75,
  cornerGrip: 820,
  minCornerSpeed: 150,
  brakeMargin: 1.06,
  paceVariation: 0.03,
  variationMinSeconds: 2,
  variationMaxSeconds: 4.5,
  nitroCurvature: 0.0008,
  nitroChancePerSecond: 0.35,
  stuckSpeed: 25,
  stuckSeconds: 2,
  jumpLimit: 100,
  avoidAhead: 150,
  avoidWidth: 34,
  passOffset: 46,
  edgeMargin: 26,
  laneChangeRate: 2.5,
};

export const GRID = {
  playerSlot: 4,
};

export const RENDER = {
  maxTextures: 1,
};
