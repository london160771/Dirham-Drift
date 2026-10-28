import { STATE_VERSION } from '../../game/engine/index.js';

const KEY = 'dirham-drift:career';
export const SAVE_VERSION = 1;

export function saveCareer({ state, statementFrom }) {
  const save = { version: SAVE_VERSION, mode: state.mode, seed: state.seed, raceIndex: state.raceIndex, state, statementFrom };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    return false;
  }
  return true;
}

export function loadCareer() {
  try {
    const save = JSON.parse(window.localStorage.getItem(KEY));
    if (!save || save.version !== SAVE_VERSION || save.state?.version !== STATE_VERSION) return null;
    return save;
  } catch {
    return null;
  }
}

export function clearCareer() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    return false;
  }
  return true;
}
