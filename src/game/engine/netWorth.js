import { carValue } from './garage.js';
import { loanOwed } from './loans.js';

export function netWorth(state) {
  return state.cash + state.savings + state.fundValue + carValue(state) - loanOwed(state) - state.overdue;
}

export function isDebtFree(state) {
  return loanOwed(state) === 0 && state.overdue === 0;
}
