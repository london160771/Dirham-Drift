import { AI } from '../../config/race.js';

export function createLapState(track, startS) {
  return { distance: startS, lastS: startS, checkpoint: 0, laps: 0, finished: false };
}

function deltaAlong(track, from, to) {
  let d = to - from;
  if (track.closed) {
    const half = track.length / 2;
    if (d > half) d -= track.length;
    if (d < -half) d += track.length;
  }
  return d;
}

export function checkpointDistance(track, index) {
  const perLap = track.checkpoints.length;
  const lap = Math.floor(index / perLap);
  const lapLength = track.closed ? track.length : 0;
  return track.checkpoints[index % perLap] + lap * lapLength;
}

export function totalCheckpoints(track) {
  return track.checkpoints.length * (track.closed ? track.laps : 1);
}

export function updateLap(track, lap, s) {
  const d = deltaAlong(track, lap.lastS, s);
  lap.lastS = s;
  if (lap.finished || Math.abs(d) > AI.jumpLimit) return lap;
  lap.distance += d;
  const total = totalCheckpoints(track);
  while (lap.checkpoint < total && lap.distance >= checkpointDistance(track, lap.checkpoint)) {
    lap.checkpoint += 1;
    if (track.closed && lap.checkpoint % track.checkpoints.length === 0) lap.laps += 1;
  }
  if (lap.checkpoint >= total) {
    lap.finished = true;
    if (!track.closed) lap.laps = 1;
  }
  return lap;
}

export function progressOf(track, lap) {
  return lap.distance - track.startS;
}

export function raceLength(track) {
  return track.closed ? track.length * track.laps : track.finishS - track.startS;
}
