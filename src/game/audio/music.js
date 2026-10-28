import { MUSIC } from '../config/audio.js';
import { createRng } from '../engine/rng.js';

function degreeHz(degree, octave = 0) {
  const steps = MUSIC.scale.length;
  const wrapped = ((degree % steps) + steps) % steps;
  const octaves = Math.floor(degree / steps) + octave;
  return MUSIC.root * 2 ** ((MUSIC.scale[wrapped] + 12 * octaves) / 12);
}

function note(ctx, { hz, at, length, wave, peak }) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(hz, at);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(peak, at + Math.min(0.03, length / 4));
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  osc.connect(gain).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + length + 0.02);
}

function drum(ctx, rng, at, kind) {
  if (kind === 'kick') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(120, at);
    osc.frequency.exponentialRampToValueAtTime(40, at + 0.18);
    gain.gain.setValueAtTime(0.5, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(at);
    osc.stop(at + 0.22);
    return;
  }
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.05), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (rng.next() * 2 - 1) * (1 - i / data.length);
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  source.buffer = buffer;
  filter.type = 'highpass';
  filter.frequency.value = 6000;
  gain.gain.value = 0.12;
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(at);
}

function schedule(ctx, track) {
  const rng = createRng(MUSIC.seed);
  const beat = 60 / track.bpm;
  const bar = beat * 4;
  for (let b = 0; b < track.bars; b += 1) {
    const chord = track.chords[b % track.chords.length];
    const start = b * bar;
    [0, 2, 4].forEach((d) => note(ctx, { hz: degreeHz(chord + d), at: start, length: bar, wave: 'triangle', peak: 0.05 }));
    for (let k = 0; k < 4; k += track.drums ? 1 : 2) note(ctx, { hz: degreeHz(chord, -1), at: start + k * beat, length: beat * 0.9, wave: 'sine', peak: 0.22 });
    const step = bar / track.arp.length;
    track.arp.forEach((d, k) => note(ctx, { hz: degreeHz(chord + d, 1), at: start + k * step, length: step * 0.8, wave: 'square', peak: 0.025 }));
    if (!track.drums) continue;
    for (let k = 0; k < 4; k += 1) {
      drum(ctx, rng, start + k * beat, 'kick');
      drum(ctx, rng, start + k * beat + beat / 2, 'hat');
    }
  }
  return track.bars * bar;
}

export async function renderMusic(OfflineContext, id) {
  const track = MUSIC[id];
  const seconds = (60 / track.bpm) * 4 * track.bars;
  const ctx = new OfflineContext(1, Math.ceil(seconds * MUSIC.sampleRate), MUSIC.sampleRate);
  schedule(ctx, track);
  return ctx.startRendering();
}
