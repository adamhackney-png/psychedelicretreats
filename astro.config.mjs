// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://psychedelicretreats.com.au';

// Guides/news default to draft: true (see src/content.config.ts) and render
// live with a noindex tag until an editor flips them to draft: false — keep
// them out of the sitemap too so we're not sending Google mixed signals.
/** @param {string} dir */
function draftSlugs(dir) {
  return readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .filter((file) => {
      const frontmatter = readFileSync(`${dir}/${file}`, 'utf-8').split('---')[1] ?? '';
      const match = frontmatter.match(/^draft:\s*(true|false)\s*$/m);
      return match ? match[1] === 'true' : true;
    })
    .map((file) => file.replace(/\.mdx$/, ''));
}

const draftUrls = new Set([
  ...draftSlugs('./src/content/guides').map((slug) => `${SITE}/guides/${slug}/`),
  ...draftSlugs('./src/content/news').map((slug) => `${SITE}/news/${slug}/`),
]);

// Static output — Cloudflare Pages Functions (in /functions) handle the
// two form endpoints separately from the Astro build. See README.md.
export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), sitemap({ filter: (page) => !draftUrls.has(page) })],
});
