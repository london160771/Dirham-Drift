import { SEASONS } from '../../game/config/season.js';
import { netWorth } from '../../game/engine/index.js';
import { formatAed } from '../format.js';
import { ghostApiUrl } from '../ghost/ghostApi.js';
import { t } from '../../i18n/strings.js';
import { savedDifficulty } from '../storage/seasonStore.js';

const careerVars = { races: SEASONS.career.races.length, stages: new Set(SEASONS.career.races.map((race) => race.stage)).size };

export function modeCards(saved) {
  const cards = [
    { id: 'quickSeason', title: 'modes.quickSeason', info: 'modes.quickSeasonInfo', vars: { races: SEASONS.quick.races.length }, featured: true },
  ];
  if (saved) {
    const vars = { current: saved.state.raceIndex + 1, total: saved.state.totalRaces, level: t(`difficulty.${savedDifficulty(saved)}`), amount: formatAed(netWorth(saved.state)) };
    cards.push({ id: 'continue', title: 'modes.continue', info: 'modes.continueInfo', vars });
  }
  cards.push({ id: 'career', title: 'modes.career', info: saved ? 'modes.careerRestart' : 'modes.careerInfo', vars: careerVars });
  cards.push({ id: 'quickRace', title: 'modes.quickRace', info: 'modes.quickRaceInfo' });
  if (ghostApiUrl()) cards.push({ id: 'ghost', title: 'modes.ghost', info: 'modes.ghostInfo' });
  return cards;
}
