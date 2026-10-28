import { SYNTH_SOUNDS } from '../config/audio.js';
import { createRng } from '../engine/rng.js';

function noiseBuffer(ctx, seconds, seed) {
  const rng = createRng(seed);
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = rng.next() * 2 - 1;
  return buffer;
}

function envelope(ctx, out, start, duration, peak) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  gain.connect(out);
  return gain;
}

function playNoise(ctx, out, recipe, start) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx, recipe.duration, Math.round(start * 1000));
  const filter = ctx.createBiquadFilter();
  filter.type = recipe.sweep ? 'bandpass' : 'lowpass';
  filter.frequency.setValueAtTime(recipe.filter, start);
  if (recipe.sweep) filter.frequency.exponentialRampToValueAtTime(recipe.sweep, start + recipe.duration);
  source.connect(filter).connect(envelope(ctx, out, start, recipe.duration, 1));
  source.start(start);
}

function playTones(ctx, out, recipe, start) {
  recipe.notes.forEach((hz, i) => {
    const at = start + i * recipe.step;
    const osc = ctx.createOscillator();
    osc.type = recipe.wave;
    osc.frequency.setValueAtTime(hz, at);
    osc.connect(envelope(ctx, out, at, recipe.duration, 0.6));
    osc.start(at);
    osc.stop(at + recipe.duration + 0.02);
  });
}

function playDrop(ctx, out, recipe, start) {
  const osc = ctx.createOscillator();
  osc.type = recipe.wave;
  osc.frequency.setValueAtTime(recipe.from, start);
  osc.frequency.exponentialRampToValueAtTime(recipe.to, start + recipe.duration);
  osc.connect(envelope(ctx, out, start, recipe.duration, 0.9));
  osc.start(start);
  osc.stop(start + recipe.duration + 0.02);
}

const PLAYERS = { noise: playNoise, tones: playTones, drop: playDrop };

export function playSynth(ctx, out, id) {
  const recipe = SYNTH_SOUNDS[id];
  if (recipe) PLAYERS[recipe.type](ctx, out, recipe, ctx.currentTime);
}
