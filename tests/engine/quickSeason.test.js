import { describe, expect, it } from 'vitest';
import { RENT } from '../../src/game/config/economy.js';
import { SEASONS } from '../../src/game/config/season.js';
import { createSeason, ledgerTotals, nextUpgradePrice, recapSummary, repairCost } from '../../src/game/engine/index.js';
import { act } from './helpers.js';

const QUICK = SEASONS.quick;

function runRace(state, position) {
  let s = act(state, 'chooseRace', { kind: 'stage' });
  s = act(s, 'startRace');
  return act(s, 'finishRace', { results: { position, damage: s.damage, timeMs: 60000 } });
}

function borrowerScript() {
  let s = createSeason({ mode: 'quick', seed: QUICK.seed });
  s = act(runRace(s, 2), 'continue');
  s = act(s, 'takeLoan', { loanId: 'quick' });
  s = act(s, 'buyUpgrade', { slot: 'engine' });
  s = runRace(s, 5);
  s = act(s, 'continue');
  s = act(s, 'chooseEvent', { choiceId: 'invest1000' });
  while (s.pendingLesson) s = act(s, 'dismissLesson');
  s = runRace(s, 1);
  return act(s, 'continue');
}

function saverScript() {
  let s = createSeason({ mode: 'quick', seed: QUICK.seed });
  s = act(runRace(s, 2), 'continue');
  s = act(s, 'setInsurance', { on: true });
  s = act(s, 'deposit', { amount: 2000 });
  s = act(runRace(s, 5), 'continue');
  s = act(s, 'chooseEvent', { choiceId: 'walkAway' });
  while (s.pendingLesson) s = act(s, 'dismissLesson');
  s = runRace(s, 1);
  return act(s, 'continue');
}

const kinds = (s) => s.ledger.map((l) => `${l.race + 1}:${l.kind}`);

describe('Quick Season seeded script (PRD §19, FR-MODE-001)', () => {
  it('race 1 Pit Hub: the turbo costs more than any race-1 prize leaves you', () => {
    const s = act(runRace(createSeason({ mode: 'quick', seed: QUICK.seed }), 1), 'continue');
    expect(nextUpgradePrice(s, 'engine')).toBeGreaterThan(s.cash);
  });

  it('race 2: a crash bill always hits, even on a clean race, plus rent, then Desert Gold', () => {
    const s = runRace(act(runRace(createSeason({ mode: 'quick', seed: QUICK.seed }), 1), 'continue'), 1);
    const race2 = s.ledger.filter((l) => l.race === 1).map((l) => l.kind);
    expect(race2).toContain('rent');
    expect(race2).toContain('crashBill');
    expect(s.ledger.find((l) => l.kind === 'crashBill').cash).toBe(-repairCost(QUICK.scriptedBills[2].damage));
    expect(s.ledger.find((l) => l.kind === 'rent').cash).toBe(-RENT.amount);
    expect(s.pendingEvent).toBe('desertGold');
  });

  it('race 3 is the Sheikh Zayed final and an invested scam collapses before the recap', () => {
    const s = borrowerScript();
    expect(s.phase).toBe('RECAP');
    expect(s.ledger.map((l) => l.kind)).toEqual(expect.arrayContaining(['scamPayout', 'scamLost']));
    expect(s.lessonsMet).toContain('tooGoodToBeTrue');
  });

  it('same events in the same order every run', () => {
    expect(kinds(borrowerScript())).toEqual(kinds(borrowerScript()));
    expect(borrowerScript()).toEqual(borrowerScript());
  });

  it('player choices still change the outcome', () => {
    const borrower = recapSummary(borrowerScript());
    const saver = recapSummary(saverScript());
    expect(saver.netWorth).toBeGreaterThan(borrower.netWorth);
    expect(borrower.debtFree).toBe(false);
    expect(saver.debtFree).toBe(true);
  });

  it('the borrower misses the crash bill, gets a strike and loses the turbo', () => {
    const s = borrowerScript();
    expect(s.ledger.map((l) => l.kind)).toEqual(expect.arrayContaining(['crashBillMissed', 'lateFee', 'repossessed']));
    expect(s.lessonsMet).toContain('missedPayments');
  });

  it('final state matches the checked-in snapshot', () => {
    const s = borrowerScript();
    expect(s.cash).toBe(s.startingCash + ledgerTotals(s.ledger).cash);
    expect({ events: kinds(s), state: s, recap: recapSummary(s) }).toMatchSnapshot();
  });
});
