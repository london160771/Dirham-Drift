import { t } from '../../i18n/strings.js';

export function TitleScreen({ onPlay, onSettings }) {
  return (
    <div className="screen title-screen">
      <div className="title-glow" />
      <h1 className="logo">
        <span className="logo-gold">Dirham</span> Drift
      </h1>
      <p className="tagline">{t('app.tagline')}</p>
      <p className="flow">{t('app.flow')}</p>
      <div className="menu">
        <button type="button" className="btn primary big" onClick={onPlay} data-testid="play">
          {t('title.play')}
        </button>
        <button type="button" className="btn" onClick={onSettings}>
          {t('title.settings')}
        </button>
      </div>
    </div>
  );
}
