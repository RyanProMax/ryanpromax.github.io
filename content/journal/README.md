# Journal content

Each published entry has `entry.json` and its reviewed, metadata-stripped `photo.webp`. These files are public. Do not add original private photographs here.

`pnpm photos` regenerates local preview; `pnpm build` and `pnpm build:prod` include only explicitly published entries. Private drafts belong in ignored `content/journal/local/` with status `draft`. Unknown dates may be null only in local drafts. Never deploy output from a development preview.
