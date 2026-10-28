export const LESSON_IDS = [
  'costOfBorrowing',
  'totalCostOfLoan',
  'missedPayments',
  'emergencyFund',
  'insurance',
  'investingUpsDowns',
  'tooGoodToBeTrue',
  'phishing',
  'lendingToFriends',
  'entryFees',
];

export function meetLesson(state, id, number) {
  if (state.lessonsMet.includes(id)) return state;
  return { ...state, lessonsMet: [...state.lessonsMet, id], lessonQueue: [...state.lessonQueue, { id, number }] };
}

export function openStop(state) {
  if (state.pendingLesson || state.lessonQueue.length === 0) return state;
  const [next, ...rest] = state.lessonQueue;
  return { ...state, pendingLesson: next, lessonQueue: rest };
}

export function dismissLesson(state) {
  return { ...state, pendingLesson: null };
}
