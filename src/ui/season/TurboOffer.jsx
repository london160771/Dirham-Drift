import { INSURANCE, LOANS } from '../../game/config/economy.js';
import { levelOf, nextUpgradePrice, seasonPlan } from '../../game/engine/index.js';
import { t } from '../../i18n/strings.js';
import { formatAed } from '../format.js';

export function turboOfferFor(state) {
  const offer = seasonPlan(state.mode).turboOffer;
  if (!offer || state.raceIndex !== offer.afterRace) return null;
  const price = nextUpgradePrice(state, offer.slot);
  return price === null ? null : { slot: offer.slot, level: levelOf(state, offer.slot) + 1, price };
}

export function TurboOffer({ state, onTab }) {
  const offer = turboOfferFor(state);
  if (!offer) return null;
  const short = offer.price > state.cash;
  return (
    <section className="turbo-offer" data-testid="turbo-offer">
      <div className="turbo-text">
        <strong>{t('quick.turbo', { level: offer.level, amount: formatAed(offer.price) })}</strong>
        <span className={short ? 'danger-text' : 'muted'}>
          {t(short ? 'quick.turboShort' : 'quick.turboCash', { cash: formatAed(state.cash), gap: formatAed(Math.max(0, offer.price - state.cash)) })}
        </span>
        <span className="muted small">
          {t('quick.loanHint', { borrow: formatAed(LOANS.quick.borrow), total: formatAed(LOANS.quick.perRace * LOANS.quick.races) })} ·{' '}
          {t('quick.insuranceHint', { premium: formatAed(INSURANCE.premium), percent: INSURANCE.coversPercent })}
        </span>
      </div>
      <div className="turbo-actions">
        <button type="button" className="btn primary small-btn" onClick={() => onTab('bank')} data-testid="offer-bank">
          {t('quick.toBank')}
        </button>
        <button type="button" className="btn small-btn" onClick={() => onTab('garage')} data-testid="offer-garage">
          {t('quick.toGarage')}
        </button>
      </div>
    </section>
  );
}
