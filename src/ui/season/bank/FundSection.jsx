import { INDEX_FUND } from '../../../game/config/economy.js';
import { t } from '../../../i18n/strings.js';
import { formatAed } from '../../format.js';
import { AmountChips } from '../AmountChips.jsx';
import { RichText } from '../RichText.jsx';

export function FundSection({ state, dispatch }) {
  return (
    <section className="bank-section" data-testid="bank-fund">
      <h3>
        {t('bank.fundTitle')} · {t('bank.fundValue', { amount: formatAed(state.fundValue) })}
      </h3>
      <p className="muted">
        <RichText text={t('bank.fundInfo', { min: INDEX_FUND.minChangePercent, max: INDEX_FUND.maxChangePercent })} />
      </p>
      <AmountChips label={t('bank.invest')} max={state.cash} onPick={(amount) => dispatch({ type: 'investFund', amount })} testId="invest" />
      <AmountChips label={t('bank.sell')} max={state.fundValue} onPick={(amount) => dispatch({ type: 'sellFund', amount })} testId="sell" />
    </section>
  );
}
