# Private Life journal

The public GitHub Pages export renders the bilingual password form only. Do not add private entries or photos to the public repository, public build, search index or deployment artifact. The Worker serves the manifest and photos on the same origin only after verifying a server-signed session.

## Private input and smoke test

Keep the reviewed Life entries and derivative WebP images in the ignored directory `content/journal/local/life-private/`. Back that directory up privately before removing any tracked copies. From the project root, run `node scripts/journal.mjs --private-life` to create the ignored Worker assets. Verify the printed counts. Only published Life records are packaged. Other local drafts are not part of this input.

Run `node --test workers/life/worker.test.mjs` and build the public site from a clean checkout without the private assets. The normal `node scripts/journal.mjs` must report zero Life entries. Confirm the export has no Life captions, photos or manifest, in both language HTML/RSC output and JS assets.

## Deployment

1. Deploy the Worker only after the owner approves placing the Life entries and photos in its authenticated Cloudflare asset storage. The Worker route is only `ryanzh.me/api/life/*`. Keep `workers_dev` and `preview_urls` disabled and `run_worker_first` enabled. Keep any zone Cache Rules from overriding the API's private/no-store responses.
2. Set `LIFE_PASSWORD` (random, at least 16 characters) and a separate random `LIFE_SESSION_KEY` (at least 32 characters) as Worker secrets, never in source, shell args, or chat. The endpoint fails closed while secrets are missing. Rotate the session key along with the password to invalidate previously issued sessions.
3. Verify the real API on the production origin: no cookie or wrong password returns no manifest or image; correct password opens the manifest and an image; an unauthenticated request for the same URL still fails after the authorized read. Then deploy the public site only from the verified build and check both languages and the previous public image URLs on the public Pages origin and custom host.
4. A new deployment does not remove copies from Git history and release artifacts, search caches, browser caches, forks, or downloads. History cleanup and cache removal require a separate decision. If the Worker fails during cutover, leave the public lock screen in place; do not redeploy the formerly public data.
