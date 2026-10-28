import { useEffect, useRef } from 'react';
import { audio } from '../../game/audio/audio.js';

export function moneySoundFor(lines) {
  if (lines.some((line) => line.kind === 'repossessed')) return 'repo';
  if (lines.some((line) => line.cash < 0 || line.savings < 0 || line.owed > 0)) return 'thud';
  if (lines.some((line) => line.cash > 0)) return 'coin';
  return null;
}

export function useMoneySounds(state) {
  const seen = useRef(state.ledger.length);
  useEffect(() => {
    const fresh = state.ledger.slice(seen.current);
    seen.current = state.ledger.length;
    const sound = moneySoundFor(fresh);
    if (sound) audio.play(sound);
  }, [state.ledger]);
}
