import { describe, expect, it } from 'vitest';
import { CAR_SPRITES, SCENE_ART } from '../../src/game/config/style.js';
import { artList, RACE_ART_FILES } from '../../src/game/race/render/raceArt.js';
import { ART_FILES } from '../../src/ui/art/artSlots.js';
import { ART_SLOTS } from '../../src/game/config/art.js';

const SCENE_NAMES = [...SCENE_ART.roofs, SCENE_ART.palm, SCENE_ART.yacht, ...Object.keys(SCENE_ART.textureTiles)];

describe('art files', () => {
  it('ships a sprite for every car', () => {
    for (const name of [CAR_SPRITES.player, ...CAR_SPRITES.rivals, ...CAR_SPRITES.traffic]) expect(RACE_ART_FILES[name], name).toBeTruthy();
  });

  it('ships every track scenery image', () => {
    for (const name of SCENE_NAMES) expect(RACE_ART_FILES[name], name).toBeTruthy();
  });

  it('ships an image for every hub art slot', () => {
    for (const slot of ART_SLOTS) expect(ART_FILES[slot], slot).toBeTruthy();
  });

  it('falls back to code art when no listed image is loaded', () => {
    expect(artList({}, SCENE_ART.roofs)).toBeNull();
    expect(artList({ 'roof-pool': 'pool' }, SCENE_ART.roofs)).toEqual(['pool']);
  });
});
