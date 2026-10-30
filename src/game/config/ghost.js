export const GHOST = {
  sampleHz: 20,
  headingScale: 1000,
  alpha: 0.6,
  codeLength: 6,
  codeAlphabet: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  minTimeMs: 10000,
  maxTimeMs: 300000,
};

export const GHOST_API = {
  wakingAfterMs: 2500,
  timeoutMs: 75000,
  retryable: ['rate_limited', 'server_waking'],
};
