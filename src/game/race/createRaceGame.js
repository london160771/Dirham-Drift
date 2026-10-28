import Phaser from 'phaser';
import { RENDER } from '../config/race.js';
import { PALETTE } from '../config/style.js';
import { RACE_SCENE_KEY, RaceScene } from './scenes/RaceScene.js';

export function createRaceGame(parent, setup, bridge) {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: PALETTE.night,
    scale: { mode: Phaser.Scale.RESIZE, width: parent.clientWidth, height: parent.clientHeight },
    input: { keyboard: false, mouse: false, touch: false },
    render: { maxTextures: RENDER.maxTextures },
    banner: false,
    audio: { noAudio: true },
    scene: [],
  });
  game.scene.add(RACE_SCENE_KEY, RaceScene, true, { setup, bridge });
  return game;
}
