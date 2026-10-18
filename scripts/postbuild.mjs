import rss from './rss.mjs';
import rootEntry from './root-entry.mjs';

async function postbuild() {
  await rss();
  if (process.env.EXPORT) rootEntry();
}

postbuild();
