import { UPGRADES } from '../config/economy.js';
import { record } from './ledger.js';
import { EngineError, percentOf } from './money.js';

export function levelOf(state, slot) {
  return state.upgrades.filter((u) => u.slot === slot).length;
}

export function nextUpgradePrice(state, slot) {
  const level = levelOf(state, slot);
  return level < UPGRADES.maxLevel ? UPGRADES.prices[level] : null;
}

export function buyUpgrade(state, slot) {
  if (!UPGRADES.slots.includes(slot)) throw new EngineError('unknown_slot', `No upgrade slot ${slot}`);
  const price = nextUpgradePrice(state, slot);
  if (price === null) throw new EngineError('max_level', `${slot} is already at the top level`);
  if (state.cash < price) throw new EngineError('cannot_afford', `${slot} costs ${price}`);
  const next = record(state, { kind: 'upgrade', cash: -price, item: slot });
  return { ...next, upgrades: [...next.upgrades, { slot, level: levelOf(state, slot) + 1, price }] };
}

export function repossessNewest(state) {
  if (state.upgrades.length === 0) return state;
  const taken = state.upgrades[state.upgrades.length - 1];
  const next = record(state, { kind: 'repossessed', item: taken.slot, value: taken.price });
  return { ...next, upgrades: next.upgrades.slice(0, -1), lastRepo: taken };
}

export function carValue(state) {
  return percentOf(
    state.upgrades.reduce((sum, u) => sum + u.price, 0),
    UPGRADES.carValuePercent,
  );
}

export function carStats(state) {
  return {
    engine: levelOf(state, 'engine'),
    tyres: levelOf(state, 'tyres'),
    nitro: levelOf(state, 'nitro'),
    damage: state.damage,
  };
}
