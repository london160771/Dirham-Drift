import { useEffect, useState } from 'react';
import { t } from '../../i18n/strings.js';

const TOUCH_HINTS = [
  { control: 'left', key: 'controls.hintSteer', className: 'hint-steer' },
  { control: 'gas', key: 'controls.hintGas', className: 'hint-gas' },
  { control: 'brake', key: 'controls.hintBrake', className: 'hint-brake' },
  { control: 'nitro', key: 'controls.hintNitro', className: 'hint-nitro' },
];

export function Hints({ input, touch }) {
  const [used, setUsed] = useState(() => new Set());
  useEffect(
    () =>
      input.onFirstUse((control) => {
        setUsed((prev) => new Set(prev).add(control === 'right' ? 'left' : control));
      }),
    [input],
  );
  if (!touch) {
    return used.size > 0 ? null : <div className="hint hint-keyboard">{t('controls.hintKeyboard')}</div>;
  }
  return (
    <div className="hints">
      {TOUCH_HINTS.map((hint) => (
        <div key={hint.control} className={`hint ${hint.className} ${used.has(hint.control) ? 'gone' : ''}`}>
          {t(hint.key)}
        </div>
      ))}
    </div>
  );
}
