export function sortPositions(entries) {
  return [...entries].sort((a, b) => {
    if (a.finished !== b.finished) return a.finished ? -1 : 1;
    if (a.finished) return a.finishTime - b.finishTime;
    return b.progress - a.progress;
  });
}

export function positionOf(entries, id) {
  return sortPositions(entries).findIndex((entry) => entry.id === id) + 1;
}
