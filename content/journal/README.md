# Journal content

Life entries and their reviewed, metadata-stripped `photo.webp` files must be stored only in the ignored `content/journal/local/life-private/` directory, with one `entry.json` next to each image. Mark a reviewed entry `published` to include it in the **authenticated Worker** package. The public site generator intentionally excludes all Life records and ignores the entire local tree.

See [the private Life runbook](../../workers/life/README.md) for packaging, tests, secrets and deployment. Do not place originals or private drafts in the Worker asset folder or commit them. Never deploy a public artifact from a development preview.
