// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Static output — Cloudflare Pages Functions (in /functions) handle the
// two form endpoints separately from the Astro build. See README.md.
export default defineConfig({
  site: 'https://psychedelicretreats.com.au',
  output: 'static',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), sitemap()],
});
