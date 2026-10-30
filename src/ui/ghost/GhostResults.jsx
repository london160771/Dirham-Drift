import { GHOST } from '../../game/config/ghost.js';
import { t } from '../../i18n/strings.js';
import { formatGap, formatTime } from '../format.js';
import { saveGhost } from './ghostApi.js';
import { RequestStatus } from './RequestStatus.jsx';
import { useGhostRequest } from './useGhostRequest.js';

function verdict(timeMs, opponent) {
  if (!opponent) return null;
  if (timeMs === opponent.timeMs) return t('ghost.tie');
  const gap = formatGap(Math.abs(timeMs - opponent.timeMs));
  return timeMs < opponent.timeMs ? t('ghost.beat', { gap }) : t('ghost.lost', { gap });
}

function shareable(ghost) {
  return ghost && ghost.timeMs >= GHOST.minTimeMs && ghost.timeMs <= GHOST.maxTimeMs;
}

function ShareCode({ code }) {
  const copy = () => navigator.clipboard?.writeText(code).catch(() => {});
  return (
    <div className="ghost-share" data-testid="ghost-share">
      <span>{t('ghost.yourCode')}</span>
      <strong className="ghost-code" data-testid="ghost-share-code">{code}</strong>
      <span>{t('ghost.shareHint')}</span>
      {navigator.clipboard && (
        <button type="button" className="btn" onClick={copy}>
          {t('ghost.copy')}
        </button>
      )}
    </div>
  );
}

export function GhostResults({ results, opponent, onAgain, onMenu }) {
  const [state, run] = useGhostRequest();
  const busy = state.status === 'loading' || state.status === 'waking';
  const share = () => run(() => saveGhost(results.ghost));
  return (
    <div className="screen panel-screen ghost-screen" data-testid="ghost-results">
      <h2>{t('ghost.resultsTitle')}</h2>
      <p className="result-headline">{verdict(results.timeMs, opponent) ?? t('ghost.yourTime', { time: formatTime(results.timeMs) })}</p>
      <div className="result-stats">
        <span>{t('ghost.you', { time: formatTime(results.timeMs) })}</span>
        {opponent && <span>{t('ghost.ghostTime', { time: formatTime(opponent.timeMs) })}</span>}
        <span>{t(`tracks.${results.trackId}`)}</span>
      </div>
      {state.status === 'done' ? (
        <ShareCode code={state.value} />
      ) : (
        <>
          {shareable(results.ghost) ? (
            <button type="button" className="btn primary" onClick={share} disabled={busy} data-testid="ghost-get-code">
              {t('ghost.getCode')}
            </button>
          ) : (
            <p className="ghost-status">{t('ghost.tooShort')}</p>
          )}
          <RequestStatus state={state} onRetry={share} />
        </>
      )}
      <div className="menu row">
        <button type="button" className="btn" onClick={() => onAgain(opponent ?? results.ghost)} data-testid="ghost-again">
          {opponent ? t('ghost.againGhost') : t('ghost.againSelf')}
        </button>
        <button type="button" className="btn" onClick={onMenu} data-testid="ghost-menu-back">
          {t('ghost.menu')}
        </button>
      </div>
    </div>
  );
}
