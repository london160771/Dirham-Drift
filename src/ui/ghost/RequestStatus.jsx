import { t } from '../../i18n/strings.js';

export function RequestStatus({ state, onRetry }) {
  if (state.status === 'loading') return <p className="ghost-status">{t('ghost.loading')}</p>;
  if (state.status === 'waking') return <p className="ghost-status" data-testid="ghost-waking">{t('ghost.waking')}</p>;
  if (state.status !== 'error') return null;
  const { code, retryable } = state.error;
  return (
    <div className="ghost-status error" role="alert" data-testid="ghost-error">
      <strong>{t(`ghost.errors.${code}`)}</strong>
      <span>{t(`ghost.errors.${code}Next`)}</span>
      {retryable && onRetry && (
        <button type="button" className="btn" onClick={onRetry} data-testid="ghost-retry">
          {t('ghost.retry')}
        </button>
      )}
    </div>
  );
}
