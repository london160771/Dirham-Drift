import { EVENTS, INDEX_FUND, INSURANCE, RENT, SAVINGS } from '../config/economy.js';
import { seasonPlan, isSeasonOver, rentDueAfter, scriptedBillAfter } from './season.js';
import { RANDOM_EVENTS } from './events.js';
import { record } from './ledger.js';
import { meetLesson } from './lessons.js';
import { EngineError, percentOf } from './money.js';
import { randomInt } from './rng.js';
import { repairCost, trackDamage } from './repair.js';
import { advanceScam } from './scam.js';
import { collectOverdue, payOrMiss, settleStrikes } from './strikes.js';

function validateResults(results, carCount, startDamage) {
  const { position, damage, timeMs } = results;
  if (!Number.isInteger(position) || position < 1 || position > carCount) throw new EngineError('bad_results', 'position out of range');
  if (!Number.isInteger(damage) || damage < startDamage || damage > 100) throw new EngineError('bad_results', 'damage must be whole, 0–100, and not below the starting damage');
  if (!Number.isInteger(timeMs) || timeMs < 0) throw new EngineError('bad_results', 'time must be whole ms');
}

function roll(state, min, max) {
  const r = randomInt(state.rngSeed, min, max);
  return { value: r.value, state: { ...state, rngSeed: r.seed } };
}

function payLoan(state) {
  if (!state.loan || state.loan.racesLeft === 0) return state;
  const { perRace } = state.loan;
  const before = state.ledger.length;
  let next = payOrMiss(state, 'loanPayment', perRace);
  const paid = next.ledger.slice(before).some((line) => line.kind === 'loanPayment');
  next = { ...next, loan: { ...next.loan, racesLeft: next.loan.racesLeft - 1, paid: next.loan.paid + (paid ? perRace : 0) } };
  return meetLesson(next, 'costOfBorrowing', state.loan.perRace * state.loan.races - state.loan.borrow);
}

export function closeLoanIfDone(state) {
  if (!state.loan || state.loan.racesLeft > 0 || state.overdue > 0) return state;
  const total = state.loan.perRace * state.loan.races;
  return meetLesson({ ...state, loan: null, strikes: 0 }, 'totalCostOfLoan', total);
}

function sponsorAndFriend(state, position) {
  let next = state;
  if (next.sponsor) {
    if (position > EVENTS.sponsorTopPosition) next = payOrMiss(next, 'sponsorPenalty', EVENTS.sponsorPenalty);
    next = { ...next, sponsor: false };
  }
  if (next.friendLoan > 0) {
    const r = roll(next, 1, 100);
    next = r.state;
    if (r.value <= EVENTS.friendRepaysPercent) next = record(next, { kind: 'friendRepaid', cash: next.friendLoan });
    next = meetLesson({ ...next, friendLoan: 0 }, 'lendingToFriends', EVENTS.friendLoan);
  }
  return next;
}

function growth(state) {
  let next = state;
  const interest = percentOf(next.savings, SAVINGS.growthPercent);
  if (interest > 0) next = record(next, { kind: 'savingsGrowth', savings: interest });
  if (next.fundValue > 0) {
    const r = roll(next, INDEX_FUND.minChangePercent, INDEX_FUND.maxChangePercent);
    const change = percentOf(r.state.fundValue, r.value);
    next = record(r.state, { kind: 'fundMove', fund: change, percent: r.value });
    if (change < 0) next = meetLesson(next, 'investingUpsDowns', change);
  }
  return advanceScam(next);
}

function scriptedBill(state, wasInsured) {
  const bill = scriptedBillAfter(state, state.raceIndex + 1);
  if (!bill) return state;
  const cost = repairCost(bill.damage);
  const due = wasInsured ? percentOf(cost, 100 - INSURANCE.coversPercent) : cost;
  const next = payOrMiss(state, bill.kind, due);
  return wasInsured ? meetLesson(next, 'insurance', cost - due) : next;
}

function logRace(state, race, results) {
  return { ...state, raceLog: [...state.raceLog, { kind: race.kind, position: results.position, damage: results.damage }] };
}

function drawEvent(state) {
  if (isSeasonOver(state)) return state;
  if (state.scamOfferAt === state.raceIndex && !state.eventsSeen.includes('desertGold')) return { ...state, pendingEvent: 'desertGold' };
  if (!seasonPlan(state.mode).randomEvents) return state;
  const chance = roll(state, 1, 100);
  if (chance.value > EVENTS.chancePerStop) return chance.state;
  const pick = roll(chance.state, 0, RANDOM_EVENTS.length - 1);
  return { ...pick.state, pendingEvent: RANDOM_EVENTS[pick.value] };
}

export function afterRace(state, results, carCount) {
  validateResults(results, carCount, state.damage);
  const race = state.nextRace;
  const prize = race.prizes[results.position - 1];
  let s = { ...state, missedThisStop: false, strikeThisStop: false, lastResults: results, lastRepo: null };
  s = trackDamage(s, results.damage);
  s = record(s, { kind: 'prize', cash: prize, position: results.position });
  if (race.entryFee > 0) s = meetLesson(s, 'entryFees', prize - race.entryFee);
  const wasInsured = s.insured;
  s = collectOverdue(s);
  s = payLoan(s);
  if (wasInsured) s = payOrMiss(s, 'insurance', INSURANCE.premium);
  if (rentDueAfter(s, s.raceIndex + 1)) s = payOrMiss(s, 'rent', RENT.amount);
  s = scriptedBill(s, wasInsured);
  s = sponsorAndFriend(s, results.position);
  s = closeLoanIfDone(settleStrikes(s));
  s = growth(s);
  s = { ...logRace(s, race, results), raceIndex: s.raceIndex + 1, nextRace: null };
  return drawEvent(s);
}
