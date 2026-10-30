import { useState } from 'react';
import { GHOST } from '../../game/config/ghost.js';
import { t } from '../../i18n/strings.js';
import { loadGhost, normalizeCode } from './ghostApi.js';
import { RequestStatus } from './RequestStatus.jsx';
import { useGhostRequest } from './useGhostRequest.js';

export function GhostMenu({ onRecord, onRace, onBack }) {
  const [code, setCode] = useState('');
  const [state, run] = useGhostRequest();
  const busy = state.status === 'loading' || state.status === 'waking';
  const ready = code.length === GHOST.codeLength && !busy;
  const load = async () => {
    const ghost = await run(() => loadGhost(code));
    if (ghost) onRace(ghost);
  };
  return (
    <div className="screen panel-screen ghost-screen" data-testid="ghost-menu">
      <h2>{t('ghost.title')}</h2>
      <p className="ghost-lead">{t('ghost.lead')}</p>
      <div className="card-row">
        <button type="button" className="card" onClick={onRecord} disabled={busy} data-testid="ghost-record">
          <strong>{t('ghost.record')}</strong>
          <span>{t('ghost.recordInfo')}</span>
        </button>
        <form
          className="card ghost-join"
          onSubmit={(event) => {
            event.preventDefault();
            if (ready) load();
          }}
        >
          <strong>{t('ghost.join')}</strong>
          <label htmlFor="ghost-code">{t('ghost.codeLabel')}</label>
          <input
            id="ghost-code"
            className="ghost-code-input"
            value={code}
            onChange={(event) => setCode(normalizeCode(event.target.value))}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck="false"
            maxLength={GHOST.codeLength}
            placeholder={t('ghost.codePlaceholder')}
            data-testid="ghost-code"
          />
          <button type="submit" className="btn primary" disabled={!ready} data-testid="ghost-load">
            {t('ghost.load')}
          </button>
          <RequestStatus state={state} onRetry={load} />
        </form>
      </div>
      <button type="button" className="btn" onClick={onBack} data-testid="ghost-back">
        {t('title.back')}
      </button>
    </div>
  );
}
