import { useRef } from 'react';
import { t } from '../../i18n/strings.js';
import { Hint } from './Hints.jsx';

const SOURCE = 'touch';

function useHold(input, control) {
  const pointers = useRef(new Set());
  const start = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointers.current.add(event.pointerId);
    input.press(`${SOURCE}-${control}`, control);
  };
  const end = (event) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size === 0) input.release(`${SOURCE}-${control}`, control);
  };
  return { onPointerDown: start, onPointerUp: end, onPointerCancel: end, onLostPointerCapture: end };
}

function SteerPad({ input, hints, used }) {
  const sides = useRef(new Map());
  const apply = () => {
    const values = [...sides.current.values()];
    for (const control of ['left', 'right']) {
      if (values.includes(control)) input.press(`${SOURCE}-steer`, control);
      else input.release(`${SOURCE}-steer`, control);
    }
  };
  const sideOf = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    return event.clientX < box.left + box.width / 2 ? 'left' : 'right';
  };
  const down = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    sides.current.set(event.pointerId, sideOf(event));
    apply();
  };
  const move = (event) => {
    if (!sides.current.has(event.pointerId)) return;
    sides.current.set(event.pointerId, sideOf(event));
    apply();
  };
  const up = (event) => {
    sides.current.delete(event.pointerId);
    apply();
  };
  return (
    <div className="steer-pad" data-testid="steer-pad" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up}>
      <span className="touch-btn steer" aria-label={t('controls.left')}>◀</span>
      <span className="touch-btn steer" aria-label={t('controls.right')}>▶</span>
      <Hint show={hints} used={used.has('left')} textKey="controls.hintSteer" className="hint-steer" />
    </div>
  );
}

const HINT_KEYS = { gas: 'controls.hintGas', brake: 'controls.hintBrake', nitro: 'controls.hintNitro' };

function HoldButton({ input, control, hints, used }) {
  const handlers = useHold(input, control);
  return (
    <button type="button" className={`touch-btn ${control}`} data-testid={`btn-${control}`} {...handlers}>
      {t(`controls.${control}`)}
      <Hint show={hints} used={used.has(control)} textKey={HINT_KEYS[control]} className={`hint-${control}`} />
    </button>
  );
}

export function TouchControls({ input, hints, used }) {
  return (
    <div className="touch-layer">
      <SteerPad input={input} hints={hints} used={used} />
      <div className="pedals">
        {['nitro', 'brake', 'gas'].map((control) => (
          <HoldButton key={control} input={input} control={control} hints={hints} used={used} />
        ))}
      </div>
    </div>
  );
}
