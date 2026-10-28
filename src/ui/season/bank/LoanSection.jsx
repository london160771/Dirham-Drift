import { LATE_PAYMENT } from '../../../game/config/economy.js';
import { loanOffers, loanOwed, strikesToRepo } from '../../../game/engine/index.js';
import { t } from '../../../i18n/strings.js';
import { formatAed } from '../../format.js';
import { Aed } from '../Money.jsx';
import { RichText } from '../RichText.jsx';

function Offer({ offer, disabled, dispatch }) {
  return (
    <div className="offer" data-testid={`offer-${offer.id}`}>
      <strong>{t(offer.id === 'quick' ? 'bank.loanQuick' : 'bank.loanBig')}</strong>
      <dl>
        <dt>{t('bank.borrow')}</dt>
        <dd className="gain">
          <Aed amount={offer.borrow} />
        </dd>
        <dt>{t('bank.perRace')}</dt>
        <dd>
          <Aed amount={offer.perRace} />
        </dd>
        <dt>{t('bank.races')}</dt>
        <dd>{offer.races}</dd>
        <dt>{t('bank.total')}</dt>
        <dd className="total" data-testid={`total-${offer.id}`}>
          <Aed amount={offer.total} />
        </dd>
        <dt>{t('bank.extra')}</dt>
        <dd className="loss">
          <Aed amount={offer.cost} />
        </dd>
      </dl>
      <button type="button" className="btn primary" disabled={disabled} onClick={() => dispatch({ type: 'takeLoan', loanId: offer.id })} data-testid={`take-${offer.id}`}>
        {t('bank.accept')}
      </button>
    </div>
  );
}

function ActiveLoan({ state }) {
  return (
    <p className="active-loan" data-testid="active-loan">
      <RichText text={t('bank.activeLoan', { left: formatAed(loanOwed(state)), perRace: formatAed(state.loan.perRace), races: state.loan.racesLeft })} />
    </p>
  );
}

export function LoanSection({ state, dispatch }) {
  return (
    <section className="bank-section wide" data-testid="bank-loans">
      <h3>{t('bank.loansTitle')}</h3>
      {state.loan && <ActiveLoan state={state} />}
      {state.overdue > 0 && <p className="danger-text">⚠ {t('bank.overdue', { amount: formatAed(state.overdue) })}</p>}
      <div className="offers">
        {loanOffers().map((offer) => (
          <Offer key={offer.id} offer={offer} disabled={Boolean(state.loan)} dispatch={dispatch} />
        ))}
      </div>
      {state.loan && <p className="muted">{t('bank.oneLoan')}</p>}
      <p className="muted small">
        <RichText text={t('bank.extraInfo')} /> <RichText text={t('bank.repoWarning', { fee: formatAed(LATE_PAYMENT.fee), strikes: strikesToRepo(state) })} />
      </p>
    </section>
  );
}
