export class EngineError extends Error {
  constructor(code, message) {
    super(message || code);
    this.name = 'EngineError';
    this.code = code;
  }
}

export function assertWhole(value, label) {
  if (!Number.isSafeInteger(value)) throw new EngineError('not_whole', `${label} must be a whole AED amount, got ${value}`);
}

export function assertPositive(value, label) {
  assertWhole(value, label);
  if (value <= 0) throw new EngineError('not_positive', `${label} must be more than 0`);
}

export function percentOf(amount, percent) {
  const magnitude = Math.floor((Math.abs(amount) * Math.abs(percent)) / 100);
  return Math.sign(amount) * Math.sign(percent) * magnitude || 0;
}
