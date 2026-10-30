import mongoose from 'mongoose';
import { CODE, LIMITS } from './config.js';
import { newCode } from './codes.js';

const DUPLICATE_KEY = 11000;
const CONNECTED = 1;

const ghostSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    track: { type: String, required: true },
    timeMs: { type: Number, required: true },
    frames: { type: [[Number]], required: true },
    createdAt: { type: Date, default: Date.now, expires: LIMITS.ttl },
  },
  { versionKey: false },
);

export function createGhostStore(connection = mongoose.connection) {
  const Ghost = connection.models.Ghost || connection.model('Ghost', ghostSchema, 'ghosts');
  return {
    ready: () => connection.readyState === CONNECTED,
    async ping() {
      await connection.db.admin().ping();
    },
    async save(ghost) {
      for (let attempt = 1; ; attempt += 1) {
        try {
          const code = newCode();
          await Ghost.create({ ...ghost, code });
          return code;
        } catch (error) {
          if (error.code !== DUPLICATE_KEY || attempt >= CODE.saveAttempts) throw error;
        }
      }
    },
    async load(code) {
      return Ghost.findOne({ code }, { _id: 0, track: 1, timeMs: 1, frames: 1 }).lean();
    },
    syncIndexes: () => Ghost.syncIndexes(),
  };
}
