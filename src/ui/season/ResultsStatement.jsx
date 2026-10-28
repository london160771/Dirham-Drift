import { RACE } from '../../game/config/race.js';
import { INSURANCE } from '../../game/config/economy.js';
import { repairBill } from '../../game/engine/index.js';
import { t } from '../../i18n/strings.js';
import { formatAed } from '../format.js';
import { Aed, Delta } from './Money.jsx';
import { statementLines } from './statement.js';

function lineLabel(line) {
  if (line.kind === 'fundMove') return t('statement.fundMove', { percent: line.percent > 0 ? `+${line.percent}` : line.percent });
  if (line.kind === 'repossessed') return t('statement.repossessed', { item: t(`garage.${line.item}`) });
  return t(`statement.${line.kind}`);
}

function LineAmount({ line }) {
  if (line.notice) return null;
  if (line.owed > 0) return <Delta amount={line.owed} owed />;
  return <Delta amount={line.amount} />;
}

function RepairChoice({ state, dispatch }) {
  if (state.damage === 0) return null;
  const bill = repairBill(state);
  const canPay = state.cash + state.savings >= bill;
  return (
    <div className="repair-choice" data-testid="repair-choice">
      <strong>{t('statement.repairTitle')}</strong>
      <span>{t('statement.damageNow', { value: state.damage })}</span>
      {state.damageInsured && <span className="note">{t('garage.insuredRepair', { percent: INSURANCE.coversPercent })}</span>}
      <div className="menu">
        <button type="button" className="btn primary" disabled={!canPay} onClick={() => dispatch({ type: 'repair' })} data-testid="repair">
          {t('garage.repair', { amount: formatAed(bill) })}
        </button>
        <button type="button" className="btn" onClick={() => dispatch({ type: 'continue' })} data-testid="race-damaged">
          {t('statement.raceDamaged')}
        </button>
      </div>
    </div>
  );
}

export function ResultsStatement({ state, dispatch, from }) {
  const results = state.lastResults;
  const lines = statementLines(state, from);
  return (
    <div className="screen pit-screen statement-screen" data-testid="statement">
      <h2>{t('statement.title')}</h2>
      <p className="result-headline">
        {results.retired ? t('pit.retired') : t('statement.finished', { position: results.position, total: RACE.carCount })}
      </p>
      <ul className="statement">
        {lines.length === 0 && <li className="muted">{t('statement.noChanges')}</li>}
        {lines.map((line) => (
          <li key={line.id} className={line.notice ? `line notice ${line.kind}` : 'line'} data-testid={`line-${line.kind}`}>
            <span>
              {lineLabel(line)}
              {line.fromSavings > 0 && <em> · {t('money.fromSavings')}</em>}
            </span>
            <LineAmount line={line} />
          </li>
        ))}
        <li className="line total">
          <span>{t('statement.balance')}</span>
          <strong>
            <Aed amount={state.cash} />
          </strong>
        </li>
      </ul>
      <RepairChoice state={state} dispatch={dispatch} />
      {state.damage === 0 && (
        <button type="button" className="btn primary big" onClick={() => dispatch({ type: 'continue' })} data-testid="continue">
          {t('statement.continue')}
        </button>
      )}
    </div>
  );
}
