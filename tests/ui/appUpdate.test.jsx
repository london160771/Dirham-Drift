import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../../src/App.jsx';
import { EN } from '../../src/i18n/en.js';
import { PWA_RULES } from '../../src/game/config/app.js';
import { setUpdateReady, showsUpdateBar, watchForUpdates } from '../../src/ui/pwa/appUpdate.js';

vi.mock('../../src/ui/race/RaceScreen.jsx', () => ({ RaceScreen: () => <div data-testid="fake-race" /> }));

describe('new version bar', () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    setUpdateReady(null);
  });

  afterEach(() => setUpdateReady(null));

  it('stays hidden until a new version is ready', () => {
    render(<App />);
    expect(screen.queryByTestId('update-bar')).toBeNull();
  });

  it('shows on the title once ready and applies the update on tap', () => {
    const apply = vi.fn();
    render(<App />);
    act(() => setUpdateReady(apply));
    const bar = screen.getByTestId('update-bar');
    expect(bar.textContent).toBe(EN.title.update);
    fireEvent.click(bar);
    expect(apply).toHaveBeenCalledOnce();
  });

  it('shows on menus only, never in a race, season or ghost run', () => {
    for (const name of ['title', 'modes', 'tracks', 'results', 'settings']) expect(showsUpdateBar(name)).toBe(true);
    for (const name of ['race', 'season', 'ghost']) expect(showsUpdateBar(name)).toBe(false);
  });

  it('hides when a quick race starts', () => {
    render(<App />);
    act(() => setUpdateReady(vi.fn()));
    fireEvent.click(screen.getByTestId('play'));
    expect(screen.getByTestId('update-bar')).toBeTruthy();
    fireEvent.click(screen.getByTestId('mode-quickRace'));
    fireEvent.click(screen.getAllByTestId(/^track-/)[0]);
    expect(screen.getByTestId('fake-race')).toBeTruthy();
    expect(screen.queryByTestId('update-bar')).toBeNull();
  });
});

describe('update checks', () => {
  function fakes(onLine = true) {
    const registration = { update: vi.fn(() => Promise.resolve()) };
    const doc = new EventTarget();
    doc.visibilityState = 'hidden';
    const win = { navigator: { onLine }, setInterval: vi.fn() };
    watchForUpdates(registration, { win, doc });
    return { registration, doc, win };
  }

  it('checks on a timer and when the app comes back to the screen', () => {
    const { registration, doc, win } = fakes();
    const [check, ms] = win.setInterval.mock.calls[0];
    expect(ms).toBe(PWA_RULES.updateCheckMinutes * 60 * 1000);
    check();
    expect(registration.update).toHaveBeenCalledTimes(1);
    doc.dispatchEvent(new Event('visibilitychange'));
    expect(registration.update).toHaveBeenCalledTimes(1);
    doc.visibilityState = 'visible';
    doc.dispatchEvent(new Event('visibilitychange'));
    expect(registration.update).toHaveBeenCalledTimes(2);
  });

  it('skips the check while offline', () => {
    const { registration, win } = fakes(false);
    win.setInterval.mock.calls[0][0]();
    expect(registration.update).not.toHaveBeenCalled();
  });
});
