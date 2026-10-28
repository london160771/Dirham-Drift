import { createContext, useContext, useState } from 'react';
import { t } from '../../i18n/strings.js';

const GlossaryContext = createContext(() => {});

export function GlossaryProvider({ children }) {
  const [open, setOpen] = useState(null);
  return (
    <GlossaryContext.Provider value={setOpen}>
      {children}
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(null)} data-testid="glossary">
          <div className="modal small" role="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>{t(`glossary.${open}`)}</h3>
            <p>{t(`glossary.${open}Body`)}</p>
            <button type="button" className="btn" onClick={() => setOpen(null)}>
              {t('glossary.close')}
            </button>
          </div>
        </div>
      )}
    </GlossaryContext.Provider>
  );
}

export function Term({ id }) {
  const open = useContext(GlossaryContext);
  return (
    <button type="button" className="term" onClick={() => open(id)} data-testid={`term-${id}`}>
      {t(`glossary.${id}`)}
    </button>
  );
}
