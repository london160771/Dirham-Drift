import express from 'express';
import { normalizeCode } from './codes.js';
import { LIMITS } from './config.js';
import { cors } from './cors.js';
import { sendError } from './errors.js';
import { rateLimit } from './rateLimit.js';
import { validateGhost } from './validateGhost.js';

const TOO_LARGE = 'entity.too.large';

export function createApp({ store, allowedOrigins, now }) {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.get('/health', async (_req, res) => {
    const awake = store.ready() && (await store.ping().then(() => true, () => false));
    return awake ? res.json({ status: 'ok' }) : res.status(503).json({ status: 'waking' });
  });

  app.use('/v1', cors(allowedOrigins));
  const requireDb = (_req, res, next) => (store.ready() ? next() : sendError(res, 'server_waking'));

  app.post('/v1/ghosts', rateLimit('save', now), requireDb, express.json({ limit: LIMITS.bodyBytes }), async (req, res) => {
    const ghost = validateGhost(req.body);
    if (!ghost) return sendError(res, 'invalid_ghost');
    const code = await store.save(ghost);
    return res.status(201).json({ code });
  });

  app.get('/v1/ghosts/:code', rateLimit('load', now), requireDb, async (req, res) => {
    const code = normalizeCode(req.params.code);
    const ghost = code && (await store.load(code));
    if (!ghost) return sendError(res, 'ghost_not_found');
    return res.json(ghost);
  });

  app.use((error, _req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === TOO_LARGE) return sendError(res, 'payload_too_large');
    if (error.type === 'entity.parse.failed') return sendError(res, 'invalid_ghost');
    console.error(error);
    return sendError(res, 'server_waking');
  });

  return app;
}
