import { describe, expect, it } from 'vitest';
import { AI, DIFFICULTY, DIFFICULTY_IDS, RACE } from '../../src/game/config/race.js';
import { TRACKS } from '../../src/game/config/tracks/index.js';
import { catchUpFactor, createAiBrain } from '../../src/game/race/sim/aiDriver.js';
import { createRace, stepRace } from '../../src/game/race/sim/raceSim.js';
import { buildTrack } from '../../src/game/race/track/buildTrack.js';
import { createRng } from '../../src/game/engine/rng.js';
import { buildGhostSetup, buildRaceSetup } from '../../src/ui/raceSetup.js';

const IDLE = { steer: 0, gas: 0, brake: 0, nitro: false };
const MAX_SECONDS = 400;

function rivalsOnly(trackId, stage, difficulty, seed = 5) {
  const race = createRace({ track: buildTrack(TRACKS[trackId]), ...buildRaceSetup({ trackId, stage, difficulty, seed }).race });
  for (let t = 0; t < MAX_SECONDS && race.entries.slice(1).some((e) => !e.lap.finished); t += RACE.fixedStep) stepRace(race, IDLE, RACE.fixedStep);
  return race;
}

function averageFinish(race) {
  const rivals = race.entries.slice(1);
  return rivals.reduce((sum, e) => sum + e.finishTime, 0) / rivals.length;
}

describe('difficulty (FR-MODE-007)', () => {
  it('Easy is the default and builds the same race as before difficulty existed', () => {
    expect(buildRaceSetup({ trackId: 'marina', difficulty: 'easy' })).toEqual(buildRaceSetup({ trackId: 'marina' }));
    expect(DIFFICULTY.easy).toMatchObject({ pace: 1, catchUp: 0 });
  });

  for (const trackId of Object.keys(TRACKS)) {
    it(`harder rivals finish ${trackId} faster, and all of them finish`, () => {
      const [easy, medium, hard] = DIFFICULTY_IDS.map((id) => rivalsOnly(trackId, 'final', id));
      expect([easy, medium, hard].every((race) => race.entries.slice(1).every((e) => e.lap.finished))).toBe(true);
      expect(averageFinish(medium)).toBeLessThan(averageFinish(easy));
      expect(averageFinish(hard)).toBeLessThan(averageFinish(medium));
    });
  }

  it('stage pace still applies inside each difficulty', () => {
    expect(averageFinish(rivalsOnly('sheikhZayed', 'final', 'hard'))).toBeLessThan(averageFinish(rivalsOnly('sheikhZayed', 'rookie', 'hard')));
  });

  it('the same seed gives the same Hard race', () => {
    const a = rivalsOnly('marina', 'pro', 'hard', 99);
    const b = rivalsOnly('marina', 'pro', 'hard', 99);
    expect(a.entries.map((e) => e.finishTime)).toEqual(b.entries.map((e) => e.finishTime));
  });

  it('catch-up only helps rivals behind the player and is off on Easy', () => {
    const brain = (id) => createAiBrain(0, createRng(1), DIFFICULTY[id]);
    expect(catchUpFactor(brain('easy'), AI.catchUpFullGap)).toBe(1);
    expect(catchUpFactor(brain('hard'), -AI.catchUpFullGap)).toBe(1);
    expect(catchUpFactor(brain('hard'), AI.catchUpFullGap * 3)).toBeCloseTo(1 + DIFFICULTY.hard.catchUp);
    expect(catchUpFactor(brain('medium'), AI.catchUpFullGap / 2)).toBeCloseTo(1 + DIFFICULTY.medium.catchUp / 2);
  });

  it('an unknown difficulty falls back to Easy and Ghost Challenge has no rivals', () => {
    expect(buildRaceSetup({ trackId: 'marina', difficulty: 'nope' }).race.skill).toBe(DIFFICULTY.easy);
    expect(buildGhostSetup({ trackId: 'marina' }).race.rivals).toHaveLength(0);
  });
});
