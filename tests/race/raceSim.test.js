import { describe, expect, it } from 'vitest';
import { RACE, RIVAL_PACE } from '../../src/game/config/race.js';
import { TRACKS } from '../../src/game/config/tracks/index.js';
import { buildTrack } from '../../src/game/race/track/buildTrack.js';
import { createRace, raceResults, stepRace } from '../../src/game/race/sim/raceSim.js';
import { buildPerformance } from '../../src/game/race/sim/performance.js';

const IDLE = { steer: 0, gas: 0, brake: 0, nitro: false };
const MAX_SECONDS = 400;

function rivalsOnly(trackId, stage, seed) {
  const track = buildTrack(TRACKS[trackId]);
  const pace = RIVAL_PACE[stage];
  const race = createRace({ track, player: buildPerformance(), rivals: Array.from({ length: 4 }, () => buildPerformance({}, pace)), seed, rivalPace: pace });
  let t = 0;
  while (race.entries.slice(1).some((e) => !e.lap.finished) && t < MAX_SECONDS) {
    stepRace(race, IDLE, RACE.fixedStep);
    t += RACE.fixedStep;
  }
  return race;
}

function averageFinish(race) {
  const rivals = race.entries.slice(1);
  return rivals.reduce((sum, e) => sum + e.finishTime, 0) / rivals.length;
}

describe('race simulation (FR-RACE-003/004)', () => {
  for (const trackId of Object.keys(TRACKS)) {
    it(`all rivals finish ${trackId} without getting stuck`, () => {
      const race = rivalsOnly(trackId, 'rookie', 11);
      expect(race.entries.slice(1).every((e) => e.lap.finished)).toBe(true);
    });

    it(`final-stage rivals are faster than rookie rivals on ${trackId}`, () => {
      expect(averageFinish(rivalsOnly(trackId, 'final', 5))).toBeLessThan(averageFinish(rivalsOnly(trackId, 'rookie', 5)));
      expect(averageFinish(rivalsOnly(trackId, 'pro', 5))).toBeLessThan(averageFinish(rivalsOnly(trackId, 'rookie', 5)));
    });
  }

  it('the same seed gives the same race', () => {
    const a = rivalsOnly('marina', 'pro', 99);
    const b = rivalsOnly('marina', 'pro', 99);
    expect(a.finishOrder).toEqual(b.finishOrder);
    expect(a.entries.map((e) => e.finishTime)).toEqual(b.entries.map((e) => e.finishTime));
  });

  it('positions match the finishing order and the race returns results only', () => {
    const race = rivalsOnly('sheikhZayed', 'pro', 3);
    const results = raceResults(race);
    expect(results.finishOrder.slice(0, 4)).toEqual(race.finishOrder);
    expect(results.position).toBe(5);
    expect(Object.keys(results).sort()).toEqual(['damage', 'finishOrder', 'hits', 'position', 'timeMs', 'trackId']);
  });
});
