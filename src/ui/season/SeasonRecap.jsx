import { useMemo } from 'react';
import { ZAKAT } from '../../game/config/economy.js';
import { LESSON_IDS, recapSummary } from '../../game/engine/index.js';
import { t } from '../../i18n/strings.js';
import { formatAed } from '../format.js';
import { Aed, aedText } from './Money.jsx';

function Breakdown({ recap }) {
  const rows = [
    ['pit.cash', recap.cash],
    ['pit.savings', recap.savings],
    ['recap.fund', recap.fund],
    ['garage.carValue', recap.carValue],
  ];
  return (
    <dl className="recap-breakdown" data-testid="recap-breakdown">
      {rows.map(([key, amount]) => (
        <div key={key}>
          <dt>{t(key)}</dt>
          <dd>
            <Aed amount={amount} />
          </dd>
        </div>
      ))}
      <div className={recap.owed > 0 ? 'owed' : ''}>
        <dt>{t('pit.debt')}</dt>
        <dd data-testid="recap-owed">− {t('money.aed', { amount: formatAed(recap.owed) })}</dd>
      </div>
    </dl>
  );
}

function WhatIf({ saver }) {
  const key = saver.difference > 0 ? 'recap.whatIfMore' : saver.difference < 0 ? 'recap.whatIfLess' : 'recap.whatIfSame';
  return (
    <section className="what-if" data-testid="what-if">
      <strong>{t('recap.whatIfTitle')}</strong>
      <p>{t('recap.whatIfBody', { money: aedText(saver.netWorth) })}</p>
      <p className={saver.difference > 0 ? 'danger-text' : 'note'}>{t(key, { amount: formatAed(Math.abs(saver.difference)) })}</p>
      <p className="muted small">{t('recap.whatIfHow')}</p>
    </section>
  );
}

function ZakatNote({ zakat }) {
  return (
    <section className="zakat-note" data-testid="zakat-note">
      <strong>{t('recap.zakatTitle')}</strong>
      <p>{t('recap.zakatBody', { percent: ZAKAT.perMille / 10, base: formatAed(zakat.base), amount: formatAed(zakat.amount) })}</p>
      <p className="muted small">{t('recap.zakatSimplified')}</p>
    </section>
  );
}

function Lessons({ met }) {
  return (
    <section className="recap-lessons" data-testid="recap-lessons">
      <strong>{t('season.lessonsMet', { count: met.length, total: LESSON_IDS.length })}</strong>
      <ul>
        {LESSON_IDS.map((id) => (
          <li key={id} className={met.includes(id) ? 'met' : 'locked'}>
            {met.includes(id) ? '✓' : '○'} {t(`lessons.${id}`)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SeasonRecap({ state, difficulty, onAgain, onExit }) {
  const recap = useMemo(() => recapSummary(state), [state]);
  return (
    <div className="screen pit-screen recap-screen" data-testid="recap">
      <span className="kicker">
        {t(`recap.mode_${state.mode}`)} · {t(`difficulty.${difficulty}`)}
      </span>
      <h2>{t('recap.title')}</h2>
      <div className="recap-top">
        <div className={`grade grade-${recap.grade}`} data-testid="grade" aria-label={t('recap.gradeLabel', { grade: recap.grade })}>
          {recap.grade}
        </div>
        <div className="recap-headline">
          <span className="muted">{t('pit.netWorth')}</span>
          <strong data-testid="recap-net-worth">
            <Aed amount={recap.netWorth} />
          </strong>
          <span className={recap.debtFree ? 'note' : 'danger-text'} data-testid="recap-debt">
            {recap.debtFree ? `✓ ${t('season.debtFree')}` : `⚠ ${t('season.inDebt')}`}
          </span>
          <span className="muted small">{t('recap.races', { races: recap.races, wins: recap.wins, podiums: recap.podiums })}</span>
        </div>
      </div>
      <div className="recap-grid">
        <Breakdown recap={recap} />
        <WhatIf saver={recap.saver} />
        <Lessons met={recap.lessonsMet} />
        <ZakatNote zakat={recap.zakat} />
      </div>
      <div className="menu row">
        <button type="button" className="btn primary" onClick={onAgain} data-testid="play-again">
          {t('recap.again')}
        </button>
        <button type="button" className="btn" onClick={onExit} data-testid="recap-menu">
          {t('season.menu')}
        </button>
      </div>
    </div>
  );
}
