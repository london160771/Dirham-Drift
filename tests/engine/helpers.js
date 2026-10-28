import { applyAction, createSeason } from '../../src/game/engine/index.js';

export const act = (state, type, extra = {}) => applyAction(state, { type, ...extra });

export function career(seed = 1) {
  return createSeason({ mode: 'career', seed });
}

export function race(state, { position = 3, damage = state.damage, kind = 'stage', keepEvent = false } = {}) {
  let s = act(state, 'chooseRace', { kind });
  s = act(s, 'startRace');
  s = act(s, 'finishRace', { results: { position, damage, timeMs: 60000, hits: 0, trackId: s.nextRace.track, finishOrder: [] } });
  if (!keepEvent) s = { ...s, pendingEvent: null };
  return s;
}

export function toHub(state) {
  return act(state, 'continue');
}

export function raceAndReturn(state, options) {
  return toHub(race(state, options));
}
