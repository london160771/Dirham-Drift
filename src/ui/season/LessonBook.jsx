import { LESSON_IDS } from '../../game/engine/index.js';
import { t } from '../../i18n/strings.js';
import { lessonBody } from './PitLesson.jsx';

export function LessonBook({ state }) {
  return (
    <div className="lesson-book" data-testid="lesson-book">
      <p className="note">{t('lessons.met', { count: state.lessonsMet.length, total: LESSON_IDS.length })}</p>
      <ul>
        {LESSON_IDS.map((id) => {
          const met = state.lessonsMet.includes(id);
          return (
            <li key={id} className={met ? 'met' : 'locked'}>
              <strong>
                {met ? '✓' : '○'} {t(`lessons.${id}`)}
              </strong>
              <span className="muted">{met ? lessonBody(id) : t('lessons.locked')}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
