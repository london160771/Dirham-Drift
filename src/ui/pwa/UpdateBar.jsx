import { useEffect, useState } from 'react';
import { t } from '../../i18n/strings.js';
import { applyUpdate, isUpdateReady, onUpdateChange } from './appUpdate.js';

export function UpdateBar() {
  const [ready, setReady] = useState(isUpdateReady);
  useEffect(() => onUpdateChange(setReady), []);
  if (!ready) return null;
  return (
    <button type="button" className="update-bar" onClick={applyUpdate} data-testid="update-bar">
      {t('title.update')}
    </button>
  );
}
