import { INSURANCE, REPAIR } from '../config/economy.js';
import { meetLesson } from './lessons.js';
import { EngineError, percentOf } from './money.js';
import { payRequired } from './payments.js';

export function repairCost(damage) {
  return damage > 0 ? REPAIR.base + damage * REPAIR.perDamagePoint : 0;
}

export function repairBill(state) {
  const cost = repairCost(state.damage);
  return state.damageInsured ? percentOf(cost, 100 - INSURANCE.coversPercent) : cost;
}

export function trackDamage(state, newDamage) {
  if (newDamage === state.damage) return state;
  const insured = state.insured && (state.damage === 0 || state.damageInsured);
  return { ...state, damage: newDamage, damageInsured: insured };
}

export function repair(state) {
  if (state.damage === 0) throw new EngineError('no_damage', 'Nothing to repair');
  const cost = repairCost(state.damage);
  const bill = repairBill(state);
  const { state: paid, paid: ok } = payRequired(state, 'repair', bill);
  if (!ok) throw new EngineError('cannot_afford', `Repair costs ${bill}`);
  const saved = state.damageInsured ? cost - bill : percentOf(cost, INSURANCE.coversPercent);
  return meetLesson({ ...paid, damage: 0, damageInsured: false }, 'insurance', saved);
}
