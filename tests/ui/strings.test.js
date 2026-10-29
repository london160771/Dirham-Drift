import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LANGUAGES, hasString, setLanguage, t } from '../../src/i18n/strings.js';

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(js|jsx)$/.test(name) ? [path] : [];
  });
}

describe('strings file', () => {
  it('fills in variables', () => {
    expect(t('hud.lap', { current: 2, total: 3 })).toBe('LAP 2/3');
  });

  it('has every key the code asks for', () => {
    const keys = new Set();
    for (const file of sourceFiles('src')) {
      for (const match of readFileSync(file, 'utf8').matchAll(/\bt\('([a-zA-Z0-9_.]+)'/g)) keys.add(match[1]);
    }
    const missing = [...keys].filter((key) => !hasString(key));
    expect(missing).toEqual([]);
  });
});

function leaves(node, prefix = '') {
  return Object.entries(node).flatMap(([key, value]) => (typeof value === 'string' ? [[`${prefix}${key}`, value]] : leaves(value, `${prefix}${key}.`)));
}

function tokens(text) {
  return [...text.matchAll(/\{\w+\}|\[\[\w+\]\]/g)].map((m) => m[0]).sort();
}

describe('Arabic strings (FR-I18N-002)', () => {
  const en = new Map(leaves(LANGUAGES.en));
  const ar = new Map(leaves(LANGUAGES.ar));

  it('has every English key and no extra ones', () => {
    expect([...ar.keys()].sort()).toEqual([...en.keys()].sort());
  });

  it('keeps the same variables and glossary words', () => {
    const wrong = [...en].filter(([key, text]) => tokens(text).join() !== tokens(ar.get(key) ?? '').join());
    expect(wrong.map(([key]) => key)).toEqual([]);
  });

  it('switches language and falls back to English for unknown ids', () => {
    expect(setLanguage('ar')).toBe('ar');
    expect(t('title.play')).toBe(LANGUAGES.ar.title.play);
    expect(setLanguage('xx')).toBe('en');
    expect(t('title.play')).toBe('Play');
  });
});
