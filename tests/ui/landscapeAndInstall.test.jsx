import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from '../../src/App.jsx';
import { EN } from '../../src/i18n/en.js';
import { TitleScreen } from '../../src/ui/screens/TitleScreen.jsx';
import { click, startSeason } from './seasonHarness.jsx';

function fakeMedia(active) {
  window.matchMedia = (query) => ({ matches: active.includes(query), media: query });
}

describe('portrait phone is blocked from the first screen (FR-CTL-003)', () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  afterEach(() => {
    delete window.matchMedia;
  });

  it('a touch phone in portrait sees the rotate screen on the title', () => {
    fakeMedia(['(pointer: coarse)', '(orientation: portrait)']);
    render(<App />);
    expect(screen.getByTestId('rotate').textContent).toContain(EN.rotate.title);
  });

  it('turning the phone to landscape removes the rotate screen', () => {
    fakeMedia(['(pointer: coarse)', '(orientation: portrait)']);
    render(<App />);
    fakeMedia(['(pointer: coarse)']);
    fireEvent(window, new Event('resize'));
    expect(screen.queryByTestId('rotate')).toBeNull();
    expect(screen.getByTestId('play')).toBeTruthy();
  });

  it('a desktop window in portrait is not blocked', () => {
    fakeMedia(['(orientation: portrait)']);
    render(<App />);
    expect(screen.queryByTestId('rotate')).toBeNull();
  });
});

describe('bank repossession warning wording', () => {
  it('Quick Season says one strike, not "1 strikes"', () => {
    startSeason('quick');
    fireEvent.click(screen.getByText('finish'));
    click('continue');
    click('tab-bank');
    const bank = screen.getByTestId('bank-loans').textContent;
    expect(bank).toContain('One strike and the bank will');
    expect(bank).not.toContain('1 strikes');
  });

  it('Career Season keeps the number of strikes', () => {
    startSeason('career');
    click('tab-bank');
    expect(screen.getByTestId('bank-loans').textContent).toContain('2 strikes and the bank will');
  });
});

describe('install note on the title screen', () => {
  const noop = () => {};

  it('shows the note where install works and opens the install guide', () => {
    cleanup();
    let opened = false;
    render(<TitleScreen onPlay={noop} onHowTo={noop} onSettings={noop} onCredits={noop} onLanguage={noop} onInstall={() => (opened = true)} installNote />);
    expect(screen.getByTestId('install-note').textContent).toBe(EN.title.installNote);
    click('install-note');
    expect(opened).toBe(true);
  });

  it('hides the note where install does not work, such as itch.io', () => {
    cleanup();
    render(<TitleScreen onPlay={noop} onHowTo={noop} onSettings={noop} onCredits={noop} onLanguage={noop} onInstall={null} installNote={false} />);
    expect(screen.queryByTestId('install-note')).toBeNull();
  });
});
