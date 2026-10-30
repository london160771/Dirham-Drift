import { randomInt } from 'node:crypto';
import { CODE } from './config.js';

const CODE_PATTERN = new RegExp(`^[${CODE.alphabet}]{${CODE.length}}$`);

export function newCode() {
  return Array.from({ length: CODE.length }, () => CODE.alphabet[randomInt(CODE.alphabet.length)]).join('');
}

export function normalizeCode(raw) {
  const code = String(raw).toUpperCase();
  return CODE_PATTERN.test(code) ? code : null;
}
