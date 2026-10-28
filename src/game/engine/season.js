import { ENTRY_FEES, PRIZES, RENT, START, UPGRADES } from '../config/economy.js';
import { CLUB_RACE, SEASONS } from '../config/season.js';
import { randomInt } from './rng.js';
import { EngineError } from './money.js';

export const STATE_VERSION = 2;

export function seasonPlan(mode) {
  const plan = SEASONS[mode];
  if (!plan) throw new EngineError('unknown_mode', `No season mode ${mode}`);
  return plan;
}

export function createSeason({ mode, seed }) {
  const plan = seasonPlan(mode);
  let rngSeed = seed | 0;
  let scamOfferAt = null;
  if (plan.scamOfferAfterRace.length > 0) {
    const roll = randomInt(rngSeed, 0, plan.scamOfferAfterRace.length - 1);
    rngSeed = roll.seed;
    scamOfferAt = plan.scamOfferAfterRace[roll.value];
  }
  const startCash = plan.startCash ?? START.cash;
  return {
    version: STATE_VERSION,
    mode,
    seed,
    rngSeed,
    strikesMode: plan.strikesMode,
    phase: 'PIT_HUB',
    raceIndex: 0,
    totalRaces: plan.races.length,
    startingCash: startCash,
    cash: startCash,
    savings: START.savings,
    fundValue: 0,
    overdue: 0,
    upgrades: plan.startUpgrades.map((slot) => ({ slot, level: 1, price: UPGRADES.prices[0], starter: true })),
    loan: null,
    strikes: 0,
    insured: false,
    damage: 0,
    damageInsured: false,
    scam: null,
    scamOfferAt,
    sponsor: false,
    friendLoan: 0,
    pendingEvent: null,
    eventsSeen: [],
    lessonsMet: [],
    lessonQueue: [],
    pendingLesson: null,
    missedThisStop: false,
    strikeThisStop: false,
    lastResults: null,
    lastRepo: null,
    nextRace: null,
    raceLog: [],
    ledger: [],
  };
}

export function prizeTable(stage, kind) {
  if (kind === 'club') return PRIZES.normal.map((p) => Math.floor(p / PRIZES.clubRaceDivisor));
  if (stage === 'final') return [PRIZES.grandFinalWin, ...PRIZES.normal.slice(1)];
  return [...PRIZES.normal];
}

export function raceInfo(state, kind = 'stage') {
  const slot = seasonPlan(state.mode).races[state.raceIndex];
  if (!slot) return null;
  const stage = kind === 'club' ? CLUB_RACE.stage : slot.stage;
  const entryFee = kind === 'club' ? ENTRY_FEES.club : (slot.entryFee ?? ENTRY_FEES[slot.stage]);
  return { index: state.raceIndex, kind, track: slot.track, stage, seasonStage: slot.stage, entryFee, prizes: prizeTable(slot.stage, kind) };
}

export function availableRaces(state) {
  const stage = raceInfo(state, 'stage');
  if (!stage) return [];
  const club = raceInfo(state, 'club');
  return [
    { ...stage, allowed: state.cash >= stage.entryFee },
    { ...club, allowed: true },
  ];
}

export function isSeasonOver(state) {
  return state.raceIndex >= state.totalRaces;
}

export function rentDueAfter(state, raceNumber) {
  const plan = seasonPlan(state.mode);
  if (plan.rentEveryRaces) return raceNumber % RENT.everyRaces === 0;
  return plan.rentAfterRaces.includes(raceNumber);
}

export function scriptedBillAfter(state, raceNumber) {
  return seasonPlan(state.mode).scriptedBills[raceNumber] || null;
}
