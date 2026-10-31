import { useState } from 'react';
import { hudMoney, retiredResults, seasonRaceSetup } from './seasonRace.js';

export function SeasonRace({ state, difficulty, dispatch, RaceComponent }) {
  const [setup] = useState(() => seasonRaceSetup(state, difficulty));
  const [money] = useState(() => hudMoney(state));
  return (
    <RaceComponent
      setup={setup}
      money={money}
      onFinish={(results) => dispatch({ type: 'finishRace', results })}
      onQuit={(telemetry) => dispatch({ type: 'finishRace', results: retiredResults(state, telemetry) })}
    />
  );
}
