import { EVENTS, SCAM } from '../../game/config/economy.js';
import { formatAed } from '../format.js';

export const EVENT_VARS = {
  puncture: { amount: formatAed(EVENTS.puncture) },
  friendBorrow: { amount: formatAed(EVENTS.friendLoan) },
  sponsorDeal: { now: formatAed(EVENTS.sponsorNow), top: EVENTS.sponsorTopPosition, penalty: formatAed(EVENTS.sponsorPenalty) },
  desertGold: { percent: SCAM.payoutPercent },
};

export const RED_FLAGS = ['flagLicence', 'flagGuaranteed', 'flagFriends', 'flagWithdraw'];
