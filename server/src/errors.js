export const ERRORS = {
  invalid_ghost: 400,
  ghost_not_found: 404,
  origin_not_allowed: 403,
  payload_too_large: 413,
  rate_limited: 429,
  server_waking: 503,
};

export function sendError(res, code) {
  res.status(ERRORS[code]).json({ error: code });
}
