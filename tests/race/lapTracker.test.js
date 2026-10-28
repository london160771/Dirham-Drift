import { describe, expect, it } from 'vitest';
import { TRACKS } from '../../src/game/config/tracks/index.js';
import { buildTrack } from '../../src/game/race/track/buildTrack.js';
import { createLapState, updateLap } from '../../src/game/race/sim/lapTracker.js';

const STEP = 6;

function driveTo(track, lap, from, to) {
  for (let d = from; d <= to; d += STEP) updateLap(track, lap, ((d % track.length) + track.length) % track.length);
  return lap;
}

describe('lap counting with ordered checkpoints (FR-RACE-002)', () => {
  const marina = buildTrack(TRACKS.marina);
  const start = marina.startS - 100;

  it('counts a lap only after every checkpoint and the line', () => {
    const lap = createLapState(marina, start);
    driveTo(marina, lap, start, marina.startS + marina.length - 20);
    expect(lap.laps).toBe(0);
    driveTo(marina, lap, marina.startS + marina.length - 20, marina.startS + marina.length + 20);
    expect(lap.laps).toBe(1);
  });

  it('finishes after three laps', () => {
    const lap = createLapState(marina, start);
    driveTo(marina, lap, start, marina.startS + marina.length * 3 + 10);
    expect(lap.laps).toBe(3);
    expect(lap.finished).toBe(true);
  });

  it('does not count a lap when a section is skipped', () => {
    const lap = createLapState(marina, start);
    driveTo(marina, lap, start, marina.startS + 1000);
    updateLap(marina, lap, (marina.startS + marina.length - 30) % marina.length);
    driveTo(marina, lap, marina.startS + marina.length - 30, marina.startS + marina.length + 60);
    expect(lap.laps).toBe(0);
  });

  it('does not count driving backwards over the line', () => {
    const lap = createLapState(marina, marina.startS + 50);
    for (let d = marina.startS + 50; d > marina.startS - 300; d -= STEP) updateLap(marina, lap, d);
    for (let d = marina.startS - 300; d < marina.startS + 60; d += STEP) updateLap(marina, lap, d);
    expect(lap.laps).toBe(0);
    expect(lap.checkpoint).toBe(0);
  });

  it('finishes the sprint at the finish line', () => {
    const sprint = buildTrack(TRACKS.sheikhZayed);
    const lap = createLapState(sprint, sprint.startS - 50);
    driveTo(sprint, lap, sprint.startS - 50, sprint.finishS - 10);
    expect(lap.finished).toBe(false);
    driveTo(sprint, lap, sprint.finishS - 10, sprint.finishS + 10);
    expect(lap.finished).toBe(true);
  });
});
