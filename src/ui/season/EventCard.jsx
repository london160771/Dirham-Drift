import { eventChoices } from '../../game/engine/index.js';
import { t } from '../../i18n/strings.js';
import { formatAed } from '../format.js';
import { Delta } from './Money.jsx';
import { SceneArt } from '../art/SceneArt.jsx';
import { RichText } from './RichText.jsx';
import { EVENT_VARS, RED_FLAGS } from './eventText.js';

function RedFlags() {
  return (
    <div className="red-flags" data-testid="red-flags">
      <strong>
        ⚑ {t('events.redFlags')} · <RichText text={t('events.redFlagsInfo')} />
      </strong>
      <ul>
        {RED_FLAGS.map((flag) => (
          <li key={flag}>✗ {t(`events.${flag}`)}</li>
        ))}
      </ul>
    </div>
  );
}

function Choice({ eventId, choice, onPick }) {
  return (
    <button type="button" className="choice" disabled={!choice.allowed} onClick={onPick} data-testid={`choice-${choice.id}`}>
      <strong>{t(`events.${eventId}_${choice.id}`)}</strong>
      {choice.cash !== 0 && <Delta amount={choice.cash} />}
      {choice.risk && <span className="delta loss">⚠ {t('events.sponsorRisk', { amount: formatAed(-choice.risk) })}</span>}
      {!choice.allowed && <span className="muted">{t('events.notEnough')}</span>}
    </button>
  );
}

export function EventCard({ state, dispatch }) {
  const eventId = state.pendingEvent;
  const scam = eventId === 'desertGold';
  return (
    <div className="screen pit-screen" data-testid="event-card">
      <div className={scam ? 'event-card scam' : 'event-card'}>
        {scam && <SceneArt slot="scamAd" className="scam-ad" />}
        <h2>{t(`events.${eventId}`)}</h2>
        <p>{t(`events.${eventId}Body`, EVENT_VARS[eventId])}</p>
        {scam && <RedFlags />}
        <div className="choices">
          {eventChoices(state, eventId).map((choice) => (
            <Choice key={choice.id} eventId={eventId} choice={choice} onPick={() => dispatch({ type: 'chooseEvent', choiceId: choice.id })} />
          ))}
        </div>
      </div>
    </div>
  );
}
