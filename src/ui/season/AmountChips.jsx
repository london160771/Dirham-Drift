import { BANK_CHIPS } from '../../game/config/economy.js';
import { t } from '../../i18n/strings.js';
import { formatAed } from '../format.js';

export function AmountChips({ label, max, onPick, testId }) {
  return (
    <div className="chips" data-testid={testId}>
      <span className="chips-label">{label}</span>
      {BANK_CHIPS.map((amount) => (
        <button key={amount} type="button" className="chip" disabled={amount > max} onClick={() => onPick(amount)}>
          {formatAed(amount)}
        </button>
      ))}
      <button type="button" className="chip" disabled={max <= 0} onClick={() => onPick(max)} data-testid={`${testId}-all`}>
        {t('bank.all')}
      </button>
    </div>
  );
}
