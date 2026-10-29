import { getLanguage, t } from '../../i18n/strings.js';
import { applyLanguage } from '../applyLanguage.js';
import { updateSettings } from '../storage/settingsStore.js';

export function nextLanguage(current) {
  return current === 'ar' ? 'en' : 'ar';
}

export function LanguageToggle({ onChange }) {
  const flip = () => {
    const language = applyLanguage(nextLanguage(getLanguage()));
    updateSettings({ language });
    onChange?.(language);
  };
  return (
    <button type="button" className="btn lang-toggle" onClick={flip} lang={nextLanguage(getLanguage())} data-testid="language-toggle">
      {t('language.switchTo')}
    </button>
  );
}
