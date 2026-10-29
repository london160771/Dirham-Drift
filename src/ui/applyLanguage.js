import { getLanguage, setLanguage } from '../i18n/strings.js';

const RTL = new Set(['ar']);

export function applyLanguage(id, root = document.documentElement) {
  setLanguage(id);
  const language = getLanguage();
  root.lang = language;
  root.dir = RTL.has(language) ? 'rtl' : 'ltr';
  return language;
}
