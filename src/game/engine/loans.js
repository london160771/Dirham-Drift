import { LOANS } from '../config/economy.js';
import { record } from './ledger.js';
import { EngineError } from './money.js';

export function loanOffer(id) {
  const offer = LOANS[id];
  if (!offer) throw new EngineError('unknown_loan', `No loan ${id}`);
  const schedule = Array.from({ length: offer.races }, () => offer.perRace);
  return { ...offer, schedule, total: schedule.reduce((a, b) => a + b, 0), cost: offer.perRace * offer.races - offer.borrow };
}

export function loanOffers() {
  return Object.keys(LOANS).map(loanOffer);
}

export function takeLoan(state, id) {
  if (state.loan) throw new EngineError('loan_active', 'Only one loan at a time');
  const offer = loanOffer(id);
  const next = record(state, { kind: 'loanIn', cash: offer.borrow, item: id });
  return { ...next, loan: { id, borrow: offer.borrow, perRace: offer.perRace, races: offer.races, racesLeft: offer.races, paid: 0 } };
}

export function loanOwed(state) {
  return state.loan ? state.loan.perRace * state.loan.racesLeft : 0;
}
