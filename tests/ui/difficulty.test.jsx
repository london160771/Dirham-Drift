import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { App } from '../../src/App.jsx';
import { DIFFICULTY } from '../../src/game/config/race.js';
import { modeCards } from '../../src/ui/screens/modes.js';
import { loadCareer } from '../../src/ui/storage/seasonStore.js';
import { loadSettings } from '../../src/ui/storage/settingsStore.js';
import { click, nextResults, races, startSeason, text } from './seasonHarness.jsx';

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => null;
});

describe('difficulty picker (FR-MODE-007)', () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    window.localStorage.setItem('dirham-drift:settings', JSON.stringify({ pitTipsSeen: true }));
  });

  it('starts on Easy, and the choice is remembered', () => {
    render(<App />);
    click('play');
    expect(screen.getByTestId('difficulty-easy').getAttribute('aria-checked')).toBe('true');
    click('difficulty-hard');
    expect(screen.getByTestId('difficulty-hard').getAttribute('aria-checked')).toBe('true');
    expect(loadSettings().difficulty).toBe('hard');
    cleanup();
    render(<App />);
    click('play');
    expect(screen.getByTestId('difficulty-hard').getAttribute('aria-checked')).toBe('true');
  });

  it('a new career saves its difficulty and Continue shows it', () => {
    render(<App />);
    click('play');
    click('difficulty-medium');
    click('mode-career');
    click('pit-menu');
    expect(loadCareer().difficulty).toBe('medium');
    expect(text('mode-continue')).toContain('Medium');
  });
});

describe('season races use the season difficulty', () => {
  it('Hard season races get Hard rivals and the pre-race card says so', () => {
    startSeason('career', { difficulty: 'hard' });
    click('enter-stage');
    expect(text('pre-race')).toContain('Hard');
    click('start-race');
    expect(races[0].setup.race.skill).toBe(DIFFICULTY.hard);
    nextResults.position = 1;
    fireEvent.click(screen.getByText('finish'));
    expect(loadCareer().difficulty).toBe('hard');
  });

  it('continuing a saved season keeps its difficulty, and old saves are Easy', () => {
    startSeason('career', { difficulty: 'hard' });
    const saved = loadCareer();
    expect(saved.difficulty).toBe('hard');
    expect(modeCards(saved).find((card) => card.id === 'continue').vars.level).toBe('Hard');
    const oldSave = { ...saved, difficulty: undefined };
    expect(modeCards(oldSave).find((card) => card.id === 'continue').vars.level).toBe('Easy');
  });
});
