import { byFileName } from '../../game/assets/fileSlots.js';

const FILES = import.meta.glob('../../assets/art/*.{png,jpg,jpeg,webp,avif}', { eager: true, query: '?url', import: 'default' });

export const ART_FILES = byFileName(FILES);
