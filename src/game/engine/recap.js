import { GRADES, SAVER_PLAN } from '../config/season.js';
import { applyAction } from './machine.js';
import { carValue } from './garage.js';
import { eventChoices } from './events.js';
import { loanOwed } from './loans.js';
import { netWorth, isDebtFree } from './netWorth.js';
import { repairBill } from './repair.js';
import { availableRaces, createSeason } from './season.js';

export function seasonGrade(state) {
  const worth = netWorth(state);
  const thresholds = GRADES.netWorthAtLeast[state.mode];
  const earned = thresholds.findIndex((min) => worth >= min);
  const ladder = [...GRADES.letters, GRADES.fail];
  const index = earned === -1 ? ladder.length - 1 : earned;
  const dropped = isDebtFree(state) ? index : index + GRADES.inDebtDrop;
  return ladder[Math.min(dropped, ladder.length - 1)];
}

function saverPitStop(state, kind) {
  let s = state;
  while (s.pendingLesson) s = applyAction(s, { type: 'dismissLesson' });
  if (s.damage > 0 && s.cash + s.savings >= repairBill(s)) s = applyAction(s, { type: 'repair' });
  s = applyAction(s, { type: 'setInsurance', on: true });
  const race = availableRaces(s).find((r) => r.kind === kind);
  const fee = race && s.cash + s.savings >= race.entryFee ? race.entryFee : 0;
  if (s.cash < fee) s = applyAction(s, { type: 'withdraw', amount: fee - s.cash });
  if (s.cash > fee) s = applyAction(s, { type: 'deposit', amount: s.cash - fee });
  return { state: s, kind: fee === race?.entryFee ? kind : 'club' };
}

function saverEvent(state) {
  const choice = eventChoices(state, state.pendingEvent).find((c) => c.allowed && SAVER_PLAN.safeChoices.includes(c.id));
  return applyAction(state, { type: 'chooseEvent', choiceId: choice.id });
}

export function savedInstead(state) {
  let s = createSeason({ mode: state.mode, seed: state.seed });
  for (const entry of state.raceLog) {
    const stop = saverPitStop(s, entry.kind);
    s = applyAction(stop.state, { type: 'chooseRace', kind: stop.kind });
    s = applyAction(s, { type: 'startRace' });
    s = applyAction(s, { type: 'finishRace', results: { position: entry.position, damage: Math.max(entry.damage, s.damage), timeMs: 0 } });
    s = applyAction(s, { type: 'continue' });
    if (s.phase === 'EVENT') s = saverEvent(s);
  }
  return { netWorth: netWorth(s), debtFree: isDebtFree(s) };
}

export function recapSummary(state) {
  const worth = netWorth(state);
  const saver = savedInstead(state);
  return {
    netWorth: worth,
    cash: state.cash,
    savings: state.savings,
    fund: state.fundValue,
    carValue: carValue(state),
    owed: loanOwed(state) + state.overdue,
    debtFree: isDebtFree(state),
    grade: seasonGrade(state),
    lessonsMet: state.lessonsMet,
    wins: state.raceLog.filter((r) => r.position === 1).length,
    podiums: state.raceLog.filter((r) => r.position <= 3).length,
    races: state.raceLog.length,
    saver: { ...saver, difference: saver.netWorth - worth },
  };
}
