import { useState } from 'react';
import { buildGhostSetup } from '../raceSetup.js';
import { RaceScreen } from '../race/RaceScreen.jsx';
import { TrackSelect } from '../screens/TrackSelect.jsx';
import { GhostMenu } from './GhostMenu.jsx';
import { GhostResults } from './GhostResults.jsx';

export function GhostFlow({ onExit }) {
  const [view, setView] = useState({ name: 'menu' });
  const race = (trackId, opponent = null) => setView({ name: 'race', opponent, setup: buildGhostSetup({ trackId, ghost: opponent }), run: Date.now() });
  const menu = () => setView({ name: 'menu' });

  if (view.name === 'tracks') return <TrackSelect onPick={(trackId) => race(trackId)} onBack={menu} />;
  if (view.name === 'race') {
    return (
      <RaceScreen
        key={view.run}
        setup={view.setup}
        ghostTimeMs={view.opponent?.timeMs}
        onFinish={(results) => setView({ name: 'results', results, opponent: view.opponent })}
        onQuit={menu}
      />
    );
  }
  if (view.name === 'results') {
    return <GhostResults results={view.results} opponent={view.opponent} onAgain={(ghost) => race(view.results.trackId, ghost)} onMenu={menu} />;
  }
  return <GhostMenu onRecord={() => setView({ name: 'tracks' })} onRace={(ghost) => race(ghost.track, ghost)} onBack={onExit} />;
}
