import { GHOST, GHOST_API } from '../../game/config/ghost.js';

export class GhostError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
    this.retryable = GHOST_API.retryable.includes(code);
  }
}

export function ghostApiUrl() {
  return (import.meta.env.VITE_GHOST_API_URL || '').replace(/\/+$/, '');
}

export function normalizeCode(raw) {
  const allowed = new Set(GHOST.codeAlphabet);
  return [...String(raw).toUpperCase()].filter((char) => allowed.has(char)).join('').slice(0, GHOST.codeLength);
}

async function request(path, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GHOST_API.timeoutMs);
  try {
    const res = await fetch(`${ghostApiUrl()}${path}`, { ...init, signal: controller.signal });
    const body = await res.json().catch(() => ({}));
    if (res.ok) return body;
    throw new GhostError(body.error || 'server_waking');
  } catch (error) {
    throw error instanceof GhostError ? error : new GhostError('server_waking');
  } finally {
    clearTimeout(timer);
  }
}

export async function saveGhost(ghost) {
  const { code } = await request('/v1/ghosts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ghost) });
  return code;
}

export function loadGhost(code) {
  return request(`/v1/ghosts/${encodeURIComponent(code)}`);
}
