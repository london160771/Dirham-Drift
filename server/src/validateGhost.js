import { GHOST_RULES } from './config.js';

const isInt = (value, limit) => Number.isInteger(value) && Math.abs(value) <= limit;

function validFrame(frame) {
  return Array.isArray(frame) && frame.length === 3 && isInt(frame[0], GHOST_RULES.maxCoord) && isInt(frame[1], GHOST_RULES.maxCoord) && isInt(frame[2], GHOST_RULES.maxHeading);
}

function expectedFrames(timeMs) {
  return Math.floor((timeMs * GHOST_RULES.sampleHz) / 1000) + 1;
}

function smoothPath(frames) {
  for (let i = 1; i < frames.length; i += 1) {
    const step = Math.hypot(frames[i][0] - frames[i - 1][0], frames[i][1] - frames[i - 1][1]);
    if (step > GHOST_RULES.maxStep) return false;
  }
  return true;
}

export function validateGhost(body) {
  if (!body || typeof body !== 'object') return null;
  const { track, timeMs, frames } = body;
  if (!GHOST_RULES.trackIds.includes(track)) return null;
  if (!Number.isInteger(timeMs) || timeMs < GHOST_RULES.minTimeMs || timeMs > GHOST_RULES.maxTimeMs) return null;
  if (!Array.isArray(frames) || Math.abs(frames.length - expectedFrames(timeMs)) > GHOST_RULES.frameSlack) return null;
  if (!frames.every(validFrame) || !smoothPath(frames)) return null;
  return { track, timeMs, frames };
}
