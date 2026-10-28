import { availableRaces } from '../../game/engine/index.js';
import { t } from '../../i18n/strings.js';
import { Aed } from './Money.jsx';

function Fee({ amount }) {
  return amount > 0 ? <Aed amount={amount} /> : t('pit.free');
}

function RaceOption({ race, dispatch }) {
  const club = race.kind === 'club';
  return (
    <div className={club ? 'race-option club' : `race-option ${race.seasonStage}`} data-testid={`race-${race.kind}`}>
      <strong>{club ? t('pit.clubRace') : t(`pit.stage_${race.seasonStage}`)}</strong>
      <span>{t(`tracks.${race.track}`)}</span>
      <span className="muted">
        {t('pit.entryFee')}: <Fee amount={race.entryFee} /> · {t('pit.winPrize')}: <Aed amount={race.prizes[0]} />
      </span>
      {club && <span className="muted small">{t('pit.clubInfo')}</span>}
      <button type="button" className={club ? 'btn' : 'btn primary'} disabled={!race.allowed} onClick={() => dispatch({ type: 'chooseRace', kind: race.kind })} data-testid={`enter-${race.kind}`}>
        {t('pit.enter')}
      </button>
    </div>
  );
}

export function NextRace({ state, dispatch }) {
  const races = availableRaces(state);
  const blocked = races.some((race) => !race.allowed);
  return (
    <section className="next-race" data-testid="next-race">
      <h3>
        {t('pit.nextRace')} · {t('pit.raceOf', { current: state.raceIndex + 1, total: state.totalRaces })}
      </h3>
      <div className="race-options">
        {races.map((race) => (
          <RaceOption key={race.kind} race={race} dispatch={dispatch} />
        ))}
      </div>
      {blocked && <p className="danger-text small">{t('pit.cantAfford')}</p>}
    </section>
  );
}

export function PreRaceCard({ state, dispatch }) {
  const race = state.nextRace;
  return (
    <div className="modal-backdrop" data-testid="pre-race">
      <div className="modal" role="dialog">
        <span className="kicker">{race.kind === 'club' ? t('pit.clubRace') : t(`pit.stage_${race.seasonStage}`)}</span>
        <h2>{t(`tracks.${race.track}`)}</h2>
        <p className="muted">{t(`tracks.${race.track}Info`)}</p>
        <p>
          {t('pit.entryFee')}: <Fee amount={race.entryFee} /> · {t('pit.winPrize')}: <Aed amount={race.prizes[0]} />
        </p>
        {state.damage > 0 && <p className="danger-text">⚠ {t('pit.damage', { value: state.damage })}</p>}
        <div className="menu">
          <button type="button" className="btn primary big" onClick={() => dispatch({ type: 'startRace' })} data-testid="start-race">
            {t('pit.start')}
          </button>
          <button type="button" className="btn" onClick={() => dispatch({ type: 'cancelRace' })}>
            {t('pit.back')}
          </button>
        </div>
      </div>
    </div>
  );
}
