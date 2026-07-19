#!/usr/bin/env node
// Crawls dist/ for internal <a href> links and reports any that don't resolve
// to a file in the build output. Run after `npm run build`.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (extname(full) === '.html') files.push(full);
  }
  return files;
}

function resolvesToFile(pathname) {
  if (pathname === '/') return existsSync(join(DIST, 'index.html'));
  const clean = pathname.replace(/^\//, '').replace(/\/$/, '');
  const candidates = [
    join(DIST, clean),
    join(DIST, `${clean}.html`),
    join(DIST, clean, 'index.html'),
  ];
  return candidates.some((c) => existsSync(c));
}

const htmlFiles = walk(DIST);
const hrefRe = /href="([^"]+)"/g;
const broken = new Map();

for (const file of htmlFiles) {
  const rawContent = readFileSync(file, 'utf-8');
  const content = rawContent.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<template[\s\S]*?<\/template>/gi, '');
  const pageUrl = '/' + file.slice(DIST.length).replace(/index\.html$/, '');
  for (const match of content.matchAll(hrefRe)) {
    const href = match[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue; // skip external/protocol-relative
    const [pathname] = href.split('#');
    if (!pathname) continue; // pure hash link
    if (!resolvesToFile(pathname)) {
      if (!broken.has(pathname)) broken.set(pathname, new Set());
      broken.get(pathname).add(pageUrl);
    }
  }
}

if (broken.size === 0) {
  console.log(`✓ No broken internal links found across ${htmlFiles.length} pages.`);
  process.exit(0);
} else {
  console.log(`✗ Found ${broken.size} broken internal link target(s):\n`);
  for (const [target, sources] of broken) {
    console.log(`  ${target}`);
    for (const source of sources) console.log(`    ← ${source}`);
  }
  process.exit(1);
}
