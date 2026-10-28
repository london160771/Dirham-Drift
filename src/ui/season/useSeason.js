import { useReducer } from 'react';
import { EngineError, applyAction, createSeason } from '../../game/engine/index.js';

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

function init({ mode, seed }) {
  return { state: createSeason({ mode, seed }), statementFrom: 0, error: null };
}

export function useSeason(options) {
  const [store, dispatch] = useReducer(seasonReducer, options, init);
  return { ...store, dispatch };
}
