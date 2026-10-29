import { SAVINGS } from '../../../game/config/economy.js';
import { t } from '../../../i18n/strings.js';
import { AmountChips } from '../AmountChips.jsx';
import { Term } from '../Glossary.jsx';
import { Aed } from '../Money.jsx';

export function SavingsSection({ state, dispatch }) {
  return (
    <section className="bank-section teal" data-testid="bank-savings">
      <h3>
        <Term id="savings" /> · <Aed amount={state.savings} />
      </h3>
      <p className="muted">{t('bank.savingsInfo', { percent: SAVINGS.growthPercent })}</p>
      <AmountChips label={t('bank.deposit')} action={t('bank.deposit')} max={state.cash} onConfirm={(amount) => dispatch({ type: 'deposit', amount })} testId="deposit" />
      <AmountChips label={t('bank.withdraw')} action={t('bank.withdraw')} max={state.savings} onConfirm={(amount) => dispatch({ type: 'withdraw', amount })} testId="withdraw" />
    </section>
  );
}
