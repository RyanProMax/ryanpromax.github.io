import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = process.cwd();
const preview = process.argv.includes('--preview');
const privateLife = process.argv.includes('--private-life');
if (privateLife && preview) throw new Error('Private Life builds never include drafts');
const source = path.join(
  root,
  privateLife ? 'content/journal/local/life-private' : 'content/journal'
);
const target = path.join(
  root,
  privateLife ? 'workers/life/.assets/photos' : 'public/static/journal-generated'
);
const result = { life: [], travel: [] };
const assets = [];
const ids = new Set();
const bilingual = (v) =>
  Array.isArray(v) && v.length === 2 && v.every((s) => typeof s === 'string');
async function scan(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not supported: ${file}`);
    if (entry.isDirectory()) {
      if (!privateLife && entry.name === 'local') continue;
      await scan(file);
      continue;
    }
    if (!entry.name.endsWith('.json')) continue;
    const item = JSON.parse(await fs.readFile(file, 'utf8'));
    if (!['life', 'travel'].includes(item.kind)) throw new Error(`Invalid kind: ${file}`);
    if (privateLife ? item.kind !== 'life' : item.kind === 'life') continue;
    if (!['draft', 'published', 'example'].includes(item.status))
      throw new Error(`Explicit status required: ${file}`);
    if (!preview && item.status !== 'published') continue;
    const undated = item.status === 'draft' && item.kind === 'life' && item.date == null;
    if (!/^[a-z0-9-]+$/.test(item.id)) throw new Error(`Invalid id: ${file}`);
    const key = `${item.kind}-${item.id}`;
    if (ids.has(key)) throw new Error(`Duplicate id: ${key}`);
    ids.add(key);
    if (!undated && !/^\d{4}[-.]\d{2}([-.]\d{2})?$/.test(item.date))
      throw new Error(`Date required: ${file}`);
    const normalizedDate = undated ? '2000-01-01' : item.date.replaceAll('.', '-');
    const fullDate = normalizedDate.length === 7 ? `${normalizedDate}-01` : normalizedDate;
    const parsedDate = new Date(`${fullDate}T00:00:00Z`);
    if (
      !Number.isFinite(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== fullDate
    )
      throw new Error(`Invalid calendar date: ${file}`);
    if (
      item.kind === 'life' &&
      ((!undated && !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) || !bilingual(item.summary))
    )
      throw new Error(`Life date/summary invalid: ${file}`);
    if (
      item.kind === 'travel' &&
      (!bilingual(item.name) ||
        !bilingual(item.country) ||
        !Number.isFinite(item.lat) ||
        Math.abs(item.lat) > 90 ||
        !Number.isFinite(item.lon) ||
        Math.abs(item.lon) > 180 ||
        !item.image)
    )
      throw new Error(`Travel metadata invalid: ${file}`);
    if (item.image) {
      if (!bilingual(item.image.alt) || typeof item.image.src !== 'string')
        throw new Error(`Image metadata invalid: ${file}`);
      if (item.image.src.startsWith('/static/images/life/') && item.status === 'example') {
        await fs.access(path.join(root, 'public', item.image.src));
      } else {
        const original = path.resolve(path.dirname(file), item.image.src);
        if (!original.startsWith(path.dirname(file) + path.sep))
          throw new Error(`Image must be beside metadata: ${file}`);
        const stat = await fs.lstat(original);
        if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Invalid image: ${file}`);
        const sharp = require(require.resolve('sharp', { paths: [require.resolve('next')] }));
        // Derivative only: retain original. sharp removes EXIF/GPS by default.
        const metadata = await sharp(original).metadata();
        const rotated = [5, 6, 7, 8].includes(metadata.orientation);
        item.image.width = rotated ? metadata.height : metadata.width;
        item.image.height = rotated ? metadata.width : metadata.height;
        const buffer = await sharp(original)
          .rotate()
          .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();
        assets.push({ name: `${key}.webp`, buffer });
        item.image.src = privateLife
          ? `/api/life/photos/${key}.webp`
          : `/static/journal-generated/${key}.webp`;
      }
    }
    item.example = item.status === 'example';
    delete item.status;
    const kind = item.kind;
    delete item.kind;
    // Only the fields the unlocked page renders enter the private manifest.
    result[kind].push(
      privateLife
        ? {
            id: item.id,
            date: item.date,
            summary: item.summary,
            ...(item.image
              ? {
                  image: {
                    src: item.image.src,
                    alt: item.image.alt,
                    width: item.image.width,
                    height: item.image.height,
                  },
                }
              : {}),
          }
        : item
    );
  }
}
await scan(source);
for (const kind of Object.keys(result)) {
  if (result[kind].some((item) => !item.example))
    result[kind] = result[kind].filter((item) => !item.example);
  result[kind].sort(
    (a, b) => (b.date || '').localeCompare(a.date || '') || a.id.localeCompare(b.id)
  );
}
// Only this script's generated directory is replaced. Inputs are never removed.
await fs.mkdir(target, { recursive: true });
for (const file of await fs.readdir(target)) {
  if (/^(life|travel)-[a-z0-9-]+\.webp$/.test(file)) await fs.unlink(path.join(target, file));
}
for (const asset of assets) await fs.writeFile(path.join(target, asset.name), asset.buffer);
if (privateLife) {
  await fs.writeFile(path.join(target, '../entries.json'), JSON.stringify(result.life), {
    mode: 0o600,
  });
  console.log(`Private Life package: ${result.life.length} entries, ${assets.length} images.`);
  process.exit(0);
}
await fs.mkdir(path.join(root, 'data/generated'), { recursive: true });
await fs.writeFile(
  path.join(root, 'data/generated/journal.json'),
  JSON.stringify(result, null, 2) + '\n'
);
console.log(
  `Journal ${preview ? 'local preview' : 'published only'}: ${result.life.length} life, ${result.travel.length} travel.`
);
