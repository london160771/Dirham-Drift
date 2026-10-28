export const START = {
  cash: 5000,
  savings: 0,
};

export const PRIZES = {
  normal: [3000, 1800, 1000, 400, 0],
  grandFinalWin: 15000,
  clubRaceDivisor: 2,
};

export const UPGRADES = {
  slots: ['engine', 'tyres', 'nitro'],
  maxLevel: 3,
  prices: [2500, 5000, 9000],
  carValuePercent: 50,
};

export const LOANS = {
  quick: { id: 'quick', borrow: 6000, perRace: 700, races: 10 },
  big: { id: 'big', borrow: 15000, perRace: 1500, races: 12 },
};

export const LATE_PAYMENT = {
  fee: 300,
  strikesToRepo: { career: 2, quick: 1 },
};

export const INSURANCE = {
  premium: 250,
  coversPercent: 80,
};

export const REPAIR = {
  base: 1000,
  perDamagePoint: 30,
};

export const SAVINGS = {
  growthPercent: 1,
};

export const INDEX_FUND = {
  minChangePercent: -6,
  maxChangePercent: 9,
};

export const SCAM = {
  payoutPercent: 30,
  investOptions: [1000, 3000],
};

export const RENT = {
  amount: 1500,
  everyRaces: 4,
};

export const ENTRY_FEES = {
  rookie: 0,
  pro: 1000,
  final: 3000,
  club: 0,
};

export const EVENTS = {
  chancePerStop: 50,
  puncture: 400,
  phishingLoss: 1000,
  friendLoan: 1000,
  friendRepaysPercent: 60,
  sponsorNow: 2000,
  sponsorPenalty: 1500,
  sponsorTopPosition: 3,
  bonusPrize: 500,
};
