import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createInputState } from '../../src/game/race/input/inputState.js';
import { TouchControls } from '../../src/ui/race/TouchControls.jsx';
import { SettingsScreen } from '../../src/ui/screens/SettingsScreen.jsx';
import { loadSettings } from '../../src/ui/storage/settingsStore.js';

function asPhone(permission) {
  Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, configurable: true });
  window.DeviceOrientationEvent = permission ? { requestPermission: permission } : function DeviceOrientationEvent() {};
}

beforeEach(() => {
  cleanup();
  window.localStorage.clear();
});

afterEach(() => {
  Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });
  delete window.DeviceOrientationEvent;
});

describe('tilt steering setting', () => {
  it('is hidden on a computer', () => {
    render(<SettingsScreen onBack={() => {}} />);
    expect(screen.queryByTestId('toggle-tiltSteering')).toBeNull();
  });

  it('shows off on a phone and turns on and off', async () => {
    asPhone();
    render(<SettingsScreen onBack={() => {}} />);
    const toggle = screen.getByTestId('toggle-tiltSteering');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    await act(async () => fireEvent.click(toggle));
    expect(loadSettings().tiltSteering).toBe(true);
    await act(async () => fireEvent.click(screen.getByTestId('toggle-tiltSteering')));
    expect(loadSettings().tiltSteering).toBe(false);
  });

  it('stays off with a note when the phone says no', async () => {
    asPhone(vi.fn(() => Promise.resolve('denied')));
    render(<SettingsScreen onBack={() => {}} />);
    await act(async () => fireEvent.click(screen.getByTestId('toggle-tiltSteering')));
    expect(loadSettings().tiltSteering).toBe(false);
    expect(screen.getByText(/not allowed/)).toBeTruthy();
  });

  it('hides the steering buttons while tilt drives', () => {
    const input = createInputState();
    const { rerender } = render(<TouchControls input={input} hints={false} used={new Set()} />);
    expect(screen.getByTestId('steer-pad')).toBeTruthy();
    rerender(<TouchControls input={input} hints={false} used={new Set()} tilt />);
    expect(screen.queryByTestId('steer-pad')).toBeNull();
    expect(screen.getByTestId('btn-gas')).toBeTruthy();
  });
});
