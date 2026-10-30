import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { RATE_LIMIT } from '../src/config.js';
import { makeGhost, startServer } from './helpers.js';

describe('CORS allowlist (PRD §12)', () => {
  let server;
  before(async () => {
    server = await startServer();
  });
  after(() => server.stop());

  it('answers the preflight for the game origin', async () => {
    const res = await server.call('/v1/ghosts', { method: 'OPTIONS' });
    assert.equal(res.status, 204);
    assert.equal(res.headers.get('access-control-allow-origin'), 'https://dirham-drift.vercel.app');
    assert.match(res.headers.get('access-control-allow-headers'), /Content-Type/);
  });

  it('allows itch.io game domains by wildcard', async () => {
    const res = await server.call('/v1/ghosts/ZZZZZZ', { origin: 'https://html-classic.itch.zone' });
    assert.equal(res.headers.get('access-control-allow-origin'), 'https://html-classic.itch.zone');
  });

  it('blocks other sites', async () => {
    for (const origin of ['https://evil.example', 'https://itch.zone.evil.example', 'http://html-classic.itch.zone']) {
      const res = await server.call('/v1/ghosts', { body: makeGhost(), origin });
      assert.equal(res.status, 403);
      assert.equal(res.headers.get('access-control-allow-origin'), null);
    }
  });
});

describe('rate limit and waking (PRD §11 rate_limited, server_waking)', () => {
  let server;
  let clock = 0;
  before(async () => {
    server = await startServer({ now: () => clock });
  });
  after(() => server.stop());

  it('limits saves per window, then lets the player retry', async () => {
    const max = RATE_LIMIT.maxPerWindow.save;
    for (let i = 0; i < max; i += 1) assert.equal((await server.call('/v1/ghosts', { body: makeGhost() })).status, 201);
    const limited = await server.call('/v1/ghosts', { body: makeGhost() });
    assert.equal(limited.status, 429);
    assert.deepEqual(await limited.json(), { error: 'rate_limited' });
    assert.ok(Number(limited.headers.get('retry-after')) > 0);
    clock += RATE_LIMIT.windowMs;
    assert.equal((await server.call('/v1/ghosts', { body: makeGhost() })).status, 201);
  });

  it('answers server_waking while the database is not connected', async () => {
    await server.connection.close();
    const res = await server.call('/v1/ghosts/ZZZZZZ');
    assert.equal(res.status, 503);
    assert.deepEqual(await res.json(), { error: 'server_waking' });
    const health = await server.call('/health', { origin: null });
    assert.deepEqual(await health.json(), { status: 'waking' });
  });
});
