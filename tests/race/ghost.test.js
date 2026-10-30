import { describe, expect, it } from 'vitest';
import { GHOST } from '../../src/game/config/ghost.js';
import { RACE, RIVAL_PACE } from '../../src/game/config/race.js';
import { TRACKS, TRACK_IDS } from '../../src/game/config/tracks/index.js';
import { ghostPose } from '../../src/game/race/ghost/playback.js';
import { createGhostRecorder } from '../../src/game/race/ghost/recorder.js';
import { createAiBrain, driveAi } from '../../src/game/race/sim/aiDriver.js';
import { createRace, raceResults, stepRace } from '../../src/game/race/sim/raceSim.js';
import { buildTrack } from '../../src/game/race/track/buildTrack.js';
import { createRng } from '../../src/game/engine/rng.js';
import { buildGhostSetup } from '../../src/ui/raceSetup.js';
import { CODE, GHOST_RULES } from '../../server/src/config.js';
import { validateGhost } from '../../server/src/validateGhost.js';

const MAX_SECONDS = 400;

function soloRun(trackId) {
  const setup = buildGhostSetup({ trackId });
  const race = createRace({ track: buildTrack(TRACKS[trackId]), ...setup.race });
  const recorder = createGhostRecorder(trackId);
  const player = race.entries[0];
  const brain = createAiBrain(0, createRng(1));
  const input = { steer: 0, gas: 0, brake: 0, nitro: false };
  while (race.phase !== 'done' && race.time < MAX_SECONDS) {
    driveAi(race.track, player.car, player.loc, brain, RIVAL_PACE.pro, RACE.fixedStep, input);
    stepRace(race, input, RACE.fixedStep);
    recorder.sample(race);
  }
  const results = raceResults(race);
  return { race, results, ghost: recorder.ghost(results.timeMs) };
}

describe('Ghost Challenge recording (FR-MODE-006)', () => {
  it('a ghost race has only the player on the grid', () => {
    const setup = buildGhostSetup({ trackId: 'marina' });
    expect(setup.race.rivals).toEqual([]);
    expect(setup.recordGhost).toBe(true);
    expect(createRace({ track: buildTrack(TRACKS.marina), ...setup.race }).entries).toHaveLength(1);
  });

  for (const trackId of TRACK_IDS) {
    it(`a finished ${trackId} run passes the server's ghost check`, () => {
      const { results, ghost } = soloRun(trackId);
      expect(results.position).toBe(1);
      expect(ghost.track).toBe(trackId);
      const sent = JSON.stringify(ghost);
      expect(validateGhost(JSON.parse(sent))).toEqual(JSON.parse(sent));
      expect(sent.length).toBeLessThan(160 * 1024);
    });
  }

  it('the same run records the same path every time', () => {
    expect(soloRun('sheikhZayed').ghost).toEqual(soloRun('sheikhZayed').ghost);
  });

  it('client and server agree on tracks, sample rate, time limits and codes', () => {
    expect(GHOST_RULES.trackIds).toEqual(TRACK_IDS);
    expect(GHOST_RULES.sampleHz).toBe(GHOST.sampleHz);
    expect([GHOST_RULES.minTimeMs, GHOST_RULES.maxTimeMs]).toEqual([GHOST.minTimeMs, GHOST.maxTimeMs]);
    expect([CODE.length, CODE.alphabet]).toEqual([GHOST.codeLength, GHOST.codeAlphabet]);
  });
});

describe('Ghost playback', () => {
  const frames = [
    [0, 0, 3100],
    [100, 0, -3100],
    [100, 50, 0],
  ];

  it('replays the recorded path between samples', () => {
    const mid = ghostPose(frames, 0.5 / GHOST.sampleHz);
    expect(mid.x).toBeCloseTo(50);
    expect(mid.y).toBeCloseTo(0);
  });

  it('turns the short way across the ±π seam', () => {
    const mid = ghostPose(frames, 0.5 / GHOST.sampleHz);
    expect(Math.abs(Math.abs(mid.heading) - Math.PI)).toBeLessThan(0.05);
  });

  it('waits on the grid before the start and parks at the finish', () => {
    expect(ghostPose(frames, -1)).toMatchObject({ x: 0, y: 0 });
    expect(ghostPose(frames, 99)).toMatchObject({ x: 100, y: 50, heading: 0 });
  });

  it('follows a recorded race exactly at each sample', () => {
    const { ghost } = soloRun('sheikhZayed');
    const i = Math.floor(ghost.frames.length / 2);
    const pose = ghostPose(ghost.frames, i / GHOST.sampleHz);
    expect([Math.round(pose.x), Math.round(pose.y)]).toEqual(ghost.frames[i].slice(0, 2));
  });
});
