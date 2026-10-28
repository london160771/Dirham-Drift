import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import { applySettings } from './ui/applySettings.js';
import { loadSettings } from './ui/storage/settingsStore.js';
import { installUiSounds } from './ui/uiSounds.js';
import './styles/base.css';
import './styles/race.css';
import './styles/pit.css';
import './styles/season.css';
import './styles/polish.css';

const settings = loadSettings();
applySettings(settings);
installUiSounds(settings);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
