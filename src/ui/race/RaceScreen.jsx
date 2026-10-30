import { useEffect, useMemo, useRef, useState } from 'react';
import { RENDER } from '../../game/config/race.js';
import { createInputState } from '../../game/race/input/inputState.js';
import { attachKeyboard } from '../../game/race/input/keyboard.js';
import { t } from '../../i18n/strings.js';
import { applyAssists } from '../raceSetup.js';
import { HowToPlay } from '../screens/HowToPlay.jsx';
import { loadSettings, updateSettings } from '../storage/settingsStore.js';
import { KeyboardHint } from './Hints.jsx';
import { Countdown, DebugOverlay, Hud } from './Hud.jsx';
import { PauseOverlay, RotateOverlay } from './Overlays.jsx';
import { TouchControls } from './TouchControls.jsx';
import { useDevice } from './useDevice.js';
import { useRaceSounds } from './useRaceSounds.js';
import { useUsedControls } from './useUsedControls.js';

export function RaceScreen({ setup, money, ghostTimeMs, onFinish, onQuit }) {
  const hostRef = useRef(null);
  const pausedRef = useRef(false);
  const finishRef = useRef(onFinish);
  const input = useMemo(() => createInputState(), []);
  const settings = useMemo(() => loadSettings(), []);
  const device = useDevice();
  const used = useUsedControls(input);
  const [telemetry, setTelemetry] = useState(null);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [howTo, setHowTo] = useState(false);
  const [canBoot, setCanBoot] = useState(!device.mustRotate);
  if (!canBoot && !device.mustRotate) setCanBoot(true);
  const blocked = paused || device.mustRotate;
  const tuned = useMemo(() => ({ ...applyAssists(setup, settings), reduceMotion: settings.reduceMotion }), [setup, settings]);
  useRaceSounds(telemetry, settings, blocked);

  useEffect(() => {
    pausedRef.current = blocked;
    finishRef.current = onFinish;
  }, [blocked, onFinish]);

  useEffect(() => {
    if (!canBoot) return undefined;
    const bridge = {
      input,
      isPaused: () => pausedRef.current,
      onReady: () => setReady(true),
      onTelemetry: setTelemetry,
      onFinish: (results) => {
        updateSettings({ hintsSeen: true });
        finishRef.current(results);
      },
    };
    let game = null;
    let cancelled = false;
    import('../../game/race/createRaceGame.js').then(({ createRaceGame }) => {
      if (!cancelled) game = createRaceGame(hostRef.current, tuned, bridge);
    });
    const detach = attachKeyboard(input, { onPause: () => setPaused((p) => !p) });
    const hide = () => document.hidden && setPaused(true);
    let settle = null;
    const refit = () => {
      clearTimeout(settle);
      settle = setTimeout(() => game?.scale.refresh(), RENDER.rotateSettleMs);
    };
    document.addEventListener('visibilitychange', hide);
    window.addEventListener('resize', refit);
    window.addEventListener('orientationchange', refit);
    return () => {
      detach();
      document.removeEventListener('visibilitychange', hide);
      window.removeEventListener('resize', refit);
      window.removeEventListener('orientationchange', refit);
      clearTimeout(settle);
      cancelled = true;
      game?.destroy(true);
    };
  }, [input, tuned, canBoot]);

  return (
    <div className="race-screen" dir="ltr">
      <div className="race-canvas" ref={hostRef} />
      {!ready && <div className="overlay loading">{t('common.loading')}</div>}
      <Hud telemetry={telemetry} money={money} ghostTimeMs={ghostTimeMs} onPause={() => setPaused(true)} />
      <Countdown telemetry={telemetry} />
      {device.touch && <TouchControls input={input} hints={!settings.hintsSeen} used={used} />}
      {!settings.hintsSeen && !device.touch && <KeyboardHint used={used} />}
      {settings.showFps && <DebugOverlay telemetry={telemetry} input={input} />}
      {paused && !device.mustRotate && !howTo && <PauseOverlay onResume={() => setPaused(false)} onHowTo={() => setHowTo(true)} onQuit={() => onQuit(telemetry)} />}
      {paused && howTo && <HowToPlay overlay onBack={() => setHowTo(false)} />}
      {device.mustRotate && <RotateOverlay />}
    </div>
  );
}
