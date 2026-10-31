import { DEFAULT_DIFFICULTY, DIFFICULTY, RACE_SEEDS, RIVAL_PACE } from '../game/config/race.js';
import { ASSISTS } from '../game/config/settings.js';
import { buildPerformance } from '../game/race/sim/performance.js';

const RIVALS = 4;

export function buildRaceSetup({ trackId, carStats = { engine: 0, tyres: 0, nitro: 0, damage: 0 }, stage = 'rookie', seed = RACE_SEEDS.quickRace, rivals = RIVALS, difficulty = DEFAULT_DIFFICULTY }) {
  const skill = DIFFICULTY[difficulty] ?? DIFFICULTY.easy;
  const pace = RIVAL_PACE[stage] * skill.pace;
  return {
    trackId,
    looks: { engine: carStats.engine, tyres: carStats.tyres, nitro: carStats.nitro },
    race: {
      player: buildPerformance(carStats),
      rivals: Array.from({ length: rivals }, () => buildPerformance({}, pace)),
      rivalPace: pace,
      skill,
      seed,
      startDamage: carStats.damage,
    },
  };
}

export function applyAssists(setup, settings) {
  const chill = settings.chillMode;
  const scale = (perf) => ({ ...perf, topSpeed: perf.topSpeed * ASSISTS.chillRivalPace, acceleration: perf.acceleration * ASSISTS.chillRivalPace });
  return {
    ...setup,
    assists: { steering: settings.steeringAssist ? ASSISTS.steeringStrength : 0, autoGas: settings.autoAccelerate },
    race: {
      ...setup.race,
      player: chill ? { ...setup.race.player, damageTaken: ASSISTS.chillDamageTaken } : setup.race.player,
      rivals: chill ? setup.race.rivals.map(scale) : setup.race.rivals,
      rivalPace: chill ? setup.race.rivalPace * ASSISTS.chillRivalPace : setup.race.rivalPace,
    },
  };
}

export function buildGhostSetup({ trackId, ghost = null }) {
  return { ...buildRaceSetup({ trackId, rivals: 0 }), recordGhost: true, ghost };
}
