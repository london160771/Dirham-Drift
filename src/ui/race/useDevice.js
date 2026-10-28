import { useEffect, useState } from 'react';

function detectTouch() {
  return window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
}

function detectPortrait() {
  return window.matchMedia('(orientation: portrait)').matches;
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
