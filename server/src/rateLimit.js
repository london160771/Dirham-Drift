import { RATE_LIMIT } from './config.js';
import { sendError } from './errors.js';

export function rateLimit(name, now = Date.now) {
  const max = RATE_LIMIT.maxPerWindow[name];
  let windowStart = now();
  let counts = new Map();
  return (req, res, next) => {
    if (now() - windowStart >= RATE_LIMIT.windowMs) {
      windowStart = now();
      counts = new Map();
    }
    const used = (counts.get(req.ip) || 0) + 1;
    counts.set(req.ip, used);
    if (used <= max) return next();
    res.set('Retry-After', String(Math.ceil((windowStart + RATE_LIMIT.windowMs - now()) / 1000)));
    return sendError(res, 'rate_limited');
  };
}
