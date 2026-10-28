import { RACE } from '../config/race.js';
import { afterRace, closeLoanIfDone } from './afterRace.js';
import { deposit, investFund, sellFund, setInsurance, withdraw } from './bank.js';
import { resolveEvent } from './events.js';
import { buyUpgrade } from './garage.js';
import { record } from './ledger.js';
import { dismissLesson, openStop } from './lessons.js';
import { takeLoan } from './loans.js';
import { EngineError } from './money.js';
import { repair } from './repair.js';
import { closeScam } from './scam.js';
import { availableRaces, isSeasonOver } from './season.js';

const ALLOWED = {
  PIT_HUB: ['buyUpgrade', 'takeLoan', 'deposit', 'withdraw', 'setInsurance', 'investFund', 'sellFund', 'repair', 'dismissLesson', 'chooseRace'],
  PRE_RACE: ['startRace', 'cancelRace'],
  RACING: ['finishRace'],
  RESULTS: ['repair', 'continue'],
  EVENT: ['chooseEvent'],
  RECAP: [],
};

function enterPitHub(state) {
  if (isSeasonOver(state)) return openStop(closeScam({ ...state, phase: 'RECAP' }));
  return openStop({ ...state, phase: 'PIT_HUB' });
}

function chooseRace(state, kind) {
  const race = availableRaces(state).find((r) => r.kind === kind);
  if (!race) throw new EngineError('bad_race', `No ${kind} race available`);
  if (!race.allowed) throw new EngineError('cannot_afford', `Entry fee is ${race.entryFee}`);
  const { allowed: _allowed, ...nextRace } = race;
  return { ...state, phase: 'PRE_RACE', nextRace };
}

function startRace(state) {
  const fee = state.nextRace.entryFee;
  if (state.cash < fee) throw new EngineError('cannot_afford', `Entry fee is ${fee}`);
  const paid = fee > 0 ? record(state, { kind: 'entryFee', cash: -fee }) : state;
  return { ...paid, phase: 'RACING' };
}

const HANDLERS = {
  buyUpgrade: (s, a) => buyUpgrade(s, a.slot),
  takeLoan: (s, a) => takeLoan(s, a.loanId),
  deposit: (s, a) => deposit(s, a.amount),
  withdraw: (s, a) => withdraw(s, a.amount),
  setInsurance: (s, a) => setInsurance(s, a.on),
  investFund: (s, a) => investFund(s, a.amount),
  sellFund: (s, a) => sellFund(s, a.amount),
  repair: (s) => repair(s),
  dismissLesson: (s) => dismissLesson(s),
  chooseRace: (s, a) => chooseRace(s, a.kind),
  startRace: (s) => startRace(s),
  cancelRace: (s) => ({ ...s, phase: 'PIT_HUB', nextRace: null }),
  finishRace: (s, a) => ({ ...afterRace(s, a.results, RACE.carCount), phase: 'RESULTS' }),
  continue: (s) => (s.pendingEvent ? { ...s, phase: 'EVENT' } : enterPitHub(s)),
  chooseEvent: (s, a) => enterPitHub(closeLoanIfDone(resolveEvent(s, a.choiceId))),
};

export function canApply(state, type) {
  return (ALLOWED[state.phase] || []).includes(type);
}

export function applyAction(state, action) {
  if (!canApply(state, action.type)) throw new EngineError('illegal_transition', `${action.type} is not allowed in ${state.phase}`);
  return HANDLERS[action.type](state, action);
}
