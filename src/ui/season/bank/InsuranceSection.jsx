import { INSURANCE } from '../../../game/config/economy.js';
import { t } from '../../../i18n/strings.js';
import { formatAed } from '../../format.js';
import { Term } from '../Glossary.jsx';
import { RichText } from '../RichText.jsx';

export function InsuranceSection({ state, dispatch }) {
  return (
    <section className="bank-section teal" data-testid="bank-insurance">
      <h3>
        <Term id="insurance" />
      </h3>
      <p className="muted">
        <RichText text={t('bank.insuranceInfo', { premium: formatAed(INSURANCE.premium), percent: INSURANCE.coversPercent })} />
      </p>
      <button
        type="button"
        className={state.insured ? 'btn toggle on' : 'btn toggle'}
        onClick={() => dispatch({ type: 'setInsurance', on: !state.insured })}
        data-testid="toggle-insurance"
      >
        {state.insured ? `✓ ${t('bank.insuranceOn')}` : t('bank.insuranceOff')}
      </button>
      <p className="tap-hint" data-testid="insurance-hint">
        {t(state.insured ? 'bank.insuranceTapOff' : 'bank.insuranceTapOn')}
      </p>
    </section>
  );
}
