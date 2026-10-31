import { DIFFICULTY_IDS } from '../../game/config/race.js';
import { t } from '../../i18n/strings.js';

export function DifficultyPicker({ value, onChange }) {
  return (
    <div className="chips difficulty-picker" role="radiogroup" aria-label={t('difficulty.title')} data-testid="difficulty-picker">
      <span className="chips-label">{t('difficulty.title')}</span>
      {DIFFICULTY_IDS.map((id) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={id === value}
          className={id === value ? 'chip on' : 'chip'}
          onClick={() => onChange(id)}
          data-testid={`difficulty-${id}`}
        >
          {t(`difficulty.${id}`)}
        </button>
      ))}
      <span className="muted small difficulty-info">{t(`difficulty.${value}Info`)}</span>
    </div>
  );
}
