import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { GHOST_RULES } from '../src/config.js';
import { createGhostStore } from '../src/ghostStore.js';

export const ORIGIN = 'https://dirham-drift.vercel.app';

export async function startServer({ now } = {}) {
  const mongo = await MongoMemoryServer.create();
  const connection = await mongoose.createConnection(mongo.getUri()).asPromise();
  const store = createGhostStore(connection);
  await store.syncIndexes();
  const app = createApp({ store, allowedOrigins: [ORIGIN, 'https://*.itch.zone'], now });
  const server = await new Promise((resolve) => {
    const listening = app.listen(0, () => resolve(listening));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, { body, origin = ORIGIN, method = body ? 'POST' : 'GET', headers = {} } = {}) =>
    fetch(`${base}${path}`, {
      method,
      headers: { ...(origin ? { Origin: origin } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: typeof body === 'string' ? body : body && JSON.stringify(body),
    });
  const stop = async () => {
    await new Promise((resolve) => server.close(resolve));
    await connection.close();
    await mongo.stop();
  };
  return { call, connection, stop };
}

export function makeGhost({ track = 'marina', timeMs = 30000, step = 20 } = {}) {
  const count = Math.floor((timeMs * GHOST_RULES.sampleHz) / 1000) + 1;
  const frames = Array.from({ length: count }, (_, i) => [1400, 4700 - i * step, -1571]);
  return { track, timeMs, frames };
}
