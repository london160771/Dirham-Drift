import { useState } from 'react';
import { SEASONS } from './game/config/season.js';
import { SEED_RANGE } from './game/config/race.js';
import { RaceScreen } from './ui/race/RaceScreen.jsx';
import { buildRaceSetup } from './ui/raceSetup.js';
import { SeasonFlow } from './ui/season/SeasonFlow.jsx';
import { ModeSelect } from './ui/screens/ModeSelect.jsx';
import { QuickRaceResults } from './ui/screens/QuickRaceResults.jsx';
import { SettingsScreen } from './ui/screens/SettingsScreen.jsx';
import { TitleScreen } from './ui/screens/TitleScreen.jsx';
import { TrackSelect } from './ui/screens/TrackSelect.jsx';

const MODES = [
  { id: 'career', title: 'modes.career', info: 'modes.careerInfo', vars: { races: SEASONS.career.races.length, stages: new Set(SEASONS.career.races.map((race) => race.stage)).size } },
  { id: 'quickRace', title: 'modes.quickRace', info: 'modes.quickRaceInfo' },
];

function newCareerSeed() {
  return Date.now() % SEED_RANGE;
}

export function App() {
  const [screen, setScreen] = useState({ name: 'title' });
  const go = (name, extra = {}) => setScreen({ name, ...extra });
  const startQuickRace = (trackId) => go('race', { trackId, setup: buildRaceSetup({ trackId }) });

  switch (screen.name) {
    case 'modes':
      return <ModeSelect modes={MODES} onPick={(id) => (id === 'career' ? go('season', { seed: newCareerSeed() }) : go('tracks'))} onBack={() => go('title')} />;
    case 'season':
      return <SeasonFlow key={screen.seed} mode="career" seed={screen.seed} onExit={() => go('modes')} />;
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
