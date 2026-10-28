import { EVENTS, SCAM } from '../config/economy.js';
import { record } from './ledger.js';
import { meetLesson } from './lessons.js';
import { EngineError } from './money.js';
import { takeUpTo } from './payments.js';
import { investScam } from './scam.js';
import { payOrMiss, settleStrikes } from './strikes.js';

export const RANDOM_EVENTS = ['puncture', 'fakeBankText', 'friendBorrow', 'sponsorDeal', 'bonusPrize'];

const CHOICES = {
  puncture: () => [{ id: 'pay', cash: -EVENTS.puncture, required: true }],
  fakeBankText: () => [
    { id: 'ignore', cash: 0 },
    { id: 'click', cash: -EVENTS.phishingLoss },
  ],
  friendBorrow: (state) => [
    { id: 'lend', cash: -EVENTS.friendLoan, allowed: state.cash >= EVENTS.friendLoan },
    { id: 'refuse', cash: 0 },
  ],
  sponsorDeal: () => [
    { id: 'accept', cash: EVENTS.sponsorNow, risk: -EVENTS.sponsorPenalty },
    { id: 'decline', cash: 0 },
  ],
  bonusPrize: () => [{ id: 'collect', cash: EVENTS.bonusPrize }],
  desertGold: (state) => [
    ...SCAM.investOptions.map((amount) => ({ id: `invest${amount}`, cash: -amount, amount, allowed: state.cash >= amount })),
    { id: 'walkAway', cash: 0 },
  ],
};

export function eventChoices(state, eventId) {
  return CHOICES[eventId](state).map((choice) => ({ allowed: true, ...choice }));
}

const RESOLVERS = {
  pay: (state) => settleStrikes(payOrMiss(state, 'puncture', EVENTS.puncture)),
  ignore: (state) => state,
  click: (state) => meetLesson(takeUpTo(state, 'phishing', EVENTS.phishingLoss), 'phishing', EVENTS.phishingLoss),
  lend: (state) => ({ ...record(state, { kind: 'friendLoan', cash: -EVENTS.friendLoan }), friendLoan: EVENTS.friendLoan }),
  refuse: (state) => state,
  accept: (state) => ({ ...record(state, { kind: 'sponsorIn', cash: EVENTS.sponsorNow }), sponsor: true }),
  decline: (state) => state,
  collect: (state) => record(state, { kind: 'bonusPrize', cash: EVENTS.bonusPrize }),
  walkAway: (state) => state,
};

export function resolveEvent(state, choiceId) {
  const choice = eventChoices(state, state.pendingEvent).find((c) => c.id === choiceId);
  if (!choice) throw new EngineError('bad_choice', `${choiceId} is not a choice for ${state.pendingEvent}`);
  if (!choice.allowed) throw new EngineError('cannot_afford', `${choiceId} costs ${-choice.cash}`);
  const next = choice.amount ? investScam(state, choice.amount) : RESOLVERS[choiceId](state);
  return { ...next, pendingEvent: null, eventsSeen: [...next.eventsSeen, state.pendingEvent] };
}
