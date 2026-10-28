import { assertWhole } from './money.js';

export function record(state, entry) {
  const line = { id: state.ledger.length + 1, race: state.raceIndex, cash: 0, savings: 0, fund: 0, owed: 0, ...entry };
  assertWhole(line.cash, 'cash change');
  assertWhole(line.savings, 'savings change');
  assertWhole(line.fund, 'fund change');
  assertWhole(line.owed, 'owed change');
  return {
    ...state,
    cash: state.cash + line.cash,
    savings: state.savings + line.savings,
    fundValue: state.fundValue + line.fund,
    overdue: state.overdue + line.owed,
    ledger: [...state.ledger, line],
  };
}

export function ledgerTotals(ledger) {
  return ledger.reduce(
    (sum, line) => ({
      cash: sum.cash + line.cash,
      savings: sum.savings + line.savings,
      fund: sum.fund + line.fund,
      owed: sum.owed + line.owed,
    }),
    { cash: 0, savings: 0, fund: 0, owed: 0 },
  );
}

export function entriesForRace(state, race) {
  return state.ledger.filter((line) => line.race === race);
}
