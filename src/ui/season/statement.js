const BOOKKEEPING = new Set(['overdueCleared']);
const NOTICES = new Set(['repossessed', 'scamLost']);

export function statementLines(state, from) {
  return state.ledger
    .slice(from)
    .filter((line) => !BOOKKEEPING.has(line.kind))
    .map((line) => ({
      id: line.id,
      kind: line.kind,
      item: line.item,
      percent: line.percent,
      notice: NOTICES.has(line.kind),
      amount: line.cash + line.savings + line.fund,
      owed: line.owed,
      fromSavings: line.savings < 0 && line.cash + line.savings < 0 ? -line.savings : 0,
    }));
}
