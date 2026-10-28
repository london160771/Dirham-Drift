import { describe, expect, it } from 'vitest';
import { applyAction, createSeason, eventChoices } from '../../src/game/engine/index.js';
import { act, career, race } from './helpers.js';

const MONEY_ACTIONS = [
  { type: 'buyUpgrade', slot: 'engine' },
  { type: 'takeLoan', loanId: 'quick' },
  { type: 'deposit', amount: 100 },
  { type: 'withdraw', amount: 100 },
  { type: 'setInsurance', on: true },
  { type: 'investFund', amount: 100 },
  { type: 'sellFund', amount: 100 },
  { type: 'repair' },
];

describe('season state machine', () => {
  it('follows PIT_HUB → PRE_RACE → RACING → RESULTS → EVENT? → PIT_HUB', () => {
    let s = career();
    expect(s.phase).toBe('PIT_HUB');
    s = act(s, 'chooseRace', { kind: 'stage' });
    expect(s.phase).toBe('PRE_RACE');
    s = act(s, 'startRace');
    expect(s.phase).toBe('RACING');
    s = race({ ...career(), pendingEvent: null }, { keepEvent: true });
    expect(s.phase).toBe('RESULTS');
    s = act({ ...s, pendingEvent: 'bonusPrize' }, 'continue');
    expect(s.phase).toBe('EVENT');
    s = act(s, 'chooseEvent', { choiceId: 'collect' });
    expect(s.phase).toBe('PIT_HUB');
  });

  it('throws on illegal transitions', () => {
    const s = career();
    expect(() => act(s, 'startRace')).toThrow(/not allowed/);
    expect(() => act(s, 'finishRace', { results: {} })).toThrow(/not allowed/);
    expect(() => act(s, 'continue')).toThrow(/not allowed/);
    expect(() => act(s, 'chooseEvent', { choiceId: 'pay' })).toThrow(/not allowed/);
    expect(() => applyAction(s, { type: 'teleport' })).toThrow(/not allowed/);
  });

  it('allows no money changes during a race (INV-8)', () => {
    const racing = act(act(career(), 'chooseRace', { kind: 'stage' }), 'startRace');
    for (const action of MONEY_ACTIONS) expect(() => applyAction(racing, action)).toThrow(/not allowed in RACING/);
  });

  it('can back out of the pre-race card', () => {
    const s = act(act(career(), 'chooseRace', { kind: 'stage' }), 'cancelRace');
    expect(s.phase).toBe('PIT_HUB');
    expect(s.nextRace).toBeNull();
  });

  it('ends in RECAP after the last race, and the recap takes no actions', () => {
    let s = createSeason({ mode: 'quick', seed: 4 });
    for (let i = 0; i < 3; i += 1) s = act(race(s, { position: 2 }), 'continue');
    expect(s.phase).toBe('RECAP');
    expect(() => act(s, 'chooseRace', { kind: 'club' })).toThrow();
  });

  it('collapses an active scam when the season ends', () => {
    let s = createSeason({ mode: 'quick', seed: 4 });
    s = act(race(s, { position: 1 }), 'continue');
    s = act(race(s, { position: 1, keepEvent: true }), 'continue');
    s = act({ ...s, phase: 'EVENT', pendingEvent: 'desertGold' }, 'chooseEvent', { choiceId: 'invest1000' });
    s = act(race(s, { position: 1 }), 'continue');
    expect(s.phase).toBe('RECAP');
    expect(s.scam.stage).toBe('collapsed');
    expect(s.lessonsMet).toContain('tooGoodToBeTrue');
  });

  it('rejects race results that are out of range', () => {
    const racing = act(act(career(), 'chooseRace', { kind: 'stage' }), 'startRace');
    expect(() => act(racing, 'finishRace', { results: { position: 6, damage: 0, timeMs: 1 } })).toThrow(/position/);
    expect(() => act(racing, 'finishRace', { results: { position: 1, damage: 12.5, timeMs: 1 } })).toThrow(/damage/);
  });

  it('shows every event choice with its cost before choosing (FR-EVT-001)', () => {
    for (const id of ['puncture', 'fakeBankText', 'friendBorrow', 'sponsorDeal', 'bonusPrize', 'desertGold']) {
      const choices = eventChoices(career(), id);
      expect(choices.length).toBeGreaterThan(0);
      for (const c of choices) expect(Number.isInteger(c.cash)).toBe(true);
    }
  });
});

describe('lessons (FR-LSN-001)', () => {
  it('shows at most one Pit Lesson per stop and only after the consequence', () => {
    let s = act(career(), 'takeLoan', { loanId: 'quick' });
    expect(s.pendingLesson).toBeNull();
    s = act(s, 'investFund', { amount: 1000 });
    s = act(race(s, { position: 5, damage: 30 }), 'repair');
    s = act(s, 'continue');
    expect(s.pendingLesson).not.toBeNull();
    expect(s.lessonQueue.length).toBeGreaterThan(0);
    const first = s.pendingLesson.id;
    s = act(s, 'dismissLesson');
    expect(s.pendingLesson).toBeNull();
    s = act(race(s, { position: 5 }), 'continue');
    expect(s.pendingLesson.id).not.toBe(first);
  });
});
