import { KEY_BINDINGS } from '../../config/controls.js';

const SOURCE = 'keyboard';

function controlFor(code) {
  return Object.keys(KEY_BINDINGS).find((control) => KEY_BINDINGS[control].includes(code));
}

export function attachKeyboard(input, { onPause }) {
  const down = (event) => {
    const control = controlFor(event.code);
    if (!control) return;
    event.preventDefault();
    if (control === 'pause') {
      if (!event.repeat) onPause();
      return;
    }
    input.press(SOURCE, control);
  };
  const up = (event) => {
    const control = controlFor(event.code);
    if (control && control !== 'pause') input.release(SOURCE, control);
  };
  const blur = () => input.releaseSource(SOURCE);
  window.addEventListener('keydown', down);
  window.addEventListener('keyup', up);
  window.addEventListener('blur', blur);
  return () => {
    window.removeEventListener('keydown', down);
    window.removeEventListener('keyup', up);
    window.removeEventListener('blur', blur);
  };
}
