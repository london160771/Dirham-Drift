import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { SETTING_DEFAULTS, SIZE_STEPS } from '../../src/game/config/settings.js';
import { applySettings } from '../../src/ui/applySettings.js';
import { CreditsScreen } from '../../src/ui/screens/CreditsScreen.jsx';
import { HowToPlay } from '../../src/ui/screens/HowToPlay.jsx';
import { HOW_TO_CARDS, HOW_TO_SECTIONS } from '../../src/ui/screens/howToPlayCards.js';
import { SettingsScreen } from '../../src/ui/screens/SettingsScreen.jsx';
import { loadSettings } from '../../src/ui/storage/settingsStore.js';

const TOGGLES = ['steeringAssist', 'autoAccelerate', 'chillMode', 'colorBlind', 'reduceMotion', 'leftHanded', 'vibration', 'showFps'];

beforeEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe('settings (FR-A11Y-001)', () => {
  it('start from the documented defaults: auto-accelerate off, vibration on', () => {
    expect(loadSettings()).toEqual(SETTING_DEFAULTS);
    expect(SETTING_DEFAULTS.autoAccelerate).toBe(false);
  });

  it('every toggle works and persists after a reload', () => {
    render(<SettingsScreen onBack={() => {}} />);
    for (const id of TOGGLES) fireEvent.click(screen.getByTestId(`toggle-${id}`));
    const saved = loadSettings();
    for (const id of TOGGLES) expect(saved[id]).toBe(!SETTING_DEFAULTS[id]);
    cleanup();
    render(<SettingsScreen onBack={() => {}} />);
    expect(screen.getByTestId('toggle-chillMode').getAttribute('aria-pressed')).toBe('true');
  });

  it('text size, control size and volumes persist and apply to the page', () => {
    render(<SettingsScreen onBack={() => {}} />);
    fireEvent.click(screen.getByTestId('textSize-L'));
    fireEvent.click(screen.getByTestId('controlSize-S'));
    fireEvent.change(screen.getByTestId('range-musicVolume'), { target: { value: '0' } });
    fireEvent.change(screen.getByTestId('range-effectsVolume'), { target: { value: '30' } });
    const saved = loadSettings();
    expect(saved).toMatchObject({ textSize: 'L', controlSize: 'S', musicVolume: 0, effectsVolume: 30 });
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--text-scale')).toBe(String(SIZE_STEPS.textSize.L));
    expect(root.style.getPropertyValue('--control-scale')).toBe(String(SIZE_STEPS.controlSize.S));
  });

  it('flags become page classes for colour-blind, reduce motion and left-handed', () => {
    const root = document.createElement('div');
    applySettings({ ...SETTING_DEFAULTS, colorBlind: true, leftHanded: true }, root);
    expect(root.classList.contains('cb-safe')).toBe(true);
    expect(root.classList.contains('left-handed')).toBe(true);
    expect(root.classList.contains('reduce-motion')).toBe(false);
  });

  it('resetting hints brings back the first-race and Pit Hub tips', () => {
    window.localStorage.setItem('dirham-drift:settings', JSON.stringify({ hintsSeen: true, pitTipsSeen: true }));
    render(<SettingsScreen onBack={() => {}} />);
    fireEvent.click(screen.getByTestId('reset-hints'));
    expect(loadSettings()).toMatchObject({ hintsSeen: false, pitTipsSeen: false });
  });
});

describe('How to Play and credits (FR-UI-002)', () => {
  it('has controls, the loop, one card per money system, modes and tips, plus the simplified note', () => {
    render(<HowToPlay onBack={() => {}} />);
    for (const section of HOW_TO_SECTIONS) {
      fireEvent.click(screen.getByTestId(`how-${section}`));
      for (const card of HOW_TO_CARDS[section]) expect(screen.getByTestId(`how-card-${card.id}`).textContent).not.toMatch(/\{\w+\}/);
    }
    expect(HOW_TO_CARDS.money.map((c) => c.id)).toEqual(['loan', 'repo', 'insurance', 'savings', 'fund', 'scam', 'fees']);
    expect(screen.getByText('Numbers are simplified. Not financial advice.')).toBeTruthy();
  });

  it('credits every library, sound pack and AI tool with its licence', () => {
    render(<CreditsScreen onBack={() => {}} />);
    expect(screen.getByTestId('credits-sound').textContent).toContain('CC0');
    expect(screen.getByTestId('credits-libraries').textContent).toContain('MIT');
    expect(screen.getByTestId('credits-ai').textContent).toContain('Claude');
  });
});
