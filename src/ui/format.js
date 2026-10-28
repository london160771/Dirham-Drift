const MS_PER_MINUTE = 60000;
const MS_PER_SECOND = 1000;

export function formatTime(ms) {
  const minutes = Math.floor(ms / MS_PER_MINUTE);
  const seconds = Math.floor((ms % MS_PER_MINUTE) / MS_PER_SECOND);
  const tenths = Math.floor((ms % MS_PER_SECOND) / 100);
  return `${minutes}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

const GROUPING = new Intl.NumberFormat('en-US');

export function formatAed(amount) {
  return GROUPING.format(amount);
}
