// Demand gaps — searches people make that the site has no page for. Free sources only, no API keys:
//   1. Google autocomplete (Australian results) for the seed topics in ops/growth/demand.md: each seed is
//      expanded with a–z and question words, and the suggestions are what people actually type.
//   2. Competitor sitemaps listed in ops/growth/demand.md: topics they have pages on.
// Every candidate is checked against our own pages (src/content titles and slugs, src/pages paths) and against
// ideas already in the content queue / growth backlog, so only uncovered topics come back.
// Search Console only shows queries we already appear for; this fills in the ones we don't.
//
// Caveats: autocomplete is an unofficial endpoint (it can change or rate-limit — failures come back as
// { error }), it gives no search volumes (a suggestion's position is a rough popularity signal), and the
// coverage check is word overlap, so treat the output as candidates to verify, not as a plan.
//
// Usage: node ops/weekly-report/demand.mjs [--all-seeds]   (prints JSON)

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const CONFIG = 'ops/growth/demand.md';
const IDEA_FILES = ['ops/content/queue.md', 'ops/growth/backlog.md', 'ops/growth/plan.md'];
const SEEDS_PER_RUN = 6; // ~38 autocomplete requests per seed; seeds rotate weekly beyond this
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const QUESTION_WORDS = ['how', 'what', 'why', 'can', 'is', 'best', 'do', 'where', 'which', 'when', 'cost'];
const UA = 'Mozilla/5.0 (compatible; site-demand-check/1.0)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- Config: ops/growth/demand.md (markdown so routine edits auto-publish) ----
// ## Seeds         - <seed phrase>
// ## Competitors   - <name> | <sitemap url> | <optional regex a URL must match>
// ## Ignore        - <phrase>   (checked and rejected; never suggested again)

function readConfig() {
  const text = readFileSync(CONFIG, 'utf8');
  const sections = {};
  let current = null;
  for (const line of text.split('\n')) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) current = h[1].toLowerCase();
    else if (current && /^\s*-\s+/.test(line)) (sections[current] ??= []).push(line.replace(/^\s*-\s+/, '').trim());
  }
  return {
    seeds: (sections.seeds ?? []).map((s) => s.replace(/`/g, '').trim()).filter(Boolean),
    competitors: (sections.competitors ?? []).map((l) => {
      const [name, sitemap, include] = l.split('|').map((s) => s?.replace(/`/g, '').trim());
      return { name, sitemap, include: include || null };
    }).filter((c) => c.name && /^https?:\/\//.test(c.sitemap ?? '')),
    ignore: (sections.ignore ?? []).map((s) => s.replace(/\s+—.*$/, '').replace(/`/g, '').trim().toLowerCase()),
  };
}

// ---- Word matching ----

const STOP = new Set(
  ('a an the and or of to in on for with without by from at as is are be can do does did how what why when where which who ' +
    'i my me you your we our it its this that these those vs versus best top good guide guides ideas idea tips ' +
    'australia australian australians aus au nsw vic qld wa sa tas act nt sydney melbourne brisbane perth adelaide ' +
    '2023 2024 2025 2026 2027 near much many get make need should will not no yes about into than then').split(' '),
);
const stem = (w) => (w.length > 4 && w.endsWith('ies') ? `${w.slice(0, -3)}y` : w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w);
export const tokens = (s) => [...new Set(String(s).toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9]+/).filter((w) => w && !STOP.has(w)).map(stem))];

function coverage(phraseTokens, docs) {
  let best = { score: 0, doc: null };
  if (!phraseTokens.length) return { score: 1, doc: null };
  for (const d of docs) {
    let hit = 0;
    for (const t of phraseTokens) if (d.set.has(t)) hit++;
    const score = hit / phraseTokens.length;
    if (score > best.score) best = { score, doc: d };
  }
  return best;
}
const COVERED = 0.67;
// Suggestions that name a platform or format rather than a topic.
const NOISE = /\b(reddit|youtube|quora|tiktok|pdf|ppt|meaning|definition|login|sign in|wikipedia|movie|song|lyrics|game)\b/;

// ---- What the site already has ----

function ownDocs() {
  const docs = [];
  const files = execSync('git ls-files src/content src/pages', { encoding: 'utf8' }).split('\n').filter(Boolean);
  for (const f of files) {
    if (/\/(authors|node_modules)\//.test(f) || /\[.*\]/.test(f)) continue;
    const slug = f.replace(/^src\/(content|pages)\//, '').replace(/\.(md|mdx|astro)$/, '').replace(/\/index$/, '');
    let title = '';
    if (/\.mdx?$/.test(f)) title = (readFileSync(f, 'utf8').match(/^title:\s*["']?(.+?)["']?\s*$/m) ?? [])[1] ?? '';
    const page = `/${slug}`;
    docs.push({ kind: 'page', ref: page, label: title || page, set: new Set(tokens(`${title} ${slug.split('/').pop()}`)) });
  }
  for (const f of IDEA_FILES) {
    if (!existsSync(f)) continue;
    for (const line of readFileSync(f, 'utf8').split('\n')) {
      if (!/^\s*[-|]/.test(line) || line.length < 12) continue;
      const set = new Set(tokens(line));
      if (set.size) docs.push({ kind: 'idea', ref: f, label: line.replace(/\s+/g, ' ').slice(0, 120), set });
    }
  }
  return docs;
}

// ---- 1. Google autocomplete ----

async function suggest(q) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=au&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} from Google autocomplete`);
  const body = await res.json();
  return Array.isArray(body?.[1]) ? body[1] : [];
}

function pickSeeds(seeds, all) {
  if (all || seeds.length <= SEEDS_PER_RUN) return seeds;
  const week = Math.floor(Date.now() / (7 * 864e5));
  const start = (week * SEEDS_PER_RUN) % seeds.length;
  return Array.from({ length: SEEDS_PER_RUN }, (_, i) => seeds[(start + i) % seeds.length]);
}

async function autocomplete(seeds, docs, ignore) {
  const found = new Map(); // suggestion → { score, seeds:Set }
  let requests = 0;
  let failures = 0;
  for (const seed of seeds) {
    const queries = [seed, `${seed} `, ...LETTERS.map((l) => `${seed} ${l}`), ...QUESTION_WORDS.map((w) => `${w} ${seed}`)];
    for (const q of queries) {
      try {
        const list = await suggest(q);
        requests++;
        list.forEach((s, i) => {
          const key = s.toLowerCase().trim();
          const entry = found.get(key) ?? { score: 0, seeds: new Set() };
          entry.score += Math.max(1, 10 - i);
          entry.seeds.add(seed);
          found.set(key, entry);
        });
      } catch (err) {
        failures++;
        if (requests === 0 && failures >= 3) throw err; // blocked or endpoint gone
      }
      await sleep(250);
    }
  }
  const candidates = [];
  let covered = 0;
  for (const [query, { score, seeds: from }] of found) {
    if (NOISE.test(query) || ignore.some((x) => query.includes(x))) continue;
    const t = tokens(query);
    if (t.length === 0) continue;
    const c = coverage(t, docs);
    if (c.score >= COVERED) {
      covered++;
      continue;
    }
    candidates.push({
      query,
      popularity: score,
      seeds: [...from],
      closest: c.doc ? { [c.doc.kind]: c.doc.label, overlap: Math.round(c.score * 100) / 100 } : null,
    });
  }
  candidates.sort((a, b) => b.popularity - a.popularity);
  return { seedsUsed: seeds, requests, failures, suggestions: found.size, alreadyCovered: covered, candidates: candidates.slice(0, 40), all: [...found.keys()] };
}

// ---- 2. Competitor sitemaps ----

const SKIP_URL = /\/(tag|tags|category|categories|author|authors|page|wp-content|cart|account|checkout|search|feed|login|privacy|terms|contact|about)(\/|$)/i;
const SKIP_SITEMAP = /(tag|category|author|product|image|video|attachment|page-sitemap|wpforms|elementor|post_tag)/i;

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function sitemapUrls(url, depth = 0, budget = { maps: 15 }) {
  if (budget.maps-- <= 0) return [];
  const xml = await fetchText(url);
  const entries = [...xml.matchAll(/<(url|sitemap)>([\s\S]*?)<\/\1>/g)].map(([, kind, body]) => ({
    kind,
    loc: (body.match(/<loc>\s*(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?\s*<\/loc>/) ?? [])[1]?.trim(),
    lastmod: (body.match(/<lastmod>\s*(.*?)\s*<\/lastmod>/) ?? [])[1]?.slice(0, 10) ?? null,
  })).filter((e) => e.loc);
  const out = entries.filter((e) => e.kind === 'url');
  if (depth < 2) {
    for (const e of entries.filter((x) => x.kind === 'sitemap' && !SKIP_SITEMAP.test(x.loc))) {
      try {
        out.push(...(await sitemapUrls(e.loc, depth + 1, budget)));
      } catch { /* one broken child sitemap shouldn't sink the rest */ }
      if (out.length > 4000) break;
    }
  }
  return out;
}

function topicFromUrl(loc) {
  const path = new URL(loc).pathname.replace(/\/+$/, '');
  const seg = path.split('/').filter(Boolean).pop() ?? '';
  return decodeURIComponent(seg).replace(/\.(html?|php|aspx?)$/, '').replace(/[-_]+/g, ' ').replace(/\b\d{4,}\b/g, '').trim();
}

async function competitor(c, docs, demandDocs, ignore) {
  const include = c.include ? new RegExp(c.include, 'i') : null;
  const urls = (await sitemapUrls(c.sitemap)).filter((u) => !SKIP_URL.test(new URL(u.loc).pathname) && (!include || include.test(u.loc)));
  const uncovered = [];
  for (const u of urls) {
    const topic = topicFromUrl(u.loc);
    const t = tokens(topic);
    if (t.length < 2 || ignore.some((x) => topic.toLowerCase().includes(x))) continue;
    if (coverage(t, docs).score >= COVERED) continue;
    // Backed by demand when some autocomplete suggestion covers most of the topic's words.
    const d = coverage(t, demandDocs);
    uncovered.push({ topic, url: u.loc, lastmod: u.lastmod, demandBacked: d.score >= COVERED ? d.doc.label : null });
  }
  uncovered.sort((a, b) => (!!b.demandBacked - !!a.demandBacked) || String(b.lastmod).localeCompare(String(a.lastmod)));
  return { name: c.name, pagesChecked: urls.length, uncoveredCount: uncovered.length, uncovered: uncovered.slice(0, 20) };
}

// ---- Main ----

const section = async (fn) => {
  try {
    return await fn();
  } catch (err) {
    return { error: String(err.message || err) };
  }
};

const cfg = readConfig();
const docs = ownDocs();
const auto = await section(() => autocomplete(pickSeeds(cfg.seeds, process.argv.includes('--all-seeds')), docs, cfg.ignore));
// All suggestions seen this run (covered or not) count as demand evidence for competitor topics.
const demandDocs = (auto.all ?? []).map((q) => ({ kind: 'query', label: q, set: new Set(tokens(q)) }));
delete auto.all;
const competitors = [];
for (const c of cfg.competitors) competitors.push({ name: c.name, ...(await section(() => competitor(c, docs, demandDocs, cfg.ignore))) });

console.log(JSON.stringify({ generated: new Date().toISOString(), ownPagesAndIdeas: docs.length, autocomplete: auto, competitors }, null, 2));
