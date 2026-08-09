<h1 align='center'>
  <a href="https://ryanpromax.github.io">Ryan's Blog</a>
</h1>

<p align="center"><i>This website refers to <a href="https://github.com/timlrx/tailwind-nextjs-starter-blog">tailwind-nextjs-starter-blog</a>.</i></p>

## Quick Start Guide

### Development

```bash
pnpm install

# If use Windows, you need to run:
$env:PWD = $(Get-Location).Path

pnpm dev
```

### Deploy

#### GitHub Pages

A [`pages.yml`](.github/workflows/pages.yml) workflow is already provided. Simply select "GitHub Actions" in: `Settings > Pages > Build and deployment > Source`.

#### Netlify

[Netlify](https://www.netlify.com/)’s Next.js runtime configures enables key Next.js functionality on your website without the need for additional configurations. Netlify generates serverless functions that will handle Next.js functionalities such as server-side rendered (SSR) pages, incremental static regeneration (ISR), `next/images`, etc.

See [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/overview/#next-js-runtime) for suggested configuration values and more details.

##### Build Configuration

- Runtime: Next.js
- Base directory: (Not set)
- Package directory: (Not set)
- Build command: pnpm build
- Publish directory: .next
- Functions directory: (Not set)
- Deploy log visibility: Public logs
- Build status: Active

## Features

- [x] Analytics: Umami Cloud
- [x] i18n: en-US & zh-CN
