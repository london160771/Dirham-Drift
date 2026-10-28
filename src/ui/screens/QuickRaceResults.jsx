import { t } from '../../i18n/strings.js';
import { formatTime } from '../format.js';

function carName(id) {
  if (id === 'player') return t('results.you');
  return t('results.rival', { number: id.replace('rival', '') });
}

export function QuickRaceResults({ results, onAgain, onMenu }) {
  return (
    <div className="screen panel-screen" data-testid="results">
      <h2>{t('results.title')}</h2>
      <p className="result-headline">{t('results.position', { position: results.position, total: results.finishOrder.length })}</p>
      <div className="result-stats">
        <span>{t('results.time', { time: formatTime(results.timeMs) })}</span>
        <span>{t('results.damage', { value: results.damage })}</span>
        <span>{t('results.hits', { value: results.hits })}</span>
      </div>
      <ol className="finish-order" aria-label={t('results.order')}>
        {results.finishOrder.map((id, i) => (
          <li key={id} className={id === 'player' ? 'me' : ''}>
            <b>{i + 1}</b> {carName(id)}
          </li>
        ))}
      </ol>
      <div className="menu">
        <button type="button" className="btn primary" onClick={onAgain} data-testid="again">
          {t('results.again')}
        </button>
        <button type="button" className="btn" onClick={onMenu}>
          {t('results.menu')}
        </button>
      </div>
    </div>
  );
}
