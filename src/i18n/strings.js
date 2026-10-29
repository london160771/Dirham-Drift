import { AR } from './ar.js';
import { EN } from './en.js';

export const LANGUAGES = { en: EN, ar: AR };
let currentId = 'en';
let current = LANGUAGES.en;

export function setLanguage(id) {
  currentId = id in LANGUAGES ? id : 'en';
  current = LANGUAGES[currentId];
  return currentId;
}

export function getLanguage() {
  return currentId;
}

function lookup(path) {
  return path.split('.').reduce((node, key) => (node && key in node ? node[key] : undefined), current);
}

export function t(path, vars = {}) {
  const value = lookup(path);
  if (typeof value !== 'string') return path;
  return value.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? String(vars[name]) : `{${name}}`));
}

export function hasString(path) {
  return typeof lookup(path) === 'string';
}
