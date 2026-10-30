import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { CODE } from '../src/config.js';
import { makeGhost, startServer } from './helpers.js';

const CODE_PATTERN = new RegExp(`^[${CODE.alphabet}]{${CODE.length}}$`);

describe('ghost API (PRD §14)', () => {
  let server;
  before(async () => {
    server = await startServer();
  });
  after(() => server.stop());

  it('saves a ghost and returns a 6-character code that loads it back', async () => {
    const ghost = makeGhost();
    const saved = await server.call('/v1/ghosts', { body: ghost });
    assert.equal(saved.status, 201);
    const { code } = await saved.json();
    assert.match(code, CODE_PATTERN);
    const loaded = await server.call(`/v1/ghosts/${code}`);
    assert.equal(loaded.status, 200);
    assert.deepEqual(await loaded.json(), ghost);
  });

  it('accepts a lower-case code', async () => {
    const { code } = await (await server.call('/v1/ghosts', { body: makeGhost({ track: 'sheikhZayed' }) })).json();
    const loaded = await server.call(`/v1/ghosts/${code.toLowerCase()}`);
    assert.equal((await loaded.json()).track, 'sheikhZayed');
  });

  it('stores only track, time, path and a 30-day expiry', async () => {
    const { code } = await (await server.call('/v1/ghosts', { body: { ...makeGhost(), name: 'Sara' } })).json();
    const doc = await server.connection.collection('ghosts').findOne({ code });
    assert.deepEqual(Object.keys(doc).sort(), ['_id', 'code', 'createdAt', 'frames', 'timeMs', 'track']);
    const indexes = await server.connection.collection('ghosts').indexes();
    assert.equal(indexes.find((index) => index.key.createdAt).expireAfterSeconds, 30 * 24 * 60 * 60);
  });

  it('answers ghost_not_found for unknown or malformed codes', async () => {
    for (const code of ['ZZZZZZ', 'abc', 'O0O0O0']) {
      const res = await server.call(`/v1/ghosts/${code}`);
      assert.equal(res.status, 404);
      assert.deepEqual(await res.json(), { error: 'ghost_not_found' });
    }
  });

  it('reports health', async () => {
    const res = await server.call('/health', { origin: null });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: 'ok' });
  });
});
