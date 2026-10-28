import { useMemo } from 'react';
import { INSURANCE, UPGRADES } from '../../game/config/economy.js';
import { carStats, carValue, levelOf, nextUpgradePrice, repairBill } from '../../game/engine/index.js';
import { t } from '../../i18n/strings.js';
import { formatAed } from '../format.js';
import { SceneArt } from '../art/SceneArt.jsx';
import { CarPreview } from './CarPreview.jsx';
import { Aed } from './Money.jsx';

function Pips({ level }) {
  return (
    <span className="pips" aria-label={t('garage.level', { level, max: UPGRADES.maxLevel })}>
      {Array.from({ length: UPGRADES.maxLevel }, (_, i) => (
        <i key={i} className={i < level ? 'on' : ''} />
      ))}
    </span>
  );
}

function Slot({ state, slot, dispatch }) {
  const level = levelOf(state, slot);
  const price = nextUpgradePrice(state, slot);
  return (
    <div className="slot" data-testid={`slot-${slot}`}>
      <div className="slot-name">
        <strong>{t(`garage.${slot}`)}</strong>
        <span className="muted">{t(`garage.${slot}Info`)}</span>
      </div>
      <Pips level={level} />
      {price === null ? (
        <span className="maxed">{t('garage.maxed')}</span>
      ) : (
        <button type="button" className="btn primary" disabled={state.cash < price} onClick={() => dispatch({ type: 'buyUpgrade', slot })} data-testid={`buy-${slot}`}>
          {t('garage.buy', { amount: formatAed(price) })}
        </button>
      )}
    </div>
  );
}

function Repairs({ state, dispatch }) {
  if (state.damage === 0) return <p className="muted">{t('garage.noDamage')}</p>;
  const bill = repairBill(state);
  return (
    <div className="slot danger-row">
      <div className="slot-name">
        <strong>{t('garage.repairCost', { damage: state.damage })}</strong>
        <span className="muted">{state.damageInsured ? t('garage.insuredRepair', { percent: INSURANCE.coversPercent }) : t('garage.raceDamaged')}</span>
      </div>
      <button type="button" className="btn" disabled={state.cash + state.savings < bill} onClick={() => dispatch({ type: 'repair' })} data-testid="garage-repair">
        {t('garage.repair', { amount: formatAed(bill) })}
      </button>
    </div>
  );
}

export function Garage({ state, dispatch }) {
  const stats = carStats(state);
  const levels = useMemo(() => ({ engine: stats.engine, tyres: stats.tyres, nitro: stats.nitro }), [stats.engine, stats.tyres, stats.nitro]);
  return (
    <div className="garage" data-testid="garage">
      <div className="lift">
        <SceneArt slot="garage" className="backdrop" />
        <CarPreview levels={levels} />
        <span className="muted">
          {t('garage.carValue')} <Aed amount={carValue(state)} />
        </span>
      </div>
      <div className="slots">
        {UPGRADES.slots.map((slot) => (
          <Slot key={slot} state={state} slot={slot} dispatch={dispatch} />
        ))}
        <Repairs state={state} dispatch={dispatch} />
      </div>
    </div>
  );
}
