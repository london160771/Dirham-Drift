import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from '../../src/App.jsx';
import { AR } from '../../src/i18n/ar.js';
import { applyLanguage } from '../../src/ui/applyLanguage.js';
import { loadSettings } from '../../src/ui/storage/settingsStore.js';

beforeEach(() => {
  cleanup();
  window.localStorage.clear();
  applyLanguage('en');
});

afterEach(() => applyLanguage('en'));

describe('Arabic toggle (FR-I18N-002)', () => {
  it('flips menus right-to-left, shows Arabic text and remembers the choice', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('language-toggle'));
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    expect(screen.getByTestId('play').textContent).toBe(AR.title.play);
    expect(loadSettings().language).toBe('ar');
    fireEvent.click(screen.getByTestId('open-settings'));
    expect(screen.getByTestId('settings').textContent).toContain(AR.settings.title);
    fireEvent.click(screen.getByTestId('language-toggle'));
    expect(document.documentElement.dir).toBe('ltr');
    expect(loadSettings().language).toBe('en');
  });

  it('hides the install button where the PWA is off', () => {
    render(<App />);
    expect(screen.queryByTestId('open-install')).toBeNull();
  });
});
