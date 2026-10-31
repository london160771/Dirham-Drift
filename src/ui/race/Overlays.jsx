import { t } from '../../i18n/strings.js';

export function RotateOverlay() {
  return (
    <div className="overlay rotate rotate-gate" data-testid="rotate" role="alertdialog" aria-modal="true">
      <div className="rotate-icon">⟳</div>
      <h2>{t('rotate.title')}</h2>
      <p>{t('rotate.body')}</p>
    </div>
  );
}

export function PauseOverlay({ onResume, onHowTo, onQuit }) {
  return (
    <div className="overlay" data-testid="pause">
      <h2>{t('pause.title')}</h2>
      <button type="button" className="btn primary" onClick={onResume}>
        {t('pause.resume')}
      </button>
      <button type="button" className="btn" onClick={onHowTo} data-testid="pause-how-to">
        {t('title.howTo')}
      </button>
      <button type="button" className="btn" onClick={onQuit}>
        {t('pause.quit')}
      </button>
    </div>
  );
}
