import { ENTRY_FEES, INDEX_FUND, INSURANCE, LATE_PAYMENT, LOANS, SAVINGS, SCAM } from '../../game/config/economy.js';
import { SEASONS } from '../../game/config/season.js';
import { formatAed } from '../format.js';

const quick = LOANS.quick;

export const HOW_TO_SECTIONS = ['controls', 'loop', 'money', 'modes', 'tips'];

export const HOW_TO_CARDS = {
  controls: [
    { id: 'touch' },
    { id: 'keys' },
    { id: 'assists' },
  ],
  loop: [{ id: 'flow' }, { id: 'feel' }],
  money: [
    { id: 'loan', vars: { borrow: formatAed(quick.borrow), perRace: formatAed(quick.perRace), races: quick.races, total: formatAed(quick.perRace * quick.races) } },
    { id: 'repo', vars: { fee: formatAed(LATE_PAYMENT.fee), career: LATE_PAYMENT.strikesToRepo.career, quick: LATE_PAYMENT.strikesToRepo.quick } },
    { id: 'insurance', vars: { premium: formatAed(INSURANCE.premium), percent: INSURANCE.coversPercent } },
    { id: 'savings', vars: { percent: SAVINGS.growthPercent } },
    { id: 'fund', vars: { min: INDEX_FUND.minChangePercent, max: INDEX_FUND.maxChangePercent } },
    { id: 'scam', vars: { percent: SCAM.payoutPercent } },
    { id: 'fees', vars: { pro: formatAed(ENTRY_FEES.pro), final: formatAed(ENTRY_FEES.final) } },
  ],
  modes: [
    { id: 'quickSeason', vars: { races: SEASONS.quick.races.length } },
    { id: 'career', vars: { races: SEASONS.career.races.length } },
    { id: 'quickRace' },
  ],
  tips: [{ id: 'total' }, { id: 'buffer' }, { id: 'redFlags' }, { id: 'lessons' }],
};
