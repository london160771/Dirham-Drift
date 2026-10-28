import { t } from '../../i18n/strings.js';
import { CREDITS } from './creditsList.js';

export function CreditsScreen({ onBack }) {
  return (
    <div className="screen how-to" data-testid="credits">
      <header className="how-to-head">
        <h2>{t('credits.title')}</h2>
        <button type="button" className="btn small-btn" onClick={onBack}>
          {t('title.back')}
        </button>
      </header>
      <div className="how-to-cards credits-cards">
        {CREDITS.map((group) => (
          <article key={group.id} className="how-card" data-testid={`credits-${group.id}`}>
            <strong>{t(`credits.${group.id}`)}</strong>
            {group.items.map((item) => (
              <p key={item}>{t(`credits.${item}`)}</p>
            ))}
          </article>
        ))}
      </div>
    </div>
  );
}
