import { useEffect, useMemo, useRef, useState } from 'react';
import { createInputState } from '../../game/race/input/inputState.js';
import { attachKeyboard } from '../../game/race/input/keyboard.js';
import { t } from '../../i18n/strings.js';
import { loadSettings, updateSettings } from '../storage/settingsStore.js';
import { KeyboardHint } from './Hints.jsx';
import { Countdown, DebugOverlay, Hud } from './Hud.jsx';
import { PauseOverlay, RotateOverlay } from './Overlays.jsx';
import { TouchControls } from './TouchControls.jsx';
import { useDevice } from './useDevice.js';
import { useUsedControls } from './useUsedControls.js';

export function RaceScreen({ setup, money, onFinish, onQuit }) {
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
  const blocked = paused || device.mustRotate;

  useEffect(() => {
    pausedRef.current = blocked;
    finishRef.current = onFinish;
  }, [blocked, onFinish]);

  useEffect(() => {
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
      if (!cancelled) game = createRaceGame(hostRef.current, setup, bridge);
    });
    const detach = attachKeyboard(input, { onPause: () => setPaused((p) => !p) });
    const hide = () => document.hidden && setPaused(true);
    document.addEventListener('visibilitychange', hide);
    return () => {
      detach();
      document.removeEventListener('visibilitychange', hide);
      cancelled = true;
      game?.destroy(true);
    };
  }, [input, setup]);

  return (
    <div className="race-screen">
      <div className="race-canvas" ref={hostRef} />
      {!ready && <div className="overlay loading">{t('common.loading')}</div>}
      <Hud telemetry={telemetry} money={money} onPause={() => setPaused(true)} />
      <Countdown telemetry={telemetry} />
      {device.touch && <TouchControls input={input} hints={!settings.hintsSeen} used={used} />}
      {!settings.hintsSeen && !device.touch && <KeyboardHint used={used} />}
      {settings.showFps && <DebugOverlay telemetry={telemetry} input={input} />}
      {paused && !device.mustRotate && <PauseOverlay onResume={() => setPaused(false)} onQuit={onQuit} />}
      {device.mustRotate && <RotateOverlay />}
    </div>
  );
}
