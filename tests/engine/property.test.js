import { describe, expect, it } from 'vitest';
import { UPGRADES } from '../../src/game/config/economy.js';
import { applyAction, availableRaces, createSeason, eventChoices, ledgerTotals, netWorth } from '../../src/game/engine/index.js';
import { createRng } from '../../src/game/engine/rng.js';

function pitAction(state, rng) {
  const options = [
    () => ({ type: 'buyUpgrade', slot: rng.pick(UPGRADES.slots) }),
    () => ({ type: 'takeLoan', loanId: rng.pick(['quick', 'big']) }),
    () => ({ type: 'deposit', amount: rng.int(1, Math.max(1, state.cash)) }),
    () => ({ type: 'withdraw', amount: rng.int(1, Math.max(1, state.savings)) }),
    () => ({ type: 'setInsurance', on: rng.next() < 0.5 }),
    () => ({ type: 'investFund', amount: rng.int(1, Math.max(1, state.cash)) }),
    () => ({ type: 'sellFund', amount: rng.int(1, Math.max(1, state.fundValue)) }),
    () => ({ type: 'repair' }),
    () => ({ type: 'dismissLesson' }),
  ];
  return rng.pick(options)();
}

function tryAction(state, action) {
  try {
    return applyAction(state, action);
  } catch (error) {
    if (error.code === 'illegal_transition') throw error;
    return state;
  }
}

function checkInvariants(state) {
  const totals = ledgerTotals(state.ledger);
  expect(state.cash).toBe(state.startingCash + totals.cash);
  expect(state.savings).toBe(totals.savings);
  expect(state.fundValue).toBe(totals.fund);
  expect(state.overdue).toBe(totals.owed);
  for (const value of [state.cash, state.savings, state.fundValue, state.overdue, netWorth(state)]) expect(Number.isInteger(value)).toBe(true);
  expect(state.cash).toBeGreaterThanOrEqual(0);
  expect(state.savings).toBeGreaterThanOrEqual(0);
}

function playSeason(mode, seed) {
  const rng = createRng(seed * 7919);
  let s = createSeason({ mode, seed });
  let guard = 0;
  while (s.phase !== 'RECAP' && guard < 500) {
    guard += 1;
    if (s.phase === 'PIT_HUB') {
      for (let k = rng.int(0, 4); k > 0; k -= 1) s = tryAction(s, pitAction(s, rng));
      const races = availableRaces(s);
      expect(races.some((r) => r.allowed)).toBe(true);
      const allowed = races.filter((r) => r.allowed);
      s = applyAction(s, { type: 'chooseRace', kind: rng.pick(allowed).kind });
      s = applyAction(s, { type: 'startRace' });
    } else if (s.phase === 'RACING') {
      s = applyAction(s, { type: 'finishRace', results: { position: rng.int(1, 5), damage: rng.next() < 0.5 ? rng.int(s.damage, 100) : s.damage, timeMs: rng.int(20000, 90000) } });
    } else if (s.phase === 'RESULTS') {
      if (rng.next() < 0.5) s = tryAction(s, { type: 'repair' });
      s = applyAction(s, { type: 'continue' });
    } else if (s.phase === 'EVENT') {
      const choices = eventChoices(s, s.pendingEvent).filter((c) => c.allowed);
      s = applyAction(s, { type: 'chooseEvent', choiceId: rng.pick(choices).id });
    }
    checkInvariants(s);
  }
  return s;
}

describe('property: random seasons never break INV-1, INV-4, INV-7', () => {
  it('300 random careers and quick seasons', () => {
    for (let seed = 1; seed <= 300; seed += 1) {
      const end = playSeason(seed % 3 === 0 ? 'quick' : 'career', seed);
      expect(end.phase).toBe('RECAP');
    }
  });
});

describe('determinism (INV-3)', () => {
  it('same seed + same choices + same results → same final state', () => {
    expect(playSeason('career', 42)).toEqual(playSeason('career', 42));
  });

  it('different career seeds give different event orders', () => {
    const orders = new Set();
    for (let seed = 1; seed <= 6; seed += 1) orders.add(playSeason('career', seed).eventsSeen.join(','));
    expect(orders.size).toBeGreaterThan(1);
  });
});
