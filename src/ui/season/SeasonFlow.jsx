import { RaceScreen } from '../race/RaceScreen.jsx';
import { EventCard } from './EventCard.jsx';
import { GlossaryProvider } from './Glossary.jsx';
import { PitHub } from './PitHub.jsx';
import { ResultsStatement } from './ResultsStatement.jsx';
import { SeasonOver } from './SeasonOver.jsx';
import { SeasonRace } from './SeasonRace.jsx';
import { useSeason } from './useSeason.js';

function Phase({ season, onExit, RaceComponent }) {
  const { state, dispatch, statementFrom, error } = season;
  switch (state.phase) {
    case 'RACING':
      return <SeasonRace state={state} dispatch={dispatch} RaceComponent={RaceComponent} />;
    case 'RESULTS':
      return <ResultsStatement state={state} dispatch={dispatch} from={statementFrom} />;
    case 'EVENT':
      return <EventCard state={state} dispatch={dispatch} />;
    case 'RECAP':
      return <SeasonOver state={state} onExit={onExit} />;
    default:
      return <PitHub state={state} dispatch={dispatch} error={error} onExit={onExit} />;
  }
}

export function SeasonFlow({ mode, seed, onExit, RaceComponent = RaceScreen }) {
  const season = useSeason({ mode, seed });
  return (
    <GlossaryProvider>
      <Phase season={season} onExit={onExit} RaceComponent={RaceComponent} />
    </GlossaryProvider>
  );
}
