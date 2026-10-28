import { EN } from './en.js';

const LANGUAGES = { en: EN };
let current = LANGUAGES.en;

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
