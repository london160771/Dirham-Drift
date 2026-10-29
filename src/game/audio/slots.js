import { byFileName } from '../assets/fileSlots.js';

const SOUND_FILES = import.meta.glob('../../assets/audio/*.{mp3,ogg,wav,m4a}', { eager: true, query: '?url', import: 'default' });

export const AUDIO_SLOTS = byFileName(SOUND_FILES);
