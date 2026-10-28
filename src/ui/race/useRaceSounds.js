import { useEffect, useRef } from 'react';
import { CAR_PHYSICS, NITRO } from '../../game/config/car.js';
import { ASSISTS } from '../../game/config/settings.js';
import { audio } from '../../game/audio/audio.js';

const TOP = CAR_PHYSICS.topSpeed * (1 + NITRO.speedBoost);

function vibrate(settings) {
  if (settings.vibration && typeof navigator.vibrate === 'function') navigator.vibrate(ASSISTS.vibrationMs);
}

export function useRaceSounds(telemetry, settings, paused) {
  const last = useRef({ hits: 0, nitro: false, countdown: null, phase: null });
  const engine = useRef(null);

  useEffect(() => {
    audio.music('race');
    return () => {
      engine.current?.stop();
      engine.current = null;
      audio.music('hub');
    };
  }, []);

  useEffect(() => {
    if (!telemetry) return;
    const prev = last.current;
    if (!engine.current) engine.current = audio.engine();
    engine.current?.update(paused ? 0 : Math.min(1, telemetry.speed / TOP), !paused && telemetry.nitroActive);
    if (telemetry.phase === 'countdown' && telemetry.countdown !== prev.countdown) audio.play('beep');
    if (telemetry.phase === 'racing' && prev.phase === 'countdown') audio.play('go');
    if (telemetry.hits > prev.hits) {
      audio.play('hit');
      vibrate(settings);
    }
    if (telemetry.nitroActive && !prev.nitro) audio.play('nitro');
    last.current = { hits: telemetry.hits, nitro: telemetry.nitroActive, countdown: telemetry.countdown, phase: telemetry.phase };
  }, [telemetry, settings, paused]);
}
