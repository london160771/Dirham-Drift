export const CONTROLS = ['left', 'right', 'gas', 'brake', 'nitro'];

export function createInputState() {
  const held = new Map();
  const used = new Set();
  const listeners = new Set();
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
    releaseSource(source) {
      for (const key of held.keys()) if (key.startsWith(`${source}:`)) held.set(key, false);
    },
    isHeld,
    read(out) {
      out.steer = (isHeld('right') ? 1 : 0) - (isHeld('left') ? 1 : 0);
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
