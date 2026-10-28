import { useRef } from 'react';
import { t } from '../../i18n/strings.js';

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

function SteerPad({ input }) {
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
    </div>
  );
}

function HoldButton({ input, control, className, label }) {
  const handlers = useHold(input, control);
  return (
    <button type="button" className={`touch-btn ${className}`} data-testid={`btn-${control}`} {...handlers}>
      {label}
    </button>
  );
}

export function TouchControls({ input }) {
  return (
    <div className="touch-layer">
      <SteerPad input={input} />
      <div className="pedals">
        <HoldButton input={input} control="nitro" className="nitro" label={t('controls.nitro')} />
        <HoldButton input={input} control="brake" className="brake" label={t('controls.brake')} />
        <HoldButton input={input} control="gas" className="gas" label={t('controls.gas')} />
      </div>
    </div>
  );
}
