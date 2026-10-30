import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { RATE_LIMIT } from '../src/config.js';
import { makeGhost, startServer } from './helpers.js';

const bad = {
  'unknown track': { ...makeGhost(), track: 'monaco' },
  'time too short': makeGhost({ timeMs: 2000 }),
  'time not whole ms': { ...makeGhost(), timeMs: 30000.5 },
  'frames do not match the time': { ...makeGhost(), timeMs: 60000 },
  'frame with 2 numbers': { ...makeGhost(), frames: makeGhost().frames.map(([x, y]) => [x, y]) },
  'frame with a float': { ...makeGhost(), frames: makeGhost().frames.map(([x, y, h]) => [x + 0.5, y, h]) },
  'frame out of the world': { ...makeGhost(), frames: makeGhost().frames.map(([, y, h]) => [99999, y, h]) },
  'teleporting path': makeGhost({ step: 200 }),
  'frames not a list': { ...makeGhost(), frames: 'path' },
  'empty body': {},
};

describe('ghost validation (PRD §11 invalid_ghost, payload_too_large)', () => {
  let server;
  let clock = 0;
  before(async () => {
    server = await startServer({ now: () => (clock += RATE_LIMIT.windowMs) });
  });
  after(() => server.stop());

  for (const [name, body] of Object.entries(bad)) {
    it(`rejects ${name}`, async () => {
      const res = await server.call('/v1/ghosts', { body });
      assert.equal(res.status, 400);
      assert.deepEqual(await res.json(), { error: 'invalid_ghost' });
    });
  }

  it('rejects broken JSON as invalid_ghost', async () => {
    const res = await server.call('/v1/ghosts', { body: '{"track":' });
    assert.deepEqual(await res.json(), { error: 'invalid_ghost' });
  });

  it('rejects a body over the size limit', async () => {
    const huge = { ...makeGhost(), padding: 'x'.repeat(200 * 1024) };
    const res = await server.call('/v1/ghosts', { body: huge });
    assert.equal(res.status, 413);
    assert.deepEqual(await res.json(), { error: 'payload_too_large' });
  });

  it('accepts the longest allowed run under the size limit', async () => {
    const res = await server.call('/v1/ghosts', { body: makeGhost({ timeMs: 300000, step: 0 }) });
    assert.equal(res.status, 201);
  });
});
