import { writeFileSync } from 'node:fs';
import siteMetadata from '../data/siteMetadata.js';

// GitHub Pages cannot run locale middleware. A real index.html returns 200;
// the saved language choice wins, and missing/invalid/blocked storage uses English.
export default function rootEntry() {
  const basePath = (process.env.BASE_PATH || '').replace(/\/$/, '');
  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '');
  writeFileSync(
    'out/index.html',
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ryan's Blog</title>
  <link rel="canonical" href="${siteUrl}/en">
  <link rel="alternate" hreflang="en" href="${siteUrl}/en">
  <link rel="alternate" hreflang="zh" href="${siteUrl}/zh">
  <link rel="alternate" hreflang="x-default" href="${siteUrl}/en">
  <script>
    (function () {
      var locale = 'en';
      try {
        var saved = localStorage.getItem('preferred-locale');
        if (saved === 'en' || saved === 'zh') locale = saved;
      } catch (_) {}
      window.location.replace(${JSON.stringify(basePath)} + '/' + locale + window.location.search + window.location.hash);
    })();
  </script>
  <noscript><meta http-equiv="refresh" content="0;url=${basePath}/en"></noscript>
</head>
<body></body>
</html>
`
  );
}
