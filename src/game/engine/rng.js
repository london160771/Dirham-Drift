const UINT32 = 4294967296;

export function nextRandom(seed) {
  const next = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(next ^ (next >>> 15), next | 1);
  r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
  return { value: ((r ^ (r >>> 14)) >>> 0) / UINT32, seed: next };
}

export function randomInt(seed, min, max) {
  const { value, seed: next } = nextRandom(seed);
  return { value: min + Math.floor(value * (max - min + 1)), seed: next };
}

export function createRng(seed) {
  let current = seed | 0;
  const next = () => {
    const result = nextRandom(current);
    current = result.seed;
    return result.value;
  };
  return {
    next,
    range: (min, max) => min + next() * (max - min),
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (list) => list[Math.floor(next() * list.length)],
    get seed() {
      return current;
    },
  };
}
