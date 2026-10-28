import { fireEvent, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { LOANS, UPGRADES } from '../../src/game/config/economy.js';
import { click, closeLessons, nextResults, races, startSeason, text } from './seasonHarness.jsx';

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => null;
});

function aed(amount) {
  return `AED ${amount.toLocaleString('en-US')}`;
}

describe('Pit Hub ↔ engine', () => {
  it('buying an upgrade takes the cash and changes the next race car stats and look', () => {
    startSeason('career');
    click('tab-garage');
    click('buy-engine');
    expect(text('cash')).toBe(aed(5000 - UPGRADES.prices[0]));
    expect(screen.getByTestId('slot-engine').querySelectorAll('.pips i.on')).toHaveLength(1);
    click('tab-home');
    click('enter-stage');
    click('start-race');
    const base = races.length;
    expect(base).toBe(1);
    const { setup } = races[0];
    expect(setup.looks).toEqual({ engine: 1, tyres: 0, nitro: 0 });
    expect(setup.race.player.topSpeed).toBeGreaterThan(setup.race.rivals[0].topSpeed / setup.race.rivalPace);
  });

  it('a loan shows its total before accepting, adds the cash, and is repaid after the race', () => {
    startSeason('career');
    click('tab-bank');
    const quick = LOANS.quick;
    expect(text('total-quick')).toBe(aed(quick.perRace * quick.races));
    click('take-quick');
    expect(text('cash')).toBe(aed(5000 + quick.borrow));
    expect(text('active-loan')).toContain(aed(quick.perRace * quick.races));
    expect(screen.getByTestId('take-big').disabled).toBe(true);
    click('tab-home');
    click('enter-stage');
    click('start-race');
    expect(races[0].money).toEqual({ cash: 5000 + quick.borrow, loanLeft: quick.perRace * quick.races });
    nextResults.position = 1;
    fireEvent.click(screen.getByText('finish'));
    expect(text('line-prize')).toContain('3,000');
    expect(text('line-loanPayment')).toContain(`− AED ${quick.perRace}`);
  });

  it('missed payments repossess the newest upgrade, remove its look and show a Pit Lesson', () => {
    startSeason('quick');
    fireEvent.click(screen.getByText('finish'));
    click('continue');
    closeLessons();
    click('tab-bank');
    click('take-big');
    click('tab-garage');
    for (const slot of ['engine', 'tyres', 'nitro', 'tyres']) click(`buy-${slot}`);
    expect(screen.getByTestId('slot-tyres').querySelectorAll('.pips i.on')).toHaveLength(2);
    click('tab-home');
    click('enter-stage');
    click('start-race');
    fireEvent.click(screen.getByText('finish'));
    expect(screen.getByTestId('line-rentMissed')).toBeTruthy();
    expect(screen.getByTestId('line-repossessed').textContent).toContain('Tyres');
    click('continue');
    click('choice-walkAway');
    expect(screen.getByTestId('pit-lesson')).toBeTruthy();
    closeLessons();
    click('tab-lessons');
    expect(text('lesson-book')).toContain('✓ Missed payments');
    click('tab-garage');
    expect(screen.getByTestId('slot-tyres').querySelectorAll('.pips i.on')).toHaveLength(1);
    click('tab-home');
    click('enter-club');
    click('start-race');
    expect(races.at(-1).setup.looks).toEqual({ engine: 2, tyres: 1, nitro: 1 });
  });

  it('quitting a race retires the player in last place with no prize', () => {
    startSeason('career');
    click('enter-stage');
    click('start-race');
    fireEvent.click(screen.getByText('quit'));
    expect(screen.getByTestId('statement').textContent).toContain('Retired');
    expect(text('line-prize')).toContain('AED 0');
  });

  it('the bank always shows the simplified-numbers note', () => {
    startSeason('career');
    click('tab-bank');
    expect(screen.getByTestId('bank').textContent).toContain('Numbers are simplified. Not financial advice.');
  });

  it('glossary words open a plain explanation', () => {
    startSeason('career');
    click('tab-bank');
    click('term-repossess');
    expect(text('glossary')).toContain('takes back');
  });

  it('first visit shows three tips once', () => {
    startSeason('career', { tipsSeen: false });
    expect(screen.getByTestId('pit-tips').querySelectorAll('li')).toHaveLength(3);
    click('tips-ok');
    expect(screen.queryByTestId('pit-tips')).toBeNull();
    startSeason('career', { tipsSeen: null });
    expect(screen.queryByTestId('pit-tips')).toBeNull();
  });
});
