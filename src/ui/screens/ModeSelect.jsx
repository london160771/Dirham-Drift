import { t } from '../../i18n/strings.js';

export function ModeSelect({ modes, onPick, onBack, onHome }) {
  return (
    <div className="screen panel-screen">
      <h2>{t('modes.title')}</h2>
      <div className="card-row">
        {modes.map((mode) => (
          <button key={mode.id} type="button" className={mode.featured ? 'card featured' : 'card'} onClick={() => onPick(mode.id)} data-testid={`mode-${mode.id}`}>
            <strong>{t(mode.title)}</strong>
            <span>{t(mode.info, mode.vars)}</span>
          </button>
        ))}
      </div>
      <div className="menu row">
        <button type="button" className="btn" onClick={onBack} data-testid="menu-back">
          {t('title.back')}
        </button>
        <button type="button" className="btn" onClick={onHome} data-testid="menu-home">
          {t('title.home')}
        </button>
      </div>
    </div>
  );
}
