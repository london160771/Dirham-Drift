import { useCallback, useEffect, useRef, useState } from 'react';
import { GHOST_API } from '../../game/config/ghost.js';

export function useGhostRequest() {
  const [state, setState] = useState({ status: 'idle' });
  const live = useRef(true);
  const run = useCallback(async (call) => {
    setState({ status: 'loading' });
    const waking = setTimeout(() => live.current && setState((s) => (s.status === 'loading' ? { status: 'waking' } : s)), GHOST_API.wakingAfterMs);
    try {
      const value = await call();
      if (live.current) setState({ status: 'done', value });
      return value;
    } catch (error) {
      if (live.current) setState({ status: 'error', error });
      return null;
    } finally {
      clearTimeout(waking);
    }
  }, []);
  useEffect(() => {
    live.current = true;
    return () => {
      live.current = false;
    };
  }, []);
  return [state, run];
}
