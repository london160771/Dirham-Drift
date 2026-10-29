import { useEffect, useState } from 'react';
import { t } from '../../i18n/strings.js';
import { canPromptInstall, onInstallPromptChange, promptInstall } from '../pwa/installPrompt.js';

const PLATFORMS = [
  { id: 'android', steps: 3 },
  { id: 'iphone', steps: 3 },
  { id: 'desktop', steps: 2 },
];

export function InstallGuide({ onBack }) {
  const [ready, setReady] = useState(canPromptInstall);
  useEffect(() => onInstallPromptChange(setReady), []);
  return (
    <div className="screen how-to" data-testid="install-guide">
      <header className="how-to-head">
        <h2>{t('install.title')}</h2>
        <button type="button" className="btn small-btn" onClick={onBack}>
          {t('title.back')}
        </button>
      </header>
      <p className="muted">{t('install.intro')}</p>
      {ready && (
        <button type="button" className="btn primary" onClick={promptInstall} data-testid="install-now">
          {t('install.now')}
        </button>
      )}
      <div className="how-to-cards">
        {PLATFORMS.map((platform) => (
          <article key={platform.id} className="how-card" data-testid={`install-${platform.id}`}>
            <strong>{t(`install.${platform.id}`)}</strong>
            <ol className="install-steps">
              {Array.from({ length: platform.steps }, (_, i) => (
                <li key={i}>{t(`install.${platform.id}${i + 1}`)}</li>
              ))}
            </ol>
          </article>
        ))}
      </div>
      <p className="note">{t('install.offline')}</p>
    </div>
  );
}
