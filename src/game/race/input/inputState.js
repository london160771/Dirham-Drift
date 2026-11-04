export const CONTROLS = ['left', 'right', 'gas', 'brake', 'nitro'];

export function createInputState() {
  const held = new Map();
  const used = new Set();
  const listeners = new Set();
  const axes = new Map();
  const axisSteer = () => {
    let sum = 0;
    for (const value of axes.values()) sum += value;
    return Math.max(-1, Math.min(1, sum));
  };
  const isHeld = (control) => {
    for (const [key, on] of held) if (on && key.endsWith(`:${control}`)) return true;
    return false;
  };
  return {
    press(source, control) {
      held.set(`${source}:${control}`, true);
      if (!used.has(control)) {
        used.add(control);
        listeners.forEach((fn) => fn(control));
      }
    },
    release(source, control) {
      held.set(`${source}:${control}`, false);
    },
    setAxis(source, value) {
      axes.set(source, value);
    },
    releaseSource(source) {
      axes.delete(source);
      for (const key of held.keys()) if (key.startsWith(`${source}:`)) held.set(key, false);
    },
    isHeld,
    read(out) {
      const buttons = (isHeld('right') ? 1 : 0) - (isHeld('left') ? 1 : 0);
      out.steer = buttons !== 0 ? buttons : axisSteer();
      out.gas = isHeld('gas') ? 1 : 0;
      out.brake = isHeld('brake') ? 1 : 0;
      out.nitro = isHeld('nitro');
      return out;
    },
    onFirstUse(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    hasUsed: (control) => used.has(control),
  };
}
