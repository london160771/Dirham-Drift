import { useState } from 'react';
import { RaceScreen } from './ui/race/RaceScreen.jsx';
import { buildRaceSetup } from './ui/raceSetup.js';
import { SettingsScreen } from './ui/screens/SettingsScreen.jsx';
import { TitleScreen } from './ui/screens/TitleScreen.jsx';

export function App() {
  const [screen, setScreen] = useState({ name: 'title' });
  const toTitle = () => setScreen({ name: 'title' });
  if (screen.name === 'race') {
    return <RaceScreen setup={screen.setup} onFinish={toTitle} onQuit={toTitle} />;
  }
  if (screen.name === 'settings') return <SettingsScreen onBack={toTitle} />;
  return (
    <TitleScreen
      onPlay={() => setScreen({ name: 'race', setup: buildRaceSetup({ trackId: 'marina' }) })}
      onSettings={() => setScreen({ name: 'settings' })}
    />
  );
}
