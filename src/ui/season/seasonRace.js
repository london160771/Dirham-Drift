import { RACE, RACE_SEEDS } from '../../game/config/race.js';
import { carStats, loanOwed } from '../../game/engine/index.js';
import { buildRaceSetup } from '../raceSetup.js';

export function seasonRaceSetup(state, difficulty) {
  return buildRaceSetup({
    trackId: state.nextRace.track,
    carStats: carStats(state),
    stage: state.nextRace.stage,
    difficulty,
    seed: state.seed + state.raceIndex * RACE_SEEDS.perRaceStep,
  });
}

export function hudMoney(state) {
  return { cash: state.cash, loanLeft: loanOwed(state) };
}

export function retiredResults(state, telemetry) {
  return {
    trackId: state.nextRace.track,
    position: RACE.carCount,
    timeMs: telemetry ? telemetry.timeMs : 0,
    damage: Math.max(state.damage, telemetry ? telemetry.damage : 0),
    hits: 0,
    finishOrder: [],
    retired: true,
  };
}
