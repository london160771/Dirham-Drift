import { t } from '../../i18n/strings.js';

export function ModeSelect({ modes, onPick, onBack }) {
  return (
    <div className="screen panel-screen">
      <h2>{t('modes.title')}</h2>
      <div className="card-row">
        {modes.map((mode) => (
          <button key={mode.id} type="button" className="card" onClick={() => onPick(mode.id)} data-testid={`mode-${mode.id}`}>
            <strong>{t(mode.title)}</strong>
            <span>{t(mode.info)}</span>
          </button>
        ))}
      </div>
      <button type="button" className="btn" onClick={onBack}>
        {t('title.back')}
      </button>
    </div>
  );
}
