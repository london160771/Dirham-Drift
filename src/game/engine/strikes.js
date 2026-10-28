import { LATE_PAYMENT } from '../config/economy.js';
import { repossessNewest } from './garage.js';
import { record } from './ledger.js';
import { meetLesson } from './lessons.js';
import { payRequired } from './payments.js';

export function payOrMiss(state, kind, amount) {
  const result = payRequired(state, kind, amount);
  if (result.paid) return result.state;
  const missed = record(result.state, { kind: `${kind}Missed`, owed: amount });
  return { ...missed, missedThisStop: true };
}

export function strikesToRepo(state) {
  return LATE_PAYMENT.strikesToRepo[state.strikesMode];
}

export function settleStrikes(state) {
  if (!state.missedThisStop || state.strikeThisStop) return { ...state, missedThisStop: false };
  let next = record(state, { kind: 'lateFee', owed: LATE_PAYMENT.fee });
  next = { ...next, strikes: next.strikes + 1, missedThisStop: false, strikeThisStop: true };
  if (next.strikes < strikesToRepo(next)) return next;
  const before = next.upgrades.length;
  next = { ...repossessNewest(next), strikes: 0 };
  if (next.upgrades.length < before) next = meetLesson(next, 'missedPayments', next.lastRepo.price);
  return next;
}

export function collectOverdue(state) {
  if (state.overdue === 0) return state;
  const amount = state.overdue;
  const result = payRequired(state, 'overduePaid', amount);
  if (!result.paid) return { ...state, missedThisStop: true };
  return record(result.state, { kind: 'overdueCleared', owed: -amount });
}
