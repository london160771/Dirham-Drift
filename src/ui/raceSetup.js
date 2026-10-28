import { RACE_SEEDS, RIVAL_PACE } from '../game/config/race.js';
import { buildPerformance } from '../game/race/sim/performance.js';

const RIVALS = 4;

export function buildRaceSetup({ trackId, carStats = { engine: 0, tyres: 0, nitro: 0, damage: 0 }, stage = 'rookie', seed = RACE_SEEDS.quickRace }) {
  const pace = RIVAL_PACE[stage];
  return {
    trackId,
    race: {
      player: buildPerformance(carStats),
      rivals: Array.from({ length: RIVALS }, () => buildPerformance({}, pace)),
      rivalPace: pace,
      seed,
      startDamage: carStats.damage,
    },
  };
}
