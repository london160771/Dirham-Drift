import { cleanup, fireEvent, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { SEASONS } from '../../src/game/config/season.js';
import { ledgerTotals } from '../../src/game/engine/index.js';
import { modeCards } from '../../src/ui/screens/modes.js';
import { loadCareer } from '../../src/ui/storage/seasonStore.js';
import { click, closeLessons, nextResults, raceOnce, races, startSeason, text } from './seasonHarness.jsx';

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => null;
});

function finishRace() {
  fireEvent.click(screen.getByText('finish'));
  if (screen.queryByTestId('race-damaged')) click('race-damaged');
  else click('continue');
}

describe('Quick Season (FR-MODE-001)', () => {
  it('starts the first race straight away, so it is two taps from the title', () => {
    startSeason('quick', { seed: SEASONS.quick.seed });
    expect(screen.getByTestId('fake-race')).toBeTruthy();
    expect(races[0].setup.trackId).toBe('marina');
  });

  it('after race 1 the Pit Hub shows the turbo, the loan and insurance', () => {
    startSeason('quick', { seed: SEASONS.quick.seed });
    nextResults.position = 1;
    finishRace();
    closeLessons();
    expect(text('turbo-offer')).toContain('short');
    click('offer-bank');
    expect(screen.getByTestId('offer-quick')).toBeTruthy();
    expect(screen.getByTestId('toggle-insurance')).toBeTruthy();
  });

  it('ends on the recap with grade, debt status, what-if and lessons', () => {
    startSeason('quick', { seed: SEASONS.quick.seed });
    nextResults.position = 2;
    finishRace();
    for (let i = 1; i < SEASONS.quick.races.length; i += 1) raceOnce();
    expect(screen.getByTestId('recap')).toBeTruthy();
    expect(text('grade')).toMatch(/^[ABCDF]$/);
    expect(text('what-if')).toContain('AED');
    expect(screen.getByTestId('recap-lessons').querySelectorAll('li')).toHaveLength(10);
    expect(text('recap-debt')).toMatch(/Debt-free|Still in debt/);
  });
});

describe('Career save and continue (FR-MODE-005)', () => {
  it('saves at the Pit Hub and resumes there after closing', () => {
    startSeason('career', { seed: 7 });
    click('tab-garage');
    click('buy-engine');
    click('tab-home');
    raceOnce();
    const cashBefore = text('cash');
    const saved = loadCareer();
    expect(saved.state.raceIndex).toBe(1);
    expect(saved.state.cash).toBe(saved.state.startingCash + ledgerTotals(saved.state.ledger).cash);
    cleanup();
    startSeason('career', { seed: saved.seed, saved });
    expect(screen.getByTestId('pit-hub')).toBeTruthy();
    expect(text('cash')).toBe(cashBefore);
    click('tab-garage');
    expect(screen.getByTestId('slot-engine').querySelectorAll('.pips i.on')).toHaveLength(1);
  });

  it('mode select offers Continue only when a career is saved', () => {
    expect(modeCards(null).map((m) => m.id)).toEqual(['quickSeason', 'career', 'quickRace']);
    startSeason('career', { seed: 3 });
    raceOnce();
    expect(modeCards(loadCareer()).map((m) => m.id)).toEqual(['quickSeason', 'continue', 'career', 'quickRace']);
  });

  it('ignores a save from an unknown version', () => {
    window.localStorage.setItem('dirham-drift:career', JSON.stringify({ version: 999, state: {} }));
    expect(loadCareer()).toBe(null);
  });

  it('clears the save when the season ends', () => {
    startSeason('career', { seed: 11 });
    for (let i = 0; i < SEASONS.career.races.length; i += 1) raceOnce('club');
    expect(screen.getByTestId('recap')).toBeTruthy();
    expect(loadCareer()).toBe(null);
  });
});
