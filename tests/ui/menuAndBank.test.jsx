import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { App } from '../../src/App.jsx';
import { BANK_CHIPS } from '../../src/game/config/economy.js';
import { EN } from '../../src/i18n/en.js';
import { click, startSeason, text } from './seasonHarness.jsx';

const START_CASH = 5000;

function aed(amount) {
  return `AED ${amount.toLocaleString('en-US')}`;
}

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => null;
});

describe('menu navigation', () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    window.localStorage.setItem('dirham-drift:settings', JSON.stringify({ pitTipsSeen: true }));
  });

  it('Back on the menu returns to the Pit Hub the player came from, with the same money', () => {
    render(<App />);
    click('play');
    click('mode-career');
    click('tab-garage');
    click('buy-engine');
    const cash = text('cash');
    click('pit-menu');
    click('menu-back');
    expect(screen.getByTestId('pit-hub')).toBeTruthy();
    expect(text('cash')).toBe(cash);
  });

  it('Home on the menu goes to the title screen', () => {
    render(<App />);
    click('play');
    click('mode-career');
    click('pit-menu');
    click('menu-home');
    expect(screen.getByTestId('play')).toBeTruthy();
  });

  it('Back on the menu goes to the title when it was opened from the title', () => {
    render(<App />);
    click('play');
    click('menu-back');
    expect(screen.getByTestId('play')).toBeTruthy();
  });
});

describe('bank amount inputs', () => {
  it('amount chips only set the amount; the Invest button invests it', () => {
    startSeason('career');
    click('tab-bank');
    const chip = BANK_CHIPS[0];
    fireEvent.click(screen.getByTestId('invest').querySelector('.chip'));
    expect(text('cash')).toBe(aed(START_CASH));
    expect(screen.getByTestId('invest-amount').value).toBe(chip.toLocaleString('en-US'));
    click('invest-go');
    expect(text('cash')).toBe(aed(START_CASH - chip));
    expect(screen.getByTestId('invest-amount').value).toBe('');
  });

  it('typed amounts keep whole dirhams and cannot exceed the cash', () => {
    startSeason('career');
    click('tab-bank');
    const input = screen.getByTestId('deposit-amount');
    fireEvent.change(input, { target: { value: '12a3.9' } });
    expect(input.value).toBe('1,239');
    fireEvent.change(input, { target: { value: String(START_CASH + 1) } });
    expect(screen.getByTestId('deposit-go').disabled).toBe(true);
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByTestId('deposit-go').disabled).toBe(true);
  });

  it('the insurance button says what tapping it does', () => {
    startSeason('career');
    click('tab-bank');
    expect(text('insurance-hint')).toBe(EN.bank.insuranceTapOn);
    click('toggle-insurance');
    expect(text('insurance-hint')).toBe(EN.bank.insuranceTapOff);
  });
});
