import { sendError } from './errors.js';

const WILDCARD = '*.';

function matcher(entry) {
  const star = entry.indexOf(WILDCARD);
  if (star === -1) return (origin) => origin === entry;
  const scheme = entry.slice(0, star);
  const suffix = entry.slice(star + 1);
  return (origin) => origin.startsWith(scheme) && origin.endsWith(suffix);
}

export function parseOrigins(list) {
  return list
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function cors(allowedOrigins) {
  const matchers = allowedOrigins.map(matcher);
  const allowed = (origin) => matchers.some((match) => match(origin));
  return (req, res, next) => {
    const { origin } = req.headers;
    if (!origin) return next();
    if (!allowed(origin)) return sendError(res, 'origin_not_allowed');
    res.set({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    });
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
  };
}
