import { useState } from 'react';
import { t } from '../../i18n/strings.js';
import { loadSettings, updateSettings } from '../storage/settingsStore.js';

export function SettingsScreen({ onBack }) {
  const [settings, setSettings] = useState(loadSettings);
  const [hintNote, setHintNote] = useState(false);
  const toggleFps = () => setSettings(updateSettings({ showFps: !settings.showFps }));
  const resetHints = () => {
    setSettings(updateSettings({ hintsSeen: false }));
    setHintNote(true);
  };
  return (
    <div className="screen panel-screen">
      <h2>{t('settings.title')}</h2>
      <div className="setting-row">
        <span>{t('settings.showFps')}</span>
        <button type="button" className={settings.showFps ? 'btn toggle on' : 'btn toggle'} onClick={toggleFps} data-testid="toggle-fps">
          {settings.showFps ? t('settings.on') : t('settings.off')}
        </button>
      </div>
      <div className="setting-row">
        <span>{t('settings.resetHints')}</span>
        <button type="button" className="btn" onClick={resetHints}>
          ↺
        </button>
      </div>
      {hintNote && <p className="note">{t('settings.hintsReset')}</p>}
      <button type="button" className="btn" onClick={onBack}>
        {t('title.back')}
      </button>
    </div>
  );
}
