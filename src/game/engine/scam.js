import { SCAM } from '../config/economy.js';
import { record } from './ledger.js';
import { meetLesson } from './lessons.js';
import { EngineError, percentOf } from './money.js';

export function investScam(state, amount) {
  if (!SCAM.investOptions.includes(amount)) throw new EngineError('bad_amount', `Invest one of ${SCAM.investOptions}`);
  if (state.cash < amount) throw new EngineError('cannot_afford', `Need ${amount}`);
  const next = record(state, { kind: 'scamDeposit', cash: -amount });
  return { ...next, scam: { deposit: amount, stage: 'invested' } };
}

function collapse(state) {
  const next = record(state, { kind: 'scamLost', value: state.scam.deposit });
  return meetLesson({ ...next, scam: { ...state.scam, stage: 'collapsed' } }, 'tooGoodToBeTrue', state.scam.deposit);
}

export function advanceScam(state) {
  if (!state.scam) return state;
  if (state.scam.stage === 'invested') {
    const payout = percentOf(state.scam.deposit, SCAM.payoutPercent);
    const next = record(state, { kind: 'scamPayout', cash: payout });
    return { ...next, scam: { ...state.scam, stage: 'paid' } };
  }
  if (state.scam.stage === 'paid') return collapse(state);
  return state;
}

export function closeScam(state) {
  return state.scam && state.scam.stage !== 'collapsed' ? collapse(state) : state;
}
