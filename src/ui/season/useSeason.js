import { useEffect, useReducer } from 'react';
import { EngineError, applyAction, createSeason, seasonPlan } from '../../game/engine/index.js';
import { clearCareer, saveCareer } from '../storage/seasonStore.js';

export function seasonReducer(store, action) {
  try {
    const state = applyAction(store.state, action);
    const statementFrom = action.type === 'startRace' ? store.state.ledger.length : store.statementFrom;
    return { state, statementFrom, error: null };
  } catch (err) {
    if (!(err instanceof EngineError)) throw err;
    return { ...store, error: err.code };
  }
}

function init({ mode, seed, saved }) {
  if (saved) return { state: saved.state, statementFrom: saved.statementFrom, error: null };
  const store = { state: createSeason({ mode, seed }), statementFrom: 0, error: null };
  if (!seasonPlan(mode).autoStartFirstRace) return store;
  return seasonReducer(seasonReducer(store, { type: 'chooseRace', kind: 'stage' }), { type: 'startRace' });
}

function persist(store) {
  const { state } = store;
  if (!seasonPlan(state.mode).saved) return;
  if (state.phase === 'RECAP') clearCareer();
  else if (state.phase !== 'RACING') saveCareer(store);
}

export function useSeason(options) {
  const [store, dispatch] = useReducer(seasonReducer, options, init);
  useEffect(() => persist(store), [store]);
  return { ...store, dispatch };
}
