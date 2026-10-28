import { describe, expect, it } from 'vitest';
import { INSURANCE, LATE_PAYMENT, LOANS, REPAIR, SCAM } from '../../src/game/config/economy.js';
import { availableRaces, carStats, ledgerTotals, loanOffer, repairCost } from '../../src/game/engine/index.js';
import { act, career, race, raceAndReturn, toHub } from './helpers.js';

const FULL_CRASH = repairCost(100);

function borrowAndUpgrade(seed = 1) {
  let s = act(career(seed), 'takeLoan', { loanId: 'quick' });
  s = act(s, 'buyUpgrade', { slot: 'engine' });
  return act(s, 'buyUpgrade', { slot: 'tyres' });
}

describe('PRD §18 consequence checks', () => {
  it('1 — quick loan, no insurance, full crash, no savings, low prizes: strike, then repossession', () => {
    let s = race(borrowAndUpgrade(), { position: 5, damage: 100 });
    s = toHub(act(s, 'repair'));
    s = raceAndReturn(s, { position: 5 });
    expect(s.strikes).toBe(0);
    s = race(s, { position: 5 });
    expect(s.strikes).toBe(1);
    expect(s.overdue).toBe(LOANS.quick.perRace + LATE_PAYMENT.fee);
    expect(s.ledger.some((l) => l.kind === 'lateFee')).toBe(true);
    expect(carStats(s).tyres).toBe(1);
    s = race(toHub(s), { position: 5 });
    expect(carStats(s).tyres).toBe(0);
    expect(carStats(s).engine).toBe(1);
    expect(s.strikes).toBe(0);
    expect(s.lessonsMet).toContain('missedPayments');
  });

  it('2 — same crash with insurance: bill is 20% of the repair and no strike when cash covers it', () => {
    let s = act(borrowAndUpgrade(), 'setInsurance', { on: true });
    s = race(s, { position: 5, damage: 100 });
    const before = s.cash;
    s = act(s, 'repair');
    expect(before - s.cash).toBe(Math.floor((FULL_CRASH * (100 - INSURANCE.coversPercent)) / 100));
    expect(before - s.cash).toBe(800);
    expect(s.strikes).toBe(0);
  });

  it('3 — same crash, uninsured, enough savings: paid from savings automatically, no strike', () => {
    let s = act(career(), 'deposit', { amount: 5000 });
    s = race(s, { position: 5, damage: 100 });
    expect(s.cash).toBe(0);
    s = act(s, 'repair');
    expect(s.savings).toBe(5000 + 50 - FULL_CRASH);
    expect(s.damage).toBe(0);
    expect(s.strikes).toBe(0);
    let loanCase = act(career(), 'takeLoan', { loanId: 'quick' });
    loanCase = act(loanCase, 'deposit', { amount: loanCase.cash });
    loanCase = race(loanCase, { position: 5 });
    expect(loanCase.strikes).toBe(0);
    expect(loanCase.overdue).toBe(0);
    expect(loanCase.lessonsMet).toContain('emergencyFund');
  });

  it('4 — Desert Gold: first stop pays 30%, second stop the deposit is gone, lesson recorded', () => {
    let s = race(career(), { position: 1, keepEvent: true });
    s = { ...s, pendingEvent: 'desertGold' };
    s = act(act(s, 'continue'), 'chooseEvent', { choiceId: 'invest3000' });
    const afterDeposit = s.cash;
    s = race(s, { position: 5 });
    expect(s.cash - afterDeposit).toBe(Math.floor((3000 * SCAM.payoutPercent) / 100));
    expect(s.scam.stage).toBe('paid');
    s = race(toHub(s), { position: 5 });
    expect(s.scam.stage).toBe('collapsed');
    expect(s.lessonsMet).toContain('tooGoodToBeTrue');
    expect(s.ledger.filter((l) => l.kind === 'scamDeposit').reduce((a, l) => a + l.cash, 0)).toBe(-3000);
  });

  it('5 — cannot afford the Pro entry fee and no loan: Club Race is offered and startable', () => {
    let s = act(career(), 'buyUpgrade', { slot: 'engine' });
    s = { ...s, raceIndex: 4 };
    s = act(s, 'buyUpgrade', { slot: 'nitro' });
    expect(s.cash).toBe(0);
    const races = availableRaces(s);
    expect(races.find((r) => r.kind === 'stage').allowed).toBe(false);
    expect(races.find((r) => r.kind === 'club').allowed).toBe(true);
    expect(() => act(s, 'chooseRace', { kind: 'stage' })).toThrow();
    s = act(act(s, 'chooseRace', { kind: 'club' }), 'startRace');
    expect(s.phase).toBe('RACING');
  });

  it('6 — a loan shows a total equal to the sum of its scheduled payments', () => {
    for (const id of Object.keys(LOANS)) {
      const offer = loanOffer(id);
      expect(offer.total).toBe(offer.schedule.reduce((a, b) => a + b, 0));
      expect(offer.total).toBe(LOANS[id].perRace * LOANS[id].races);
    }
    expect(loanOffer('quick').total).toBe(7000);
    expect(loanOffer('big').total).toBe(18000);
  });

  it('7 — ten races: ledger sums match cash and every amount is whole', () => {
    let s = act(career(9), 'takeLoan', { loanId: 'quick' });
    s = act(s, 'setInsurance', { on: true });
    s = act(s, 'investFund', { amount: 2000 });
    for (let i = 0; i < 10; i += 1) {
      const kind = availableRaces(s).find((r) => r.kind === 'stage').allowed ? 'stage' : 'club';
      s = race(s, { position: (i % 5) + 1, damage: Math.max(s.damage, (i * 23) % 100), kind, keepEvent: true });
      if (s.phase === 'RESULTS' && s.damage > 0 && s.cash + s.savings >= REPAIR.base * 5) s = act(s, 'repair');
      s = act(s, 'continue');
      if (s.phase === 'EVENT') s = act(s, 'chooseEvent', { choiceId: firstChoice(s) });
    }
    expect(s.phase).toBe('RECAP');
    const totals = ledgerTotals(s.ledger);
    expect(s.cash).toBe(s.startingCash + totals.cash);
    expect(s.savings).toBe(totals.savings);
    expect(s.fundValue).toBe(totals.fund);
    expect(s.overdue).toBe(totals.owed);
    for (const line of s.ledger) for (const key of ['cash', 'savings', 'fund', 'owed']) expect(Number.isInteger(line[key])).toBe(true);
  });
});

function firstChoice(state) {
  return { puncture: 'pay', fakeBankText: 'click', friendBorrow: 'refuse', sponsorDeal: 'accept', bonusPrize: 'collect', desertGold: 'walkAway' }[state.pendingEvent];
}
