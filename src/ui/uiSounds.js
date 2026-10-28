import { audio } from '../game/audio/audio.js';

export function installUiSounds(settings) {
  audio.setVolumes(settings);
  audio.music('hub');
  const unlock = () => audio.unlock();
  window.addEventListener('pointerdown', unlock, { capture: true });
  window.addEventListener('keydown', unlock, { capture: true });
  document.addEventListener('click', (event) => {
    if (event.target.closest?.('button')) audio.play('click');
  });
}
