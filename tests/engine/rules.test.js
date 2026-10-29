import { describe, expect, it } from 'vitest';
import { EVENTS, INSURANCE, LATE_PAYMENT, LOANS, PRIZES, RENT, UPGRADES } from '../../src/game/config/economy.js';
import { carStats, carValue, createSeason, loanOffer, netWorth, percentOf, prizeTable } from '../../src/game/engine/index.js';
import { act, career, race, raceAndReturn, toHub } from './helpers.js';

const kinds = (s) => s.ledger.map((l) => l.kind);

describe('rounding (INV-1)', () => {
  it('percentages round down in magnitude', () => {
    expect(percentOf(199, 1)).toBe(1);
    expect(percentOf(1050, -6)).toBe(-63);
    expect(percentOf(999, 9)).toBe(89);
    expect(Object.is(percentOf(10, 0), 0)).toBe(true);
  });
});

describe('payment order after a race', () => {
  it('prize comes in before the loan repayment, so a win covers it', () => {
    let s = act(career(), 'takeLoan', { loanId: 'quick' });
    s = act(s, 'deposit', { amount: s.cash });
    s = race(s, { position: 1 });
    const order = kinds(s).slice(-3);
    expect(order[0]).toBe('prize');
    expect(order).toContain('loanPayment');
    expect(s.strikes).toBe(0);
    expect(s.cash).toBe(PRIZES.normal[0] - LOANS.quick.perRace);
  });

  it('runs prize → loan → insurance → rent in that order', () => {
    let s = act(act(career(), 'takeLoan', { loanId: 'quick' }), 'setInsurance', { on: true });
    for (let i = 0; i < 3; i += 1) s = raceAndReturn(s, { position: 2 });
    s = race(s, { position: 2 });
    const last = s.ledger.filter((l) => l.race === 3).map((l) => l.kind);
    expect(last.slice(0, 4)).toEqual(['prize', 'loanPayment', 'insurance', 'rent']);
  });

  it('a missed payment adds the late fee to what is owed and carries over', () => {
    let s = act(career(), 'takeLoan', { loanId: 'quick' });
    s = act(s, 'buyUpgrade', { slot: 'engine' });
    s = act(s, 'buyUpgrade', { slot: 'engine' });
    s = act(s, 'buyUpgrade', { slot: 'tyres' });
    s = raceAndReturn(s, { position: 5 });
    expect(s.cash).toBeLessThan(LOANS.quick.perRace);
    s = race(s, { position: 5 });
    expect(s.overdue).toBe(LOANS.quick.perRace + LATE_PAYMENT.fee);
    expect(s.strikes).toBe(1);
    s = raceAndReturn(toHub(s), { position: 1 });
    expect(s.overdue).toBe(0);
  });

  it('only one strike per stop even when several payments are missed', () => {
    let s = act(act(career(), 'takeLoan', { loanId: 'big' }), 'setInsurance', { on: true });
    s = { ...s, raceIndex: 3, cash: 0, ledger: [], startingCash: 0 };
    s = race(s, { position: 5 });
    expect(kinds(s).filter((k) => k.endsWith('Missed'))).toEqual(['loanPaymentMissed', 'insuranceMissed', 'rentMissed']);
    expect(s.strikes).toBe(1);
    expect(s.overdue).toBe(LOANS.big.perRace + INSURANCE.premium + RENT.amount + LATE_PAYMENT.fee);
  });
});

describe('loans', () => {
  it('allows one loan at a time', () => {
    const s = act(career(), 'takeLoan', { loanId: 'quick' });
    expect(() => act(s, 'takeLoan', { loanId: 'big' })).toThrow(/one loan/i);
  });

  it('clears the loan and resets strikes once fully repaid', () => {
    let s = act(createSeason({ mode: 'career', seed: 3 }), 'takeLoan', { loanId: 'quick' });
    s = { ...s, strikes: 1 };
    for (let i = 0; i < LOANS.quick.races; i += 1) s = raceAndReturn(s, { position: 1, kind: 'club' });
    expect(s.loan).toBeNull();
    expect(s.strikes).toBe(0);
    expect(s.lessonsMet).toContain('totalCostOfLoan');
    const paid = s.ledger.filter((l) => l.kind === 'loanPayment').reduce((a, l) => a - l.cash, 0);
    expect(paid).toBe(7000);
  });

  it('interest-free loan costs exactly its fixed fee (FR-MON-011)', () => {
    const free = LOANS.interestFree;
    const offer = loanOffer('interestFree');
    expect(offer.total).toBe(free.borrow + free.fixedFee);
    expect(offer.cost).toBe(free.fixedFee);
    let s = act(createSeason({ mode: 'career', seed: 3 }), 'takeLoan', { loanId: 'interestFree' });
    for (let i = 0; i < free.races; i += 1) s = raceAndReturn(s, { position: 1, kind: 'club' });
    expect(s.loan).toBeNull();
    const paid = s.ledger.filter((l) => l.kind === 'loanPayment').reduce((a, l) => a - l.cash, 0);
    expect(paid).toBe(free.borrow + free.fixedFee);
  });
});

describe('garage and repossession (INV-6)', () => {
  it('upgrades go up one level at a time at the configured prices', () => {
    let s = { ...career(), cash: 20000 };
    for (const price of UPGRADES.prices) {
      const before = s.cash;
      s = act(s, 'buyUpgrade', { slot: 'engine' });
      expect(before - s.cash).toBe(price);
    }
    expect(carStats(s).engine).toBe(3);
    expect(() => act(s, 'buyUpgrade', { slot: 'engine' })).toThrow();
    expect(carValue(s)).toBe((2500 + 5000 + 9000) / 2);
  });

  it('repossession removes the newest upgrade and its stats', () => {
    let s = { ...career(), mode: 'quick', strikesMode: 'quick', cash: 2500 + 2500 };
    s = act(s, 'buyUpgrade', { slot: 'engine' });
    s = act(s, 'buyUpgrade', { slot: 'nitro' });
    s = act(s, 'takeLoan', { loanId: 'quick' });
    s = act(s, 'deposit', { amount: s.cash });
    s = act(s, 'withdraw', { amount: s.savings });
    s = { ...s, cash: 0 };
    s = race(s, { position: 5 });
    expect(carStats(s)).toEqual({ engine: 1, tyres: 0, nitro: 0, damage: 0 });
    expect(s.lastRepo.slot).toBe('nitro');
  });

  it('cannot buy what you cannot afford', () => {
    expect(() => act({ ...career(), cash: 100 }, 'buyUpgrade', { slot: 'tyres' })).toThrow(/costs/);
  });
});

describe('insurance, damage and repair', () => {
  it('charges the premium after each insured race only', () => {
    let s = act(career(), 'setInsurance', { on: true });
    s = raceAndReturn(s, { position: 5 });
    expect(kinds(s)).toContain('insurance');
    s = act(s, 'setInsurance', { on: false });
    const count = kinds(s).filter((k) => k === 'insurance').length;
    s = raceAndReturn(s, { position: 5 });
    expect(kinds(s).filter((k) => k === 'insurance').length).toBe(count);
    expect(INSURANCE.premium).toBe(250);
  });

  it('insurance taken after an uninsured crash does not cover it', () => {
    let s = race(career(), { position: 5, damage: 50 });
    s = act(toHub(s), 'setInsurance', { on: true });
    s = raceAndReturn(s, { position: 5, damage: 50 });
    const before = s.cash;
    s = act(s, 'repair');
    expect(before - s.cash).toBe(1000 + 50 * 30);
  });

  it('unrepaired damage carries into the next race', () => {
    const s = raceAndReturn(career(), { position: 3, damage: 40 });
    expect(carStats(s).damage).toBe(40);
  });
});

describe('savings and index fund', () => {
  it('savings grow 1% per race, rounded down', () => {
    const s = race(act(career(), 'deposit', { amount: 4999 }), { position: 5 });
    expect(s.savings).toBe(4999 + 49);
  });

  it('the fund moves after every race within -6%..+9% and can go down', () => {
    let sawDrop = false;
    for (let seed = 1; seed < 40; seed += 1) {
      let s = act(career(seed), 'investFund', { amount: 4000 });
      for (let i = 0; i < 3; i += 1) {
        const before = s.fundValue;
        s = raceAndReturn(s, { position: 5, kind: 'club' });
        const move = s.ledger.filter((l) => l.kind === 'fundMove').at(-1);
        expect(move.percent).toBeGreaterThanOrEqual(-6);
        expect(move.percent).toBeLessThanOrEqual(9);
        expect(s.fundValue).toBe(before + percentOf(before, move.percent));
        if (move.fund < 0) sawDrop = true;
      }
    }
    expect(sawDrop).toBe(true);
  });
});

describe('events', () => {
  const at = (eventId, extra = {}) => act({ ...race(career(), { position: 3 }), pendingEvent: eventId, ...extra }, 'continue');

  it('puncture is a bill', () => {
    const s = at('puncture');
    expect(act(s, 'chooseEvent', { choiceId: 'pay' }).cash).toBe(s.cash - EVENTS.puncture);
  });

  it('fake bank text: ignoring is safe, clicking loses money and teaches phishing', () => {
    const s = at('fakeBankText');
    expect(act(s, 'chooseEvent', { choiceId: 'ignore' }).cash).toBe(s.cash);
    const clicked = act(s, 'chooseEvent', { choiceId: 'click' });
    expect(clicked.cash).toBe(s.cash - EVENTS.phishingLoss);
    expect(clicked.lessonsMet).toContain('phishing');
  });

  it('sponsor deal pays now and charges a penalty outside the top 3', () => {
    const s = act(at('sponsorDeal'), 'chooseEvent', { choiceId: 'accept' });
    const penalised = race(s, { position: 4 });
    expect(kinds(penalised)).toContain('sponsorPenalty');
    expect(kinds(race(s, { position: 3 }))).not.toContain('sponsorPenalty');
  });

  it('a friend may or may not repay, and the lesson is met either way', () => {
    const outcomes = new Set();
    for (let seed = 1; seed < 30; seed += 1) {
      let s = { ...race(career(seed), { position: 3 }), pendingEvent: 'friendBorrow' };
      s = act(act(s, 'continue'), 'chooseEvent', { choiceId: 'lend' });
      s = race(s, { position: 3 });
      outcomes.add(kinds(s).includes('friendRepaid'));
      expect(s.lessonsMet).toContain('lendingToFriends');
    }
    expect(outcomes).toEqual(new Set([true, false]));
  });

  it('bonus prize adds cash', () => {
    const s = at('bonusPrize');
    expect(act(s, 'chooseEvent', { choiceId: 'collect' }).cash).toBe(s.cash + EVENTS.bonusPrize);
  });
});

describe('career anchors and prizes', () => {
  it('garage rent is due every 4 races', () => {
    let s = career();
    const rentRaces = [];
    for (let i = 0; i < 10; i += 1) {
      s = raceAndReturn(s, { position: 1, kind: 'club' });
      if (s.ledger.some((l) => l.kind === 'rent' && l.race === i)) rentRaces.push(i + 1);
    }
    expect(rentRaces).toEqual([4, 8]);
    expect(RENT.amount).toBe(1500);
  });

  it('the scam offer appears once, after race 3 or 4', () => {
    for (let seed = 1; seed < 25; seed += 1) {
      let s = career(seed);
      const offers = [];
      for (let i = 0; i < 10; i += 1) {
        s = race(s, { position: 1, kind: 'club', keepEvent: true });
        if (s.pendingEvent === 'desertGold') offers.push(i + 1);
        s = act(s, 'continue');
        if (s.phase === 'EVENT') s = act(s, 'chooseEvent', { choiceId: s.pendingEvent === 'desertGold' ? 'walkAway' : neutral(s.pendingEvent) });
      }
      expect(offers.length).toBe(1);
      expect([3, 4]).toContain(offers[0]);
    }
  });

  it('Grand Final win pays AED 15,000 and Club Races pay half', () => {
    expect(prizeTable('final', 'stage')[0]).toBe(15000);
    expect(prizeTable('rookie', 'club')).toEqual([1500, 900, 500, 200, 0]);
  });

  it('entry fees are paid when the race starts', () => {
    const s = act(act({ ...career(), raceIndex: 4 }, 'chooseRace', { kind: 'stage' }), 'startRace');
    expect(s.cash).toBe(5000 - 1000);
    expect(kinds(s)).toEqual(['entryFee']);
  });
});

describe('net worth (FR-MON-010)', () => {
  it('= cash + savings + fund + car value − loan owed − overdue', () => {
    let s = act(career(), 'takeLoan', { loanId: 'quick' });
    s = act(s, 'buyUpgrade', { slot: 'engine' });
    s = act(s, 'deposit', { amount: 1000 });
    s = act(s, 'investFund', { amount: 1000 });
    s = { ...s, overdue: 300 };
    expect(netWorth(s)).toBe(s.cash + 1000 + 1000 + 1250 - 7000 - 300);
  });
});

function neutral(eventId) {
  return { puncture: 'pay', fakeBankText: 'ignore', friendBorrow: 'refuse', sponsorDeal: 'decline', bonusPrize: 'collect' }[eventId];
}
