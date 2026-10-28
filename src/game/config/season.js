export const SEASONS = {
  career: {
    strikesMode: 'career',
    races: [
      { stage: 'rookie', track: 'marina' },
      { stage: 'rookie', track: 'marina' },
      { stage: 'rookie', track: 'marina' },
      { stage: 'rookie', track: 'marina' },
      { stage: 'pro', track: 'marina' },
      { stage: 'pro', track: 'sheikhZayed' },
      { stage: 'pro', track: 'marina' },
      { stage: 'pro', track: 'sheikhZayed' },
      { stage: 'final', track: 'sheikhZayed' },
      { stage: 'final', track: 'sheikhZayed' },
    ],
    startUpgrades: [],
    scamOfferAfterRace: [3, 4],
    rentEveryRaces: true,
    rentAfterRaces: [],
    scriptedBills: {},
    randomEvents: true,
    autoStartFirstRace: false,
    saved: true,
  },
  quick: {
    strikesMode: 'quick',
    seed: 20261115,
    startCash: 1500,
    races: [
      { stage: 'rookie', track: 'marina' },
      { stage: 'rookie', track: 'marina' },
      { stage: 'final', track: 'sheikhZayed', entryFee: 0 },
    ],
    startUpgrades: ['engine'],
    scamOfferAfterRace: [2],
    rentEveryRaces: false,
    rentAfterRaces: [2],
    scriptedBills: { 2: { kind: 'crashBill', damage: 60 } },
    randomEvents: false,
    autoStartFirstRace: true,
    saved: false,
    turboOffer: { afterRace: 1, slot: 'engine' },
  },
};

export const CLUB_RACE = {
  stage: 'rookie',
};

export const GRADES = {
  letters: ['A', 'B', 'C', 'D'],
  fail: 'F',
  inDebtDrop: 1,
  netWorthAtLeast: {
    career: [35000, 22000, 12000, 5000],
    quick: [15000, 10000, 6000, 3000],
  },
};

export const SAVER_PLAN = {
  safeChoices: ['pay', 'ignore', 'refuse', 'decline', 'collect', 'walkAway'],
};
