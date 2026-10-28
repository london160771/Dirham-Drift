import { t } from '../../i18n/strings.js';
import { formatAed } from '../format.js';

export function Aed({ amount }) {
  return <>{t('money.aed', { amount: formatAed(amount) })}</>;
}

export function Delta({ amount, owed = false }) {
  if (owed) return <span className="delta owed">▲ {t('money.owed', { amount: formatAed(amount) })}</span>;
  if (amount === 0) return <span className="delta">{t('money.aed', { amount: 0 })}</span>;
  if (amount > 0) return <span className="delta gain">▲ {t('money.plus', { amount: formatAed(amount) })}</span>;
  return <span className="delta loss">▼ {t('money.minus', { amount: formatAed(-amount) })}</span>;
}

export function SimplifiedNote() {
  return <p className="simplified">{t('money.simplified')}</p>;
}
