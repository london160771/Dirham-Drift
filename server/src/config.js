export const GHOST_RULES = {
  trackIds: ['marina', 'sheikhZayed'],
  sampleHz: 20,
  minTimeMs: 10000,
  maxTimeMs: 300000,
  maxCoord: 20000,
  maxHeading: 3200,
  maxStep: 80,
  frameSlack: 5,
};

export const CODE = {
  length: 6,
  alphabet: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  saveAttempts: 5,
};

export const LIMITS = {
  bodyBytes: '160kb',
  ttl: '30d',
};

export const RATE_LIMIT = {
  windowMs: 60000,
  maxPerWindow: { save: 10, load: 60 },
};

export const DEFAULT_ORIGINS = 'http://localhost:5173,http://localhost:4173';

export const DEFAULT_PORT = 8080;
