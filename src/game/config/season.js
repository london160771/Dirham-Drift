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
    scamOfferAfterRace: [3, 4],
    rentEveryRaces: true,
    randomEvents: true,
  },
  quick: {
    strikesMode: 'quick',
    races: [
      { stage: 'rookie', track: 'marina' },
      { stage: 'rookie', track: 'marina' },
      { stage: 'final', track: 'sheikhZayed' },
    ],
    scamOfferAfterRace: [],
    rentEveryRaces: false,
    randomEvents: false,
  },
};

export const CLUB_RACE = {
  stage: 'rookie',
};
