import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../../src/App.jsx';
import { GHOST_API } from '../../src/game/config/ghost.js';
import { GhostMenu } from '../../src/ui/ghost/GhostMenu.jsx';
import { GhostResults } from '../../src/ui/ghost/GhostResults.jsx';
import { EN } from '../../src/i18n/en.js';

const API = 'https://ghost.example';
const GHOST = { track: 'marina', timeMs: 61000, frames: [[1, 2, 3]] };

function reply(status, body) {
  return Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) });
}

function typeCode(value) {
  fireEvent.change(screen.getByTestId('ghost-code'), { target: { value } });
}

beforeEach(() => {
  vi.stubEnv('VITE_GHOST_API_URL', `${API}/`);
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('Ghost Challenge mode card', () => {
  it('shows only when a ghost server is configured', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('play'));
    expect(screen.getByTestId('mode-ghost')).toBeTruthy();
    cleanup();
    vi.stubEnv('VITE_GHOST_API_URL', '');
    render(<App />);
    fireEvent.click(screen.getByTestId('play'));
    expect(screen.queryByTestId('mode-ghost')).toBeNull();
  });
});

describe('Race a code', () => {
  it('cleans up the typed code and loads that ghost', async () => {
    const fetch = vi.fn(() => reply(200, GHOST));
    vi.stubGlobal('fetch', fetch);
    const onRace = vi.fn();
    render(<GhostMenu onRecord={() => {}} onRace={onRace} onBack={() => {}} />);
    typeCode(' ab-c 2o34 ');
    expect(screen.getByTestId('ghost-code').value).toBe('ABC234');
    await act(async () => fireEvent.click(screen.getByTestId('ghost-load')));
    expect(fetch.mock.calls[0][0]).toBe(`${API}/v1/ghosts/ABC234`);
    expect(onRace).toHaveBeenCalledWith(GHOST);
  });

  it('says when no ghost has that code', async () => {
    vi.stubGlobal('fetch', () => reply(404, { error: 'ghost_not_found' }));
    render(<GhostMenu onRecord={() => {}} onRace={() => {}} onBack={() => {}} />);
    typeCode('ZZZZZZ');
    await act(async () => fireEvent.click(screen.getByTestId('ghost-load')));
    expect(screen.getByTestId('ghost-error').textContent).toContain(EN.ghost.errors.ghost_not_found);
    expect(screen.queryByTestId('ghost-retry')).toBeNull();
  });

  it('shows "Waking server" on a slow answer, then offers a retry if it fails', async () => {
    vi.useFakeTimers();
    let fail;
    vi.stubGlobal('fetch', () => new Promise((_resolve, reject) => (fail = reject)));
    render(<GhostMenu onRecord={() => {}} onRace={() => {}} onBack={() => {}} />);
    typeCode('ABC234');
    fireEvent.click(screen.getByTestId('ghost-load'));
    await act(async () => vi.advanceTimersByTime(GHOST_API.wakingAfterMs));
    expect(screen.getByTestId('ghost-waking').textContent).toBe(EN.ghost.waking);
    await act(async () => fail(new TypeError('Failed to fetch')));
    expect(screen.getByTestId('ghost-error').textContent).toContain(EN.ghost.errors.server_waking);
    expect(screen.getByTestId('ghost-retry')).toBeTruthy();
  });
});

describe('Ghost results', () => {
  const results = { trackId: 'marina', timeMs: 60000, position: 1, ghost: { track: 'marina', timeMs: 60000, frames: [[1, 2, 3]] } };

  it('shows who won and shares the run as a code', async () => {
    const fetch = vi.fn(() => reply(201, { code: 'QWE789' }));
    vi.stubGlobal('fetch', fetch);
    render(<GhostResults results={results} opponent={GHOST} onAgain={() => {}} onMenu={() => {}} />);
    expect(screen.getByTestId('ghost-results').textContent).toContain('You beat the ghost by 1.00s!');
    await act(async () => fireEvent.click(screen.getByTestId('ghost-get-code')));
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe(`${API}/v1/ghosts`);
    expect(JSON.parse(init.body)).toEqual(results.ghost);
    expect(screen.getByTestId('ghost-share-code').textContent).toBe('QWE789');
  });

  it('calls an equal time a dead heat', () => {
    render(<GhostResults results={results} opponent={{ ...GHOST, timeMs: results.timeMs }} onAgain={() => {}} onMenu={() => {}} />);
    expect(screen.getByTestId('ghost-results').textContent).toContain(EN.ghost.tie);
  });

  it('explains a rate limit and lets the player retry', async () => {
    vi.stubGlobal('fetch', () => reply(429, { error: 'rate_limited' }));
    render(<GhostResults results={results} opponent={null} onAgain={() => {}} onMenu={() => {}} />);
    await act(async () => fireEvent.click(screen.getByTestId('ghost-get-code')));
    expect(screen.getByTestId('ghost-error').textContent).toContain(EN.ghost.errors.rate_limited);
    expect(screen.getByTestId('ghost-retry')).toBeTruthy();
  });

  it('races your own run as the ghost when there was no opponent', () => {
    const onAgain = vi.fn();
    render(<GhostResults results={results} opponent={null} onAgain={onAgain} onMenu={() => {}} />);
    fireEvent.click(screen.getByTestId('ghost-again'));
    expect(onAgain).toHaveBeenCalledWith(results.ghost);
  });
});
