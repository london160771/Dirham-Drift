import { describe, expect, it } from 'vitest';
import { ASSISTS, SETTING_DEFAULTS } from '../../src/game/config/settings.js';
import { applyAssists, buildRaceSetup } from '../../src/ui/raceSetup.js';
import { moneySoundFor } from '../../src/ui/season/useMoneySounds.js';

describe('driving assists', () => {
  const setup = buildRaceSetup({ trackId: 'marina' });

  it('are off by default and change nothing', () => {
    const tuned = applyAssists(setup, SETTING_DEFAULTS);
    expect(tuned.assists).toEqual({ steering: 0, autoGas: false });
    expect(tuned.race).toEqual(setup.race);
  });

  it('chill mode slows rivals and halves crash damage', () => {
    const tuned = applyAssists(setup, { ...SETTING_DEFAULTS, chillMode: true });
    expect(tuned.race.rivals[0].topSpeed).toBeCloseTo(setup.race.rivals[0].topSpeed * ASSISTS.chillRivalPace);
    expect(tuned.race.player.damageTaken).toBe(ASSISTS.chillDamageTaken);
  });

  it('steering assist and auto-accelerate reach the race', () => {
    const tuned = applyAssists(setup, { ...SETTING_DEFAULTS, steeringAssist: true, autoAccelerate: true });
    expect(tuned.assists).toEqual({ steering: ASSISTS.steeringStrength, autoGas: true });
  });
});

describe('money sounds', () => {
  it('coin for money in, thud for money out, repo sound for a repossession', () => {
    expect(moneySoundFor([{ kind: 'prize', cash: 3000, savings: 0, owed: 0 }])).toBe('coin');
    expect(moneySoundFor([{ kind: 'upgrade', cash: -2500, savings: 0, owed: 0 }])).toBe('thud');
    expect(moneySoundFor([{ kind: 'repossessed', cash: 0, savings: 0, owed: 0 }])).toBe('repo');
    expect(moneySoundFor([])).toBe(null);
  });
});
