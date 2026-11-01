import { useState } from 'react';
import { SEASONS } from './game/config/season.js';
import { SEED_RANGE } from './game/config/race.js';
import { RotateOverlay } from './ui/race/Overlays.jsx';
import { RaceScreen } from './ui/race/RaceScreen.jsx';
import { useDevice } from './ui/race/useDevice.js';
import { buildRaceSetup } from './ui/raceSetup.js';
import { GhostFlow } from './ui/ghost/GhostFlow.jsx';
import { SeasonFlow } from './ui/season/SeasonFlow.jsx';
import { ModeSelect } from './ui/screens/ModeSelect.jsx';
import { modeCards } from './ui/screens/modes.js';
import { QuickRaceResults } from './ui/screens/QuickRaceResults.jsx';
import { CreditsScreen } from './ui/screens/CreditsScreen.jsx';
import { HowToPlay } from './ui/screens/HowToPlay.jsx';
import { InstallGuide } from './ui/screens/InstallGuide.jsx';
import { SettingsScreen } from './ui/screens/SettingsScreen.jsx';
import { TitleScreen } from './ui/screens/TitleScreen.jsx';
import { TrackSelect } from './ui/screens/TrackSelect.jsx';
import { loadCareer } from './ui/storage/seasonStore.js';
import { loadSettings, updateSettings } from './ui/storage/settingsStore.js';
import { getLanguage } from './i18n/strings.js';
import { currentPwaAllowed, isStandalone } from './ui/pwa/pwaHost.js';
import { showsUpdateBar } from './ui/pwa/appUpdate.js';
import { UpdateBar } from './ui/pwa/UpdateBar.jsx';

function newCareerSeed() {
  return Date.now() % SEED_RANGE;
}

export function App() {
  const [screen, setScreen] = useState({ name: 'title' });
  const device = useDevice();
  const [, setLanguage] = useState(getLanguage);
  const [menuBack, setMenuBack] = useState(null);
  const [difficulty, setDifficulty] = useState(() => loadSettings().difficulty);
  const pickDifficulty = (id) => setDifficulty(updateSettings({ difficulty: id }).difficulty);
  const go = (name, extra = {}) => setScreen({ name, ...extra });
  const goHome = () => {
    setMenuBack(null);
    go('title');
  };
  const leaveSeason = (resume) => {
    setMenuBack(resume && { name: 'season', mode: resume.state.mode, saved: { ...resume, seed: resume.state.seed }, run: Date.now() });
    go('modes');
  };
  const menuGoBack = () => {
    if (!menuBack) return goHome();
    setMenuBack(null);
    setScreen(menuBack);
  };
  const startQuickRace = (trackId) => go('race', { trackId, setup: buildRaceSetup({ trackId, difficulty }) });
  const startSeason = (mode, extra = {}) => go('season', { mode, seed: SEASONS.quick.seed, difficulty, run: Date.now(), ...extra });
  const pickMode = (id) => {
    setMenuBack(null);
    if (id === 'quickSeason') startSeason('quick');
    else if (id === 'career') startSeason('career', { seed: newCareerSeed() });
    else if (id === 'continue') startSeason('career', { saved: loadCareer() });
    else if (id === 'ghost') go('ghost');
    else go('tracks');
  };

  const view = () => {
    switch (screen.name) {
      case 'modes':
        return <ModeSelect modes={modeCards(loadCareer())} difficulty={difficulty} onDifficulty={pickDifficulty} onPick={pickMode} onBack={menuGoBack} onHome={goHome} />;
      case 'season':
        return (
          <SeasonFlow
            key={screen.run}
            mode={screen.mode}
            seed={screen.saved ? screen.saved.seed : screen.seed}
            saved={screen.saved}
            difficulty={screen.difficulty}
            onExit={leaveSeason}
            onAgain={() => pickMode(screen.mode === 'quick' ? 'quickSeason' : 'career')}
          />
        );
      case 'ghost':
        return <GhostFlow onExit={() => go('modes')} />;
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
        return <SettingsScreen onBack={() => go('title')} onLanguage={setLanguage} />;
      case 'howTo':
        return <HowToPlay onBack={() => go('title')} />;
      case 'credits':
        return <CreditsScreen onBack={() => go('title')} />;
      case 'install':
        return <InstallGuide onBack={() => go('title')} />;
      default:
        return (
          <TitleScreen
            onPlay={() => go('modes')}
            onHowTo={() => go('howTo')}
            onSettings={() => go('settings')}
            onCredits={() => go('credits')}
            onInstall={currentPwaAllowed() ? () => go('install') : null}
            installNote={currentPwaAllowed() && !isStandalone()}
            onLanguage={setLanguage}
          />
        );
    }
  };

  return (
    <>
      {view()}
      {showsUpdateBar(screen.name) && <UpdateBar />}
      {device.mustRotate && <RotateOverlay />}
    </>
  );
}
