import { t } from '../../i18n/strings.js';
import { SceneArt } from '../art/SceneArt.jsx';
import { LanguageToggle } from './LanguageToggle.jsx';

export function TitleScreen({ onPlay, onHowTo, onSettings, onCredits, onInstall, installNote, onLanguage }) {
  return (
    <div className="screen title-screen">
      <SceneArt slot="title" className="backdrop" />
      <div className="title-glow" />
      <div className="title-corner">
        <LanguageToggle onChange={onLanguage} />
      </div>
      <h1 className="logo">
        <span className="logo-gold">Dirham</span> Drift
      </h1>
      <p className="tagline">{t('app.tagline')}</p>
      <p className="flow">{t('app.flow')}</p>
      <div className="menu">
        <button type="button" className="btn primary big" onClick={onPlay} data-testid="play">
          {t('title.play')}
        </button>
        <div className="menu row">
          <button type="button" className="btn" onClick={onHowTo} data-testid="open-how-to">
            {t('title.howTo')}
          </button>
          <button type="button" className="btn" onClick={onSettings} data-testid="open-settings">
            {t('title.settings')}
          </button>
          <button type="button" className="btn" onClick={onCredits} data-testid="open-credits">
            {t('title.credits')}
          </button>
          {onInstall && (
            <button type="button" className="btn" onClick={onInstall} data-testid="open-install">
              {t('title.install')}
            </button>
          )}
        </div>
        {installNote && onInstall && (
          <button type="button" className="install-note" onClick={onInstall} data-testid="install-note">
            {t('title.installNote')}
          </button>
        )}
      </div>
    </div>
  );
}
