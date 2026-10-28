import { t } from '../../i18n/strings.js';

export function Hint({ show, used, textKey, className }) {
  if (!show) return null;
  return <span className={`hint ${className} ${used ? 'gone' : ''}`}>{t(textKey)}</span>;
}

export function KeyboardHint({ used }) {
  if (used.size > 0) return null;
  return <div className="hint hint-keyboard">{t('controls.hintKeyboard')}</div>;
}
