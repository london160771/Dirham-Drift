export function byFileName(files) {
  const map = {};
  for (const [path, url] of Object.entries(files)) map[path.split('/').pop().replace(/\.\w+$/, '')] = url;
  return map;
}
