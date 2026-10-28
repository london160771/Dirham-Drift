import { record } from './ledger.js';
import { EngineError, assertPositive } from './money.js';

function requireAtMost(amount, available, code) {
  if (amount > available) throw new EngineError(code, `Only ${available} available`);
}

export function deposit(state, amount) {
  assertPositive(amount, 'deposit');
  requireAtMost(amount, state.cash, 'cannot_afford');
  return record(state, { kind: 'deposit', cash: -amount, savings: amount });
}

export function withdraw(state, amount) {
  assertPositive(amount, 'withdrawal');
  requireAtMost(amount, state.savings, 'not_enough_savings');
  return record(state, { kind: 'withdraw', cash: amount, savings: -amount });
}

export function setInsurance(state, on) {
  return { ...state, insured: Boolean(on) };
}

export function investFund(state, amount) {
  assertPositive(amount, 'investment');
  requireAtMost(amount, state.cash, 'cannot_afford');
  return record(state, { kind: 'fundBuy', cash: -amount, fund: amount });
}

export function sellFund(state, amount) {
  assertPositive(amount, 'sale');
  requireAtMost(amount, state.fundValue, 'not_enough_fund');
  return record(state, { kind: 'fundSell', cash: amount, fund: -amount });
}
