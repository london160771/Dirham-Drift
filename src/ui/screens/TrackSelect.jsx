import { TRACK_IDS } from '../../game/config/tracks/index.js';
import { t } from '../../i18n/strings.js';

export function TrackSelect({ onPick, onBack }) {
  return (
    <div className="screen panel-screen">
      <h2>{t('tracks.pick')}</h2>
      <div className="card-row">
        {TRACK_IDS.map((id) => (
          <button key={id} type="button" className={`card track-card ${id}`} onClick={() => onPick(id)} data-testid={`track-${id}`}>
            <strong>{t(`tracks.${id}`)}</strong>
            <span>{t(`tracks.${id}Info`)}</span>
          </button>
        ))}
      </div>
      <button type="button" className="btn" onClick={onBack}>
        {t('title.back')}
      </button>
    </div>
  );
}
