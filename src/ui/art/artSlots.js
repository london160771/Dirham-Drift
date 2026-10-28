const FILES = import.meta.glob('../../assets/art/*.{png,jpg,jpeg,webp,avif}', { eager: true, query: '?url', import: 'default' });

export const ART_FILES = Object.fromEntries(Object.entries(FILES).map(([path, url]) => [path.split('/').pop().replace(/\.\w+$/, ''), url]));
