import { useState } from 'react';
import { t, hasString } from '../../i18n/strings.js';
import { loadSettings, updateSettings } from '../storage/settingsStore.js';
import { Bank } from './bank/Bank.jsx';
import { FirstVisitTips } from './FirstVisitTips.jsx';
import { Garage } from './Garage.jsx';
import { LessonBook } from './LessonBook.jsx';
import { MoneyBar } from './MoneyBar.jsx';
import { NextRace, PreRaceCard } from './NextRace.jsx';
import { PitLesson } from './PitLesson.jsx';

const TABS = ['home', 'garage', 'bank', 'lessons'];
const DOORS = [
  { tab: 'garage', icon: '🔧' },
  { tab: 'bank', icon: '🏦' },
  { tab: 'lessons', icon: '📘' },
];

function Home({ state, dispatch, onTab }) {
  return (
    <div className="pit-home">
      <div className="doors">
        {DOORS.map((door) => (
          <button key={door.tab} type="button" className={`door door-${door.tab}`} onClick={() => onTab(door.tab)} data-testid={`door-${door.tab}`}>
            <span className="door-icon" aria-hidden="true">
              {door.icon}
            </span>
            <span className="door-text">
              <strong>{t(`pit.${door.tab}`)}</strong>
              <span className="muted small">{t(`pit.${door.tab}Info`)}</span>
            </span>
          </button>
        ))}
      </div>
      <NextRace state={state} dispatch={dispatch} />
    </div>
  );
}

function TabBody({ tab, state, dispatch, onTab }) {
  if (tab === 'garage') return <Garage state={state} dispatch={dispatch} />;
  if (tab === 'bank') return <Bank state={state} dispatch={dispatch} />;
  if (tab === 'lessons') return <LessonBook state={state} />;
  return <Home state={state} dispatch={dispatch} onTab={onTab} />;
}

function Modals({ state, dispatch, tipsSeen, onTipsSeen }) {
  if (state.pendingLesson) return <PitLesson lesson={state.pendingLesson} onClose={() => dispatch({ type: 'dismissLesson' })} />;
  if (!tipsSeen) return <FirstVisitTips onClose={onTipsSeen} />;
  if (state.phase === 'PRE_RACE') return <PreRaceCard state={state} dispatch={dispatch} />;
  return null;
}

export function PitHub({ state, dispatch, error, onExit }) {
  const [tab, setTab] = useState('home');
  const [tipsSeen, setTipsSeen] = useState(() => loadSettings().pitTipsSeen);
  const seeTips = () => {
    updateSettings({ pitTipsSeen: true });
    setTipsSeen(true);
  };
  return (
    <div className="pit-hub" data-testid="pit-hub">
      <header className="pit-header">
        <MoneyBar state={state} />
        <button type="button" className="btn small-btn" onClick={onExit}>
          {t('results.menu')}
        </button>
      </header>
      <nav className="pit-tabs">
        {TABS.map((id) => (
          <button key={id} type="button" className={id === tab ? 'tab on' : 'tab'} onClick={() => setTab(id)} data-testid={`tab-${id}`}>
            {t(`pit.${id}`)}
          </button>
        ))}
      </nav>
      {error && <p className="error-banner">⚠ {t(hasString(`errors.${error}`) ? `errors.${error}` : 'errors.unknown')}</p>}
      <main className="pit-body">
        <TabBody tab={tab} state={state} dispatch={dispatch} onTab={setTab} />
      </main>
      <Modals state={state} dispatch={dispatch} tipsSeen={tipsSeen} onTipsSeen={seeTips} />
    </div>
  );
}
