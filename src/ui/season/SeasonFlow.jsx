import { RaceScreen } from '../race/RaceScreen.jsx';
import { EventCard } from './EventCard.jsx';
import { GlossaryProvider } from './Glossary.jsx';
import { PitHub } from './PitHub.jsx';
import { ResultsStatement } from './ResultsStatement.jsx';
import { SeasonRace } from './SeasonRace.jsx';
import { SeasonRecap } from './SeasonRecap.jsx';
import { useMoneySounds } from './useMoneySounds.js';
import { useSeason } from './useSeason.js';

function Phase({ season, onExit, onAgain, RaceComponent }) {
  const { state, dispatch, statementFrom, error } = season;
  switch (state.phase) {
    case 'RACING':
      return <SeasonRace state={state} dispatch={dispatch} RaceComponent={RaceComponent} />;
    case 'RESULTS':
      return <ResultsStatement state={state} dispatch={dispatch} from={statementFrom} />;
    case 'EVENT':
      return <EventCard state={state} dispatch={dispatch} />;
    case 'RECAP':
      return <SeasonRecap state={state} onAgain={onAgain} onExit={() => onExit(null)} />;
    default:
      return <PitHub state={state} dispatch={dispatch} error={error} onExit={() => onExit({ state, statementFrom })} />;
  }
}

export function SeasonFlow({ mode, seed, saved = null, onExit, onAgain = onExit, RaceComponent = RaceScreen }) {
  const season = useSeason({ mode, seed, saved });
  useMoneySounds(season.state);
  return (
    <GlossaryProvider>
      <Phase season={season} onExit={onExit} onAgain={onAgain} RaceComponent={RaceComponent} />
    </GlossaryProvider>
  );
}
