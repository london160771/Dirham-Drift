import { useState } from 'react';
import { BANK_CHIPS } from '../../game/config/economy.js';
import { t } from '../../i18n/strings.js';
import { formatAed } from '../format.js';

function wholeAed(text) {
  const digits = text.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

export function AmountChips({ label, action, max, onConfirm, testId }) {
  const [amount, setAmount] = useState(0);
  const valid = amount > 0 && amount <= max;
  const confirm = () => {
    onConfirm(amount);
    setAmount(0);
  };
  return (
    <div className="chips" data-testid={testId}>
      <span className="chips-label">{label}</span>
      {BANK_CHIPS.map((chip) => (
        <button key={chip} type="button" className={chip === amount ? 'chip on' : 'chip'} disabled={chip > max} onClick={() => setAmount(chip)}>
          {formatAed(chip)}
        </button>
      ))}
      <button type="button" className="chip" disabled={max <= 0} onClick={() => setAmount(max)} data-testid={`${testId}-all`}>
        {t('bank.all')}
      </button>
      <div className="amount-row">
        <input
          className="amount-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label={`${label} · ${t('bank.amount')}`}
          placeholder={t('bank.amount')}
          value={amount ? formatAed(amount) : ''}
          onChange={(event) => setAmount(wholeAed(event.target.value))}
          data-testid={`${testId}-amount`}
        />
        <button type="button" className="btn small-btn primary" disabled={!valid} onClick={confirm} data-testid={`${testId}-go`}>
          {action}
        </button>
      </div>
    </div>
  );
}
