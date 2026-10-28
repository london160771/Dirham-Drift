const SOUND_FILES = import.meta.glob('../../assets/audio/*.{mp3,ogg,wav,m4a}', { eager: true, query: '?url', import: 'default' });

function byName(files) {
  const map = {};
  for (const [path, url] of Object.entries(files)) map[path.split('/').pop().replace(/\.\w+$/, '')] = url;
  return map;
}

export const AUDIO_SLOTS = byName(SOUND_FILES);
