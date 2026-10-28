import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { hasString, t } from '../../src/i18n/strings.js';

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
