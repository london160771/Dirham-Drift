import { isDebtFree, loanOwed, netWorth, strikesToRepo } from '../../game/engine/index.js';
import { t } from '../../i18n/strings.js';
import { Aed } from './Money.jsx';
import { Term } from './Glossary.jsx';

export function MoneyBar({ state }) {
  const owed = loanOwed(state) + state.overdue;
  return (
    <div className="money-bar" data-testid="money-bar">
      <div className="net-worth">
        <span className="label">
          <Term id="netWorth" />
        </span>
        <strong data-testid="net-worth">
          <Aed amount={netWorth(state)} />
        </strong>
      </div>
      <div className="money-cell">
        <span className="label">{t('pit.cash')}</span>
        <strong data-testid="cash">
          <Aed amount={state.cash} />
        </strong>
      </div>
      <div className="money-cell">
        <span className="label">
          <Term id="savings" />
        </span>
        <strong>
          <Aed amount={state.savings} />
        </strong>
      </div>
      <div className={isDebtFree(state) ? 'money-cell' : 'money-cell danger'}>
        <span className="label">{t('pit.debt')}</span>
        <strong data-testid="owed">
          <Aed amount={owed} />
        </strong>
        {state.strikes > 0 && <span className="strikes">⚠ {t('pit.strikes', { count: state.strikes, max: strikesToRepo(state) })}</span>}
      </div>
    </div>
  );
}
