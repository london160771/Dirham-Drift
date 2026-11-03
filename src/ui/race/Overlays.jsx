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

export function PauseOverlay({ onResume, onRestart, onHowTo, onQuit }) {
  return (
    <div className="overlay" data-testid="pause">
      <h2>{t('pause.title')}</h2>
      <button type="button" className="btn primary" onClick={onResume}>
        {t('pause.resume')}
      </button>
      {onRestart && (
        <button type="button" className="btn" onClick={onRestart} data-testid="pause-restart">
          {t('pause.restart')}
        </button>
      )}
      <button type="button" className="btn" onClick={onHowTo} data-testid="pause-how-to">
        {t('title.howTo')}
      </button>
      <button type="button" className="btn" onClick={onQuit}>
        {t('pause.quit')}
      </button>
    </div>
  );
}

export function TiltNote({ onRetry }) {
  return (
    <div className="tilt-note" data-testid="tilt-note" role="status">
      <span>{t('controls.tiltFailed')}</span>
      <button type="button" className="btn small-btn" onClick={onRetry} data-testid="tilt-retry">
        {t('controls.tiltRetry')}
      </button>
    </div>
  );
}
