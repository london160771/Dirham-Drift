import { t } from '../../i18n/strings.js';
import { formatAed } from '../format.js';
import { INSURANCE, SCAM } from '../../game/config/economy.js';

const LESSON_VARS = {
  insurance: { percent: INSURANCE.coversPercent },
  tooGoodToBeTrue: { percent: SCAM.payoutPercent },
};

export function lessonBody(id) {
  return t(`lessons.${id}Body`, LESSON_VARS[id]);
}

export function PitLesson({ lesson, onClose }) {
  return (
    <div className="modal-backdrop" data-testid="pit-lesson">
      <div className="modal lesson" role="dialog">
        <span className="kicker">💡 {t('lessons.pitLesson')}</span>
        <h2>{t(`lessons.${lesson.id}`)}</h2>
        <p>{lessonBody(lesson.id)}</p>
        <p className="key-number">{t(`lessons.${lesson.id}Number`, { number: formatAed(lesson.number) })}</p>
        <button type="button" className="btn primary" onClick={onClose} data-testid="close-lesson">
          {t('lessons.close')}
        </button>
      </div>
    </div>
  );
}
