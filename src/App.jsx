import { useState } from 'react';
import { RaceScreen } from './ui/race/RaceScreen.jsx';
import { buildRaceSetup } from './ui/raceSetup.js';
import { ModeSelect } from './ui/screens/ModeSelect.jsx';
import { QuickRaceResults } from './ui/screens/QuickRaceResults.jsx';
import { SettingsScreen } from './ui/screens/SettingsScreen.jsx';
import { TitleScreen } from './ui/screens/TitleScreen.jsx';
import { TrackSelect } from './ui/screens/TrackSelect.jsx';

const MODES = [{ id: 'quickRace', title: 'modes.quickRace', info: 'modes.quickRaceInfo' }];

export function App() {
  const [screen, setScreen] = useState({ name: 'title' });
  const go = (name, extra = {}) => setScreen({ name, ...extra });
  const startQuickRace = (trackId) => go('race', { trackId, setup: buildRaceSetup({ trackId }) });

  switch (screen.name) {
    case 'modes':
      return <ModeSelect modes={MODES} onPick={() => go('tracks')} onBack={() => go('title')} />;
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
