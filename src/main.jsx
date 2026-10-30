import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import { applyLanguage } from './ui/applyLanguage.js';
import { applySettings } from './ui/applySettings.js';
import { registerPwa } from './ui/pwa/registerSw.js';
import { loadSettings } from './ui/storage/settingsStore.js';
import { installUiSounds } from './ui/uiSounds.js';
import './styles/base.css';
import './styles/race.css';
import './styles/pit.css';
import './styles/season.css';
import './styles/polish.css';
import './styles/ghost.css';
import './styles/arabic.css';

const settings = loadSettings();
applySettings(settings);
applyLanguage(settings.language);
installUiSounds(settings);
registerPwa();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
