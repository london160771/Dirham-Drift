import { ENGINE_SOUND } from '../config/audio.js';

export function createEngineSound(ctx, out) {
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = ENGINE_SOUND.filterHz;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  filter.connect(gain).connect(out);
  const main = ctx.createOscillator();
  const sub = ctx.createOscillator();
  main.type = 'sawtooth';
  sub.type = 'square';
  main.connect(filter);
  sub.connect(filter);
  main.frequency.value = ENGINE_SOUND.idleHz;
  sub.frequency.value = ENGINE_SOUND.idleHz * ENGINE_SOUND.subRatio;
  main.start();
  sub.start();
  return {
    update(speedRatio, nitro) {
      const hz = ENGINE_SOUND.idleHz + (ENGINE_SOUND.topHz - ENGINE_SOUND.idleHz) * speedRatio + (nitro ? ENGINE_SOUND.nitroHz : 0);
      const now = ctx.currentTime;
      main.frequency.setTargetAtTime(hz, now, ENGINE_SOUND.smoothing);
      sub.frequency.setTargetAtTime(hz * ENGINE_SOUND.subRatio, now, ENGINE_SOUND.smoothing);
      gain.gain.setTargetAtTime(ENGINE_SOUND.gain, now, ENGINE_SOUND.smoothing);
    },
    stop() {
      gain.gain.setTargetAtTime(0, ctx.currentTime, ENGINE_SOUND.smoothing);
      main.stop(ctx.currentTime + 0.5);
      sub.stop(ctx.currentTime + 0.5);
    },
  };
}
