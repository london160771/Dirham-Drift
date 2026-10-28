import { useState } from 'react';
import { SEASONS } from './game/config/season.js';
import { SEED_RANGE } from './game/config/race.js';
import { RaceScreen } from './ui/race/RaceScreen.jsx';
import { buildRaceSetup } from './ui/raceSetup.js';
import { SeasonFlow } from './ui/season/SeasonFlow.jsx';
import { ModeSelect } from './ui/screens/ModeSelect.jsx';
import { modeCards } from './ui/screens/modes.js';
import { QuickRaceResults } from './ui/screens/QuickRaceResults.jsx';
import { SettingsScreen } from './ui/screens/SettingsScreen.jsx';
import { TitleScreen } from './ui/screens/TitleScreen.jsx';
import { TrackSelect } from './ui/screens/TrackSelect.jsx';
import { loadCareer } from './ui/storage/seasonStore.js';

function newCareerSeed() {
  return Date.now() % SEED_RANGE;
}

export function App() {
  const [screen, setScreen] = useState({ name: 'title' });
  const go = (name, extra = {}) => setScreen({ name, ...extra });
  const startQuickRace = (trackId) => go('race', { trackId, setup: buildRaceSetup({ trackId }) });
  const startSeason = (mode, extra = {}) => go('season', { mode, seed: SEASONS.quick.seed, run: Date.now(), ...extra });
  const pickMode = (id) => {
    if (id === 'quickSeason') startSeason('quick');
    else if (id === 'career') startSeason('career', { seed: newCareerSeed() });
    else if (id === 'continue') startSeason('career', { saved: loadCareer() });
    else go('tracks');
  };

  switch (screen.name) {
    case 'modes':
      return <ModeSelect modes={modeCards(loadCareer())} onPick={pickMode} onBack={() => go('title')} />;
    case 'season':
      return (
        <SeasonFlow
          key={screen.run}
          mode={screen.mode}
          seed={screen.saved ? screen.saved.seed : screen.seed}
          saved={screen.saved}
          onExit={() => go('modes')}
          onAgain={() => pickMode(screen.mode === 'quick' ? 'quickSeason' : 'career')}
        />
      );
    case 'tracks':
      return <TrackSelect onPick={startQuickRace} onBack={() => go('modes')} />;
    case 'race':
      return (
        <RaceScreen
          setup={screen.setup}
          onFinish={(results) => go('results', { trackId: screen.trackId, results })}
          onQuit={() => go('modes')}
        />
      );
    case 'results':
      return <QuickRaceResults results={screen.results} onAgain={() => startQuickRace(screen.trackId)} onMenu={() => go('modes')} />;
    case 'settings':
      return <SettingsScreen onBack={() => go('title')} />;
    default:
      return <TitleScreen onPlay={() => go('modes')} onSettings={() => go('settings')} />;
  }
}
