import { useState } from 'react';
import { SIZE_STEPS, VOLUME } from '../../game/config/settings.js';
import { audio } from '../../game/audio/audio.js';
import { t } from '../../i18n/strings.js';
import { applySettings } from '../applySettings.js';
import { loadSettings, updateSettings } from '../storage/settingsStore.js';
import { LanguageToggle } from './LanguageToggle.jsx';

const TOGGLES = ['steeringAssist', 'autoAccelerate', 'chillMode', 'colorBlind', 'reduceMotion', 'leftHanded', 'vibration', 'showFps'];
const VOLUMES = ['musicVolume', 'effectsVolume'];
const SIZES = ['textSize', 'controlSize'];

function Toggle({ id, value, onChange }) {
  return (
    <div className="setting-row">
      <span>
        <strong>{t(`settings.${id}`)}</strong>
        <em className="muted small">{t(`settings.${id}Info`)}</em>
      </span>
      <button type="button" className={value ? 'btn toggle on' : 'btn toggle'} aria-pressed={value} onClick={() => onChange(!value)} data-testid={`toggle-${id}`}>
        {value ? t('settings.on') : t('settings.off')}
      </button>
    </div>
  );
}

function Choice({ id, value, onChange }) {
  return (
    <div className="setting-row">
      <strong>{t(`settings.${id}`)}</strong>
      <div className="segmented">
        {Object.keys(SIZE_STEPS[id]).map((size) => (
          <button key={size} type="button" className={size === value ? 'chip on' : 'chip'} aria-pressed={size === value} onClick={() => onChange(size)} data-testid={`${id}-${size}`}>
            {t(`settings.size${size}`)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Volume({ id, value, onChange }) {
  return (
    <label className="setting-row">
      <strong>{t(`settings.${id}`)}</strong>
      <span className="volume">
        <input type="range" min="0" max={VOLUME.max} step={VOLUME.step} value={value} onChange={(e) => onChange(Number(e.target.value))} data-testid={`range-${id}`} />
        <output>{value === 0 ? t('settings.off') : `${value}%`}</output>
      </span>
    </label>
  );
}

export function SettingsScreen({ onBack, onLanguage }) {
  const [settings, setSettings] = useState(loadSettings);
  const [hintNote, setHintNote] = useState(false);
  const change = (patch) => {
    const next = updateSettings(patch);
    applySettings(next);
    audio.setVolumes(next);
    setSettings(next);
  };
  const resetHints = () => {
    change({ hintsSeen: false, pitTipsSeen: false });
    setHintNote(true);
  };
  return (
    <div className="screen settings-screen" data-testid="settings">
      <header className="how-to-head">
        <h2>{t('settings.title')}</h2>
        <button type="button" className="btn small-btn" onClick={onBack}>
          {t('title.back')}
        </button>
      </header>
      <div className="settings-grid">
        <section>
          <div className="setting-row">
            <strong>{t('settings.language')}</strong>
            <LanguageToggle onChange={onLanguage} />
          </div>
          <h3>{t('settings.sound')}</h3>
          {VOLUMES.map((id) => (
            <Volume key={id} id={id} value={settings[id]} onChange={(value) => change({ [id]: value })} />
          ))}
          <h3>{t('settings.display')}</h3>
          {SIZES.map((id) => (
            <Choice key={id} id={id} value={settings[id]} onChange={(value) => change({ [id]: value })} />
          ))}
        </section>
        <section>
          <h3>{t('settings.driving')}</h3>
          {TOGGLES.map((id) => (
            <Toggle key={id} id={id} value={settings[id]} onChange={(value) => change({ [id]: value })} />
          ))}
          <div className="setting-row">
            <strong>{t('settings.resetHints')}</strong>
            <button type="button" className="btn" onClick={resetHints} data-testid="reset-hints">
              ↺
            </button>
          </div>
          {hintNote && <p className="note">{t('settings.hintsReset')}</p>}
        </section>
      </div>
    </div>
  );
}
