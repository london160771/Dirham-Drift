import { useState } from 'react';
import { t } from '../../i18n/strings.js';
import { HOW_TO_CARDS, HOW_TO_SECTIONS } from './howToPlayCards.js';

export function HowToPlay({ onBack, overlay = false }) {
  const [section, setSection] = useState(HOW_TO_SECTIONS[0]);
  return (
    <div className={overlay ? 'screen how-to overlay-screen' : 'screen how-to'} data-testid="how-to-play">
      <header className="how-to-head">
        <h2>{t('howTo.title')}</h2>
        <button type="button" className="btn small-btn" onClick={onBack} data-testid="how-to-back">
          {t('title.back')}
        </button>
      </header>
      <nav className="pit-tabs">
        {HOW_TO_SECTIONS.map((id) => (
          <button key={id} type="button" className={id === section ? 'tab on' : 'tab'} onClick={() => setSection(id)} data-testid={`how-${id}`}>
            {t(`howTo.${id}`)}
          </button>
        ))}
      </nav>
      <div className="how-to-cards">
        {HOW_TO_CARDS[section].map((card) => (
          <article key={card.id} className="how-card" data-testid={`how-card-${card.id}`}>
            <strong>{t(`howTo.${section}_${card.id}`)}</strong>
            <p>{t(`howTo.${section}_${card.id}Body`, card.vars)}</p>
          </article>
        ))}
      </div>
      <p className="simplified">{t('money.simplified')}</p>
    </div>
  );
}
