import { describe, expect, it } from 'vitest';
import { GRADES } from '../../src/game/config/season.js';
import { createSeason, isDebtFree, ledgerTotals, netWorth, recapSummary, savedInstead, seasonGrade } from '../../src/game/engine/index.js';
import { act, career, race, raceAndReturn } from './helpers.js';

function finishSeason(state, position, kind = 'club') {
  let s = state;
  while (s.phase !== 'RECAP') {
    s = raceAndReturn(s, { position, kind });
    while (s.phase === 'PIT_HUB' && s.pendingLesson) s = act(s, 'dismissLesson');
  }
  return s;
}

describe('season recap (FR-MODE-004)', () => {
  it('grades by net worth with the configured thresholds, one grade lower when in debt', () => {
    const [a, b] = GRADES.netWorthAtLeast.career;
    const base = { ...career(), cash: a };
    expect(seasonGrade(base)).toBe('A');
    expect(seasonGrade({ ...base, cash: b })).toBe('B');
    expect(seasonGrade({ ...base, cash: 0 })).toBe(GRADES.fail);
    expect(seasonGrade({ ...base, cash: a + 1, overdue: 1 })).toBe('B');
  });

  it('recap numbers match the ledger', () => {
    const s = finishSeason(act(career(5), 'takeLoan', { loanId: 'quick' }), 2);
    const recap = recapSummary(s);
    const totals = ledgerTotals(s.ledger);
    expect(recap.cash).toBe(s.startingCash + totals.cash);
    expect(recap.savings).toBe(totals.savings);
    expect(recap.fund).toBe(totals.fund);
    expect(recap.netWorth).toBe(netWorth(s));
    expect(recap.netWorth).toBe(recap.cash + recap.savings + recap.fund + recap.carValue - recap.owed);
    expect(recap.debtFree).toBe(isDebtFree(s));
    expect(recap.races).toBe(s.totalRaces);
  });

  it('"what if you had saved" replays the same finishes with no loan and no scam', () => {
    let s = createSeason({ mode: 'quick', seed: 9 });
    s = act(s, 'takeLoan', { loanId: 'quick' });
    s = act(s, 'buyUpgrade', { slot: 'engine' });
    s = finishSeason(s, 2, 'stage');
    const saver = savedInstead(s);
    expect(Number.isInteger(saver.netWorth)).toBe(true);
    expect(saver.debtFree).toBe(true);
    expect(saver.netWorth).toBeGreaterThan(netWorth(s));
    expect(recapSummary(s).saver.difference).toBe(saver.netWorth - netWorth(s));
  });

  it('logs each race result for the recap', () => {
    const s = race(career(), { position: 2, damage: 10 });
    expect(s.raceLog).toEqual([{ kind: 'stage', position: 2, damage: 10 }]);
  });
});
