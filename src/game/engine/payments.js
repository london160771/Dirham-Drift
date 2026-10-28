import { record } from './ledger.js';
import { meetLesson } from './lessons.js';

export function canCover(state, amount) {
  return state.cash + state.savings >= amount;
}

export function payRequired(state, kind, amount) {
  if (amount <= 0) return { state, paid: true };
  if (!canCover(state, amount)) return { state, paid: false };
  const fromCash = Math.min(state.cash, amount);
  const fromSavings = amount - fromCash;
  let next = record(state, { kind, cash: -fromCash, savings: -fromSavings });
  if (fromSavings > 0) next = meetLesson(next, 'emergencyFund', fromSavings);
  return { state: next, paid: true };
}

export function takeUpTo(state, kind, amount) {
  const fromCash = Math.min(state.cash, amount);
  const fromSavings = Math.min(state.savings, amount - fromCash);
  return record(state, { kind, cash: -fromCash, savings: -fromSavings });
}
