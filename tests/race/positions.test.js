import { describe, expect, it } from 'vitest';
import { positionOf, sortPositions } from '../../src/game/race/sim/positions.js';

describe('position sorting', () => {
  it('puts finished cars first, in finishing order, then the rest by progress', () => {
    const order = sortPositions([
      { id: 'a', finished: false, finishTime: 0, progress: 900 },
      { id: 'b', finished: true, finishTime: 61.2, progress: 30000 },
      { id: 'c', finished: false, finishTime: 0, progress: 1200 },
      { id: 'd', finished: true, finishTime: 60.4, progress: 30000 },
    ]);
    expect(order.map((e) => e.id)).toEqual(['d', 'b', 'c', 'a']);
  });

  it('gives a 1-based position for a car', () => {
    const entries = [
      { id: 'player', finished: false, finishTime: 0, progress: 50 },
      { id: 'rival1', finished: false, finishTime: 0, progress: 80 },
    ];
    expect(positionOf(entries, 'player')).toBe(2);
  });
});
