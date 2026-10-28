import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { SeasonFlow } from '../../src/ui/season/SeasonFlow.jsx';

export const races = [];
export const nextResults = { position: 5, damage: 0 };

function FakeRace({ setup, money, onFinish, onQuit }) {
  races.push({ setup, money });
  const results = () => ({ trackId: setup.trackId, position: nextResults.position, timeMs: 60000, damage: Math.max(nextResults.damage, setup.race.startDamage), hits: 0, finishOrder: [] });
  return (
    <div data-testid="fake-race">
      <button type="button" onClick={() => onFinish(results())}>
        finish
      </button>
      <button type="button" onClick={() => onQuit({ timeMs: 1000, damage: setup.race.startDamage })}>
        quit
      </button>
    </div>
  );
}

export function startSeason(mode, { seed = 42, tipsSeen = true, saved = null } = {}) {
  cleanup();
  if (!saved) window.localStorage.removeItem('dirham-drift:career');
  races.length = 0;
  nextResults.position = 5;
  nextResults.damage = 0;
  if (tipsSeen !== null) window.localStorage.setItem('dirham-drift:settings', JSON.stringify({ pitTipsSeen: tipsSeen }));
  render(<SeasonFlow mode={mode} seed={seed} saved={saved} onExit={() => {}} RaceComponent={FakeRace} />);
}

export function click(testId) {
  fireEvent.click(screen.getByTestId(testId));
}

export function text(testId) {
  return screen.getByTestId(testId).textContent;
}

export function closeLessons() {
  while (screen.queryByTestId('close-lesson')) click('close-lesson');
}

const FREE_CHOICES = ['ignore', 'refuse', 'decline', 'walkAway', 'collect', 'pay'];

export function raceOnce(kind = 'stage') {
  closeLessons();
  click(`enter-${kind}`);
  click('start-race');
  fireEvent.click(screen.getByText('finish'));
  if (screen.queryByTestId('race-damaged')) click('race-damaged');
  else click('continue');
  skipEvent();
}

export function skipEvent() {
  if (!screen.queryByTestId('event-card')) return;
  const choice = FREE_CHOICES.find((id) => screen.queryByTestId(`choice-${id}`));
  click(`choice-${choice}`);
}
