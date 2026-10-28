import { AUDIO_RULES, MUSIC, SOUND_GAIN } from '../config/audio.js';
import { VOLUME } from '../config/settings.js';
import { createEngineSound } from './engineSound.js';
import { renderMusic } from './music.js';
import { AUDIO_SLOTS } from './slots.js';
import { playSynth } from './synth.js';

const state = { ctx: null, sfx: null, music: null, buffers: {}, wanted: null, playing: null, volumes: { music: 0, effects: 0 }, voices: 0 };

function audioClasses() {
  if (typeof window === 'undefined') return {};
  return { Live: window.AudioContext || window.webkitAudioContext, Offline: window.OfflineAudioContext || window.webkitOfflineAudioContext };
}

async function loadFile(id) {
  const url = AUDIO_SLOTS[id];
  if (!url) return null;
  try {
    const response = await fetch(url);
    return await state.ctx.decodeAudioData(await response.arrayBuffer());
  } catch {
    return null;
  }
}

async function bufferFor(id) {
  if (!(id in state.buffers)) state.buffers[id] = loadFile(id);
  return state.buffers[id];
}

async function musicBuffer(id) {
  const key = `music-${id}`;
  if (!(key in state.buffers)) state.buffers[key] = loadFile(key).then((file) => file || renderMusic(audioClasses().Offline, id));
  return state.buffers[key];
}

function applyVolumes() {
  if (!state.ctx) return;
  state.sfx.gain.value = state.volumes.effects / VOLUME.max;
  state.music.gain.value = (state.volumes.music / VOLUME.max) * MUSIC.gain;
}

async function startMusic() {
  const id = state.wanted;
  if (!state.ctx || state.playing?.id === id) return;
  if (state.playing) {
    const { source, fade } = state.playing;
    fade.gain.setTargetAtTime(0, state.ctx.currentTime, AUDIO_RULES.fadeSeconds / 3);
    source.stop(state.ctx.currentTime + AUDIO_RULES.fadeSeconds);
    state.playing = null;
  }
  if (!id) return;
  const buffer = await musicBuffer(id);
  if (!buffer || state.wanted !== id || state.playing) return;
  const source = state.ctx.createBufferSource();
  const fade = state.ctx.createGain();
  source.buffer = buffer;
  source.loop = true;
  source.connect(fade).connect(state.music);
  source.start();
  state.playing = { id, source, fade };
}

export const audio = {
  unlock() {
    const { Live } = audioClasses();
    if (!Live) return;
    if (!state.ctx) {
      state.ctx = new Live();
      state.sfx = state.ctx.createGain();
      state.music = state.ctx.createGain();
      state.sfx.connect(state.ctx.destination);
      state.music.connect(state.ctx.destination);
      applyVolumes();
    }
    if (state.ctx.state === 'suspended') state.ctx.resume();
    startMusic();
  },
  setVolumes(volumes) {
    state.volumes = { music: volumes.musicVolume, effects: volumes.effectsVolume };
    applyVolumes();
  },
  async play(id) {
    if (!state.ctx || state.volumes.effects === 0 || state.voices >= AUDIO_RULES.maxSimultaneous) return;
    const out = state.ctx.createGain();
    out.gain.value = SOUND_GAIN[id] ?? 1;
    out.connect(state.sfx);
    state.voices += 1;
    setTimeout(() => {
      state.voices -= 1;
    }, AUDIO_RULES.voiceMs);
    const buffer = await bufferFor(id);
    if (!buffer) {
      playSynth(state.ctx, out, id);
      return;
    }
    const source = state.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(out);
    source.start();
  },
  music(id) {
    state.wanted = id;
    startMusic();
  },
  engine() {
    return state.ctx ? createEngineSound(state.ctx, state.sfx) : null;
  },
};
