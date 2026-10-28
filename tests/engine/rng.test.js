import { describe, expect, it } from 'vitest';
import { createRng, nextRandom, randomInt } from '../../src/game/engine/rng.js';

describe('seeded RNG', () => {
  it('gives the same sequence for the same seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    const seqA = Array.from({ length: 20 }, () => a.next());
    const seqB = Array.from({ length: 20 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it('stays in [0, 1) and gives different seeds different sequences', () => {
    const a = createRng(1);
    const b = createRng(2);
    const values = Array.from({ length: 200 }, () => a.next());
    expect(values.every((v) => v >= 0 && v < 1)).toBe(true);
    expect(b.next()).not.toBe(createRng(1).next());
  });

  it('pure helpers return the next seed alongside the value', () => {
    const first = nextRandom(7);
    expect(nextRandom(7)).toEqual(first);
    const roll = randomInt(first.seed, -6, 9);
    expect(Number.isInteger(roll.value)).toBe(true);
    expect(roll.value).toBeGreaterThanOrEqual(-6);
    expect(roll.value).toBeLessThanOrEqual(9);
  });
});
