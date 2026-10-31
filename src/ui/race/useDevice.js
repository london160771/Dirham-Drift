import { useEffect, useState } from 'react';

function matches(query) {
  return typeof window.matchMedia === 'function' && window.matchMedia(query).matches;
}

function detectTouch() {
  return matches('(pointer: coarse)') || navigator.maxTouchPoints > 0;
}

function detectPortrait() {
  return matches('(orientation: portrait)');
}

export function useDevice() {
  const [state, setState] = useState(() => ({ touch: detectTouch(), portrait: detectPortrait() }));
  useEffect(() => {
    const update = () => setState({ touch: detectTouch(), portrait: detectPortrait() });
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);
  return { ...state, mustRotate: state.touch && state.portrait };
}
