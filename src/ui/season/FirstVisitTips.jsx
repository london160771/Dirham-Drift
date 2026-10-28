import { t } from '../../i18n/strings.js';

const TIPS = ['tipGarage', 'tipBank', 'tipNetWorth'];

export function FirstVisitTips({ onClose }) {
  return (
    <div className="modal-backdrop" data-testid="pit-tips">
      <div className="modal" role="dialog">
        <h2>{t('pit.tipsTitle')}</h2>
        <ol className="tips">
          {TIPS.map((tip) => (
            <li key={tip}>{t(`pit.${tip}`)}</li>
          ))}
        </ol>
        <button type="button" className="btn primary" onClick={onClose} data-testid="tips-ok">
          {t('pit.gotIt')}
        </button>
      </div>
    </div>
  );
}
