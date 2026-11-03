import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../../src/App.jsx';
import { createSeason } from '../../src/game/engine/index.js';
import { EN } from '../../src/i18n/en.js';
import { PauseOverlay } from '../../src/ui/race/Overlays.jsx';
import { SeasonRace } from '../../src/ui/season/SeasonRace.jsx';

const mounts = [];

vi.mock('../../src/ui/race/RaceScreen.jsx', async () => {
  const { useState } = await import('react');
  return {
    RaceScreen: function FakeRace({ setup, onRestart }) {
      const [mount] = useState(() => {
        mounts.push(setup);
        return mounts.length;
      });
      return (
        <div data-testid="fake-race" data-mount={mount}>
          {onRestart && (
            <button type="button" data-testid="fake-restart" onClick={onRestart}>
              restart
            </button>
          )}
        </div>
      );
    },
  };
});

beforeEach(() => {
  cleanup();
  window.localStorage.clear();
  mounts.length = 0;
});

describe('restart race from the pause menu', () => {
  it('shows Restart only when the race allows it', () => {
    render(<PauseOverlay onResume={() => {}} onHowTo={() => {}} onQuit={() => {}} />);
    expect(screen.queryByTestId('pause-restart')).toBeNull();
    cleanup();
    const onRestart = vi.fn();
    render(<PauseOverlay onResume={() => {}} onRestart={onRestart} onHowTo={() => {}} onQuit={() => {}} />);
    const button = screen.getByTestId('pause-restart');
    expect(button.textContent).toBe(EN.pause.restart);
    fireEvent.click(button);
    expect(onRestart).toHaveBeenCalledOnce();
  });

  it('starts a fresh Quick Race on the same track with the same setup', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('play'));
    fireEvent.click(screen.getByTestId('mode-quickRace'));
    fireEvent.click(screen.getByTestId('track-sheikhZayed'));
    expect(screen.getByTestId('fake-race').dataset.mount).toBe('1');
    fireEvent.click(screen.getByTestId('fake-restart'));
    expect(screen.getByTestId('fake-race').dataset.mount).toBe('2');
    expect(mounts).toHaveLength(2);
    expect(mounts[1]).toEqual(mounts[0]);
    expect(mounts[1].trackId).toBe('sheikhZayed');
  });

  it('is not offered in season races', () => {
    const state = { ...createSeason({ mode: 'quick', seed: 42 }), nextRace: { track: 'marina', stage: 'rookie' } };
    const RaceComponent = ({ onRestart }) => <div data-testid="season-race" data-restart={String(Boolean(onRestart))} />;
    render(<SeasonRace state={state} difficulty="normal" dispatch={() => {}} RaceComponent={RaceComponent} />);
    expect(screen.getByTestId('season-race').dataset.restart).toBe('false');
  });
});
