import { LESSON_IDS, isDebtFree, netWorth } from '../../game/engine/index.js';
import { t } from '../../i18n/strings.js';
import { formatAed } from '../format.js';

export function SeasonOver({ state, onExit }) {
  return (
    <div className="screen pit-screen" data-testid="season-over">
      <h2>{t('season.overTitle')}</h2>
      <p className="result-headline">{t('season.netWorth', { amount: formatAed(netWorth(state)) })}</p>
      <p className={isDebtFree(state) ? 'note' : 'danger-text'}>{isDebtFree(state) ? `✓ ${t('season.debtFree')}` : `⚠ ${t('season.inDebt')}`}</p>
      <p>{t('season.lessonsMet', { count: state.lessonsMet.length, total: LESSON_IDS.length })}</p>
      <p className="muted">{t('season.recapSoon')}</p>
      <button type="button" className="btn primary" onClick={onExit}>
        {t('season.menu')}
      </button>
    </div>
  );
}
