import { CAR_PHYSICS, CAR_CONTACT } from '../../config/car.js';
import { AI, GRID, RACE } from '../../config/race.js';
import { createRng } from '../../engine/rng.js';
import { locate, pointAt } from '../track/buildTrack.js';
import { createAiBrain, driveAi, updateStuck } from './aiDriver.js';
import { createCar, stepCar } from './carPhysics.js';
import { createLapState, progressOf, raceLength, updateLap } from './lapTracker.js';
import { sortPositions } from './positions.js';
import { collideWithWalls } from './walls.js';

function gridSpot(track, slot) {
  const row = Math.floor(slot / 2);
  const lane = slot % 2 === 0 ? -RACE.gridLaneOffset : RACE.gridLaneOffset;
  const s = track.startS - RACE.gridRowSpacing * (row + 0.5) - (slot % 2) * (RACE.gridRowSpacing / 2);
  return { s, ...pointAt(track, s, lane) };
}

function rivalSlots() {
  const slots = [];
  for (let i = 0; i < RACE.carCount; i += 1) if (i !== GRID.playerSlot) slots.push(i);
  return slots;
}

function makeEntry(track, car, slot, brain) {
  const spot = gridSpot(track, slot);
  car.x = spot.x;
  car.y = spot.y;
  car.heading = spot.heading;
  const loc = locate(track, car.x, car.y, -1);
  return { car, brain, loc, lap: createLapState(track, loc.s), finishTime: 0, input: { steer: 0, gas: 0, brake: 0, nitro: false } };
}

export function createRace({ track, player, rivals, seed, startDamage = 0, rivalPace = 1 }) {
  const rng = createRng(seed);
  const entries = [makeEntry(track, createCar({ id: 'player', performance: player, damage: startDamage, isPlayer: true }), GRID.playerSlot, null)];
  rivalSlots().forEach((slot, i) => {
    const car = createCar({ id: `rival${i + 1}`, performance: rivals[i] });
    entries.push(makeEntry(track, car, slot, createAiBrain(AI.lanes[i % AI.lanes.length], createRng(rng.int(1, 2 ** 30)))));
  });
  return { track, entries, rivalPace, phase: 'countdown', countdown: RACE.countdownSeconds, time: 0, finishOrder: [], firstFinishAt: null, doneAt: null };
}

function resetToTrack(track, entry) {
  const spot = pointAt(track, entry.loc.s, entry.brain.lane);
  Object.assign(entry.car, { x: spot.x, y: spot.y, heading: spot.heading, vx: 0, vy: 0, speed: 0 });
  entry.brain.stuckTime = 0;
}

function separateCars(entries) {
  const minDist = CAR_PHYSICS.collisionRadius * 2;
  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const a = entries[i].car;
      const b = entries[j].car;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      if (dist >= minDist || dist === 0) continue;
      const nx = dx / dist;
      const ny = dy / dist;
      const push = (minDist - dist) * CAR_CONTACT.push;
      a.x -= nx * push;
      a.y -= ny * push;
      b.x += nx * push;
      b.y += ny * push;
      const closing = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
      if (closing <= 0) continue;
      const keep = closing > CAR_CONTACT.impactSpeed ? CAR_CONTACT.speedKept : 1;
      a.vx = (a.vx - nx * closing * 0.5) * keep;
      a.vy = (a.vy - ny * closing * 0.5) * keep;
      b.vx = (b.vx + nx * closing * 0.5) * keep;
      b.vy = (b.vy + ny * closing * 0.5) * keep;
    }
  }
}

function blockerAhead(race, entry) {
  let best = null;
  for (const other of race.entries) {
    if (other === entry) continue;
    const ahead = other.lap.distance - entry.lap.distance;
    const side = other.loc.lateral - entry.loc.lateral;
    if (ahead > 0 && ahead < AI.avoidAhead && Math.abs(side) < AI.avoidWidth && (!best || ahead < best.ahead)) best = { ahead, other };
  }
  return best && best.other;
}

function avoidTraffic(race, entry, dt) {
  const { brain, loc } = entry;
  const blocker = blockerAhead(race, entry);
  const limit = race.track.halfWidth - AI.edgeMargin;
  if (blocker) {
    const dir = loc.lateral >= blocker.loc.lateral ? 1 : -1;
    const wanted = blocker.loc.lateral + dir * AI.passOffset;
    brain.targetLane = Math.abs(wanted) > limit ? blocker.loc.lateral - dir * AI.passOffset : wanted;
  } else {
    brain.targetLane = brain.lane;
  }
  brain.currentLane += (brain.targetLane - brain.currentLane) * Math.min(1, AI.laneChangeRate * dt);
}

function stepEntry(race, entry, playerInput, dt) {
  const { track } = race;
  if (entry.lap.finished) {
    entry.input.gas = 0;
    entry.input.brake = entry.car.speed > 1 ? 0.4 : 0;
    entry.input.steer = 0;
  } else if (entry.brain) {
    avoidTraffic(race, entry, dt);
    driveAi(track, entry.car, entry.loc, entry.brain, race.rivalPace, dt, entry.input);
    if (updateStuck(entry.brain, entry.car, dt)) resetToTrack(track, entry);
  }
  stepCar(entry.car, entry.car.isPlayer && !entry.lap.finished ? playerInput : entry.input, dt);
  locate(track, entry.car.x, entry.car.y, entry.loc.index, entry.loc);
  collideWithWalls(track, entry.car, entry.loc);
  locate(track, entry.car.x, entry.car.y, entry.loc.index, entry.loc);
  const wasFinished = entry.lap.finished;
  updateLap(track, entry.lap, entry.loc.s);
  if (!wasFinished && entry.lap.finished) {
    entry.finishTime = race.time;
    race.finishOrder.push(entry.car.id);
    if (race.firstFinishAt === null) race.firstFinishAt = race.time;
  }
}

function checkDone(race) {
  const player = race.entries[0];
  const graceOver = player.lap.finished && race.time - player.finishTime >= RACE.finishGraceSeconds;
  const timeUp = race.firstFinishAt !== null && race.time - race.firstFinishAt >= RACE.timeLimitAfterFirstFinish;
  const allDone = race.entries.every((e) => e.lap.finished);
  if (graceOver || timeUp || allDone) {
    race.phase = 'done';
    race.doneAt = race.time;
  }
}

export function stepRace(race, playerInput, dt) {
  if (race.phase === 'done') return race;
  if (race.phase === 'countdown') {
    race.countdown -= dt;
    if (race.countdown <= 0) race.phase = 'racing';
    return race;
  }
  race.time += dt;
  for (const entry of race.entries) stepEntry(race, entry, playerInput, dt);
  separateCars(race.entries);
  checkDone(race);
  return race;
}

export function standings(race) {
  return sortPositions(
    race.entries.map((e) => ({ id: e.car.id, finished: e.lap.finished, finishTime: e.finishTime, progress: progressOf(race.track, e.lap) })),
  );
}

export function playerTelemetry(race) {
  const player = race.entries[0];
  const order = standings(race);
  const total = raceLength(race.track);
  return {
    phase: race.phase,
    countdown: Math.max(0, Math.ceil(race.countdown)),
    position: order.findIndex((e) => e.id === 'player') + 1,
    carCount: race.entries.length,
    lap: Math.min(race.track.laps, player.lap.laps + 1),
    laps: race.track.laps,
    progress: Math.min(1, Math.max(0, progressOf(race.track, player.lap) / total)),
    speed: Math.abs(player.car.speed),
    nitro: player.car.nitro,
    nitroActive: player.car.nitroActive,
    damage: Math.round(player.car.damage),
    timeMs: Math.round(race.time * 1000),
    finished: player.lap.finished,
  };
}

export function raceResults(race) {
  const order = standings(race);
  const player = race.entries[0];
  return {
    trackId: race.track.id,
    position: order.findIndex((e) => e.id === 'player') + 1,
    timeMs: Math.round((player.lap.finished ? player.finishTime : race.time) * 1000),
    damage: Math.round(player.car.damage),
    hits: player.car.hits,
    finishOrder: order.map((e) => e.id),
  };
}
