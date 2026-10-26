// Weekly metrics for psychedelicretreats.com.au — run by the "PRA weekly report" routine.
//
// Prints one JSON object: this week vs last week for GA4 traffic and events, Search Console,
// MailerLite newsletter, and enquiries/claims logged in KV, plus site activity from git and
// growth signals (nearly-ranking queries, low click-through pages, pages without referrals,
// stalest guides) for the weekly growth plan.
// With --record it also appends the week's headline numbers to the "PRA weekly report" Google
// Sheet (skipped if that week is already there) and reports what it did under "sheet".
// Each source is fetched independently; a failure becomes { error } so the rest still reports.
//
// Environment ("PRA reports" cloud environment):
//   GA4_PROPERTY_ID      plain env var
//   GOOGLE_SA_KEY_B64    plain env var, base64 of the weekly-report service account JSON key
//   REPORT_SHEET_ID      plain env var, the Google Sheet the service account can edit
//   MailerLite and Cloudflare tokens are network secrets: the proxy adds the Authorization header
//   for connect.mailerlite.com and api.cloudflare.com, so this script sends none.
//
// Usage: node ops/weekly-report/report.mjs [--record] [YYYY-MM-DD week-ending Sunday]

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { google, googlePost, json, num, section, viaProxy } from './lib.mjs';

const TZ = 'Australia/Melbourne';
const GSC_SITE = 'sc-domain:psychedelicretreats.com.au';
const CF_ACCOUNT = '61c61738ace4a556c511de7636514119';
const KV_NAMESPACE = '7b5c8a2661294b7aba1965fcb1add676'; // psychedelicretreats-leads
const NEWSLETTER_GROUP = 'Newsletter';

// ---- Reporting window: the Monday–Sunday just ended (Melbourne time), and the week before ----

function melbourneToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date()); // YYYY-MM-DD
}
const addDays = (iso, n) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
function windows(weekEnding) {
  let end = weekEnding;
  if (!end) {
    const today = melbourneToday();
    const dow = new Date(`${today}T00:00:00Z`).getUTCDay(); // 0 = Sunday
    end = addDays(today, dow === 0 ? -7 : -dow);
  }
  const start = addDays(end, -6);
  return { cur: { start, end }, prev: { start: addDays(start, -7), end: addDays(start, -1) } };
}
// Melbourne midnight as epoch ms (handles DST by reading the zone's offset on that date).
function melbourneMidnight(iso) {
  const guess = new Date(`${iso}T00:00:00Z`);
  const offset = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'longOffset' })
    .formatToParts(guess)
    .find((p) => p.type === 'timeZoneName')
    .value.replace('GMT', '') || '+00:00';
  return Date.parse(`${iso}T00:00:00${offset}`);
}

// ---- GA4 ----

async function ga4(w) {
  const property = process.env.GA4_PROPERTY_ID;
  if (!property) throw new Error('GA4_PROPERTY_ID is not set');
  const run = (body) => googlePost(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`, body);
  const both = [
    { startDate: w.cur.start, endDate: w.cur.end, name: 'cur' },
    { startDate: w.prev.start, endDate: w.prev.end, name: 'prev' },
  ];
  const curOnly = [{ startDate: w.cur.start, endDate: w.cur.end }];
  const rangeIndex = (row) => row.dimensionValues.findIndex((d) => d.value === 'cur' || d.value === 'prev');

  const [totals, events, pages, channels, clicksByListing] = await Promise.all([
    run({ dateRanges: both, metrics: ['activeUsers', 'newUsers', 'sessions', 'screenPageViews'].map((name) => ({ name })) }),
    run({
      dateRanges: both,
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: { fieldName: 'eventName', inListFilter: { values: ['outbound_click', 'generate_lead', 'sign_up'] } },
      },
    }),
    run({
      dateRanges: curOnly,
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    }),
    run({
      dateRanges: both,
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    }),
    run({
      dateRanges: curOnly,
      dimensions: [{ name: 'customEvent:listing' }, { name: 'customEvent:link_type' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: { filter: { fieldName: 'eventName', stringFilter: { value: 'outbound_click' } } },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 15,
    }),
  ]);

  const metricNames = totals.metricHeaders.map((h) => h.name);
  const summary = { cur: {}, prev: {} };
  for (const row of totals.rows ?? []) {
    const range = row.dimensionValues[rangeIndex(row)]?.value ?? 'cur';
    metricNames.forEach((m, i) => (summary[range][m] = num(row.metricValues[i].value)));
  }
  const eventCounts = { cur: {}, prev: {} };
  for (const row of events.rows ?? []) {
    const name = row.dimensionValues.find((d) => !['cur', 'prev'].includes(d.value)).value;
    const range = row.dimensionValues[rangeIndex(row)].value;
    eventCounts[range][name] = num(row.metricValues[0].value);
  }
  // { cur: { 'Organic Search': n, ... }, prev: { ... } }
  function channelsByRange(res) {
    const out = { cur: {}, prev: {} };
    for (const row of res.rows ?? []) {
      const name = row.dimensionValues.find((d) => !['cur', 'prev'].includes(d.value)).value;
      out[row.dimensionValues[rangeIndex(row)].value][name] = num(row.metricValues[0].value);
    }
    return out;
  }
  return {
    totals: summary,
    events: eventCounts,
    topPages: (pages.rows ?? []).map((r) => ({ path: r.dimensionValues[0].value, views: num(r.metricValues[0].value) })),
    channels: channelsByRange(channels),
    outboundByListing: (clicksByListing.rows ?? []).map((r) => ({
      listing: r.dimensionValues[0].value,
      linkType: r.dimensionValues[1].value,
      clicks: num(r.metricValues[0].value),
    })),
  };
}

// ---- Search Console (data lags 2–3 days, so the last days of the week may be partial) ----

async function searchConsole(w) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`;
  const totals = async (r) => {
    const res = await googlePost(url, { startDate: r.start, endDate: r.end });
    const row = res.rows?.[0] ?? {};
    return { clicks: num(row.clicks), impressions: num(row.impressions), ctr: num(row.ctr), position: num(row.position) };
  };
  const [cur, prev, queries, pages] = await Promise.all([
    totals(w.cur),
    totals(w.prev),
    googlePost(url, { startDate: w.cur.start, endDate: w.cur.end, dimensions: ['query'], rowLimit: 10 }),
    googlePost(url, { startDate: w.cur.start, endDate: w.cur.end, dimensions: ['page'], rowLimit: 10 }),
  ]);
  const rows = (res) =>
    (res.rows ?? []).map((r) => ({ key: r.keys[0], clicks: num(r.clicks), impressions: num(r.impressions), position: num(r.position) }));
  return { cur, prev, topQueries: rows(queries), topPages: rows(pages), note: 'Last 2–3 days of the week may be incomplete in Search Console.' };
}

// ---- MailerLite (Authorization added by the network-secret proxy) ----

async function mailerlite(w) {
  const groups = viaProxy(`https://connect.mailerlite.com/api/groups?filter[name]=${encodeURIComponent(NEWSLETTER_GROUP)}`);
  const group = (groups.data ?? []).find((g) => g.name === NEWSLETTER_GROUP);
  if (!group) throw new Error(`MailerLite group "${NEWSLETTER_GROUP}" not found`);

  const curFrom = melbourneMidnight(w.cur.start);
  const curTo = melbourneMidnight(addDays(w.cur.end, 1));
  const prevFrom = melbourneMidnight(w.prev.start);
  let joinedCur = 0;
  let joinedPrev = 0;
  let cursor = '';
  for (let page = 0; page < 50; page++) {
    const res = viaProxy(
      `https://connect.mailerlite.com/api/groups/${group.id}/subscribers?limit=100${cursor ? `&cursor=${cursor}` : ''}`,
    );
    for (const s of res.data ?? []) {
      const t = Date.parse(`${(s.subscribed_at || s.created_at || '').replace(' ', 'T')}Z`);
      if (t >= curFrom && t < curTo) joinedCur++;
      else if (t >= prevFrom && t < curFrom) joinedPrev++;
    }
    cursor = res.meta?.next_cursor;
    if (!cursor) break;
  }
  return {
    activeSubscribers: num(group.active_count),
    unsubscribed: num(group.unsubscribed_count),
    openRate: group.open_rate?.float ?? null,
    clickRate: group.click_rate?.float ?? null,
    joined: { cur: joinedCur, prev: joinedPrev },
  };
}

// ---- Enquiries / claims logged to KV (Authorization added by the network-secret proxy) ----

async function leads(w) {
  const counts = { cur: { enquire: 0, claim: 0 }, prev: { enquire: 0, claim: 0 } };
  const curFrom = melbourneMidnight(w.cur.start);
  const curTo = melbourneMidnight(addDays(w.cur.end, 1));
  const prevFrom = melbourneMidnight(w.prev.start);
  let cursor = '';
  for (let page = 0; page < 50; page++) {
    const res = viaProxy(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/storage/kv/namespaces/${KV_NAMESPACE}/keys?prefix=log:&limit=1000${cursor ? `&cursor=${cursor}` : ''}`,
    );
    for (const { name } of res.result ?? []) {
      const [, type, ts] = name.split(':');
      const t = Number(ts);
      if (!(type in counts.cur)) continue;
      if (t >= curFrom && t < curTo) counts.cur[type]++;
      else if (t >= prevFrom && t < curFrom) counts.prev[type]++;
    }
    cursor = res.result_info?.cursor;
    if (!cursor) break;
  }
  return { ...counts, note: '"claim" includes contact-form messages (both post to /api/claim).' };
}

// ---- Growth signals: where the next gains are likely to come from ----

const SITE = 'https://psychedelicretreats.com.au';
const CONTENT_URL = { guides: '/guides/', news: '/news/', destinations: '/destinations/', listings: '/listing/' };

async function growthSignals(w) {
  const gscUrl = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`;
  // 28 days gives enough search data on a young site to spot patterns.
  const span = { start: addDays(w.cur.end, -27), end: w.cur.end };
  const [byQueryPage, byPage, gaPages] = await Promise.all([
    section(() => googlePost(gscUrl, { startDate: span.start, endDate: span.end, dimensions: ['query', 'page'], rowLimit: 500 })),
    section(() => googlePost(gscUrl, { startDate: span.start, endDate: span.end, dimensions: ['page'], rowLimit: 200 })),
    section(() =>
      googlePost(`https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:runReport`, {
        dateRanges: [{ startDate: span.start, endDate: span.end }],
        dimensions: [{ name: 'pagePath' }, { name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: { values: ['page_view', 'outbound_click'] } } },
        limit: 1000,
      }),
    ),
  ]);

  const out = { span };
  if (byQueryPage.error) out.nearlyRanking = byQueryPage;
  else
    // Queries already showing on pages 1–2 but below the top 3: a better title, heading or section can lift them.
    out.nearlyRanking = (byQueryPage.rows ?? [])
      .map((r) => ({ query: r.keys[0], page: r.keys[1].replace(SITE, ''), impressions: num(r.impressions), clicks: num(r.clicks), position: Math.round(num(r.position) * 10) / 10 }))
      .filter((r) => r.position >= 4 && r.position <= 20)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 20);
  if (byPage.error) out.lowClickThrough = byPage;
  else
    // Seen in search but rarely clicked: the title and description aren't earning the click.
    out.lowClickThrough = (byPage.rows ?? [])
      .map((r) => ({ page: r.keys[0].replace(SITE, ''), impressions: num(r.impressions), clicks: num(r.clicks), ctr: Math.round(num(r.ctr) * 1000) / 10, position: Math.round(num(r.position) * 10) / 10 }))
      .filter((r) => r.impressions >= 20 && r.ctr < 2)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 10);
  if (gaPages.error) out.viewsWithoutReferrals = gaPages;
  else {
    const pages = {};
    for (const r of gaPages.rows ?? []) {
      const [path, event] = r.dimensionValues.map((d) => d.value);
      pages[path] ??= { page: path, views: 0, operatorClicks: 0 };
      pages[path][event === 'page_view' ? 'views' : 'operatorClicks'] += num(r.metricValues[0].value);
    }
    // Listing and guide pages people read without clicking through to an operator.
    out.viewsWithoutReferrals = Object.values(pages)
      .filter((p) => /^\/(listing|guides|retreats|destinations)\//.test(p.page) && p.views >= 3 && p.operatorClicks === 0)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }
  out.stalest = staleContent();
  return out;
}

// Guides and destination pages ordered by last update, oldest first.
function staleContent() {
  const rows = [];
  for (const dir of ['guides', 'destinations']) {
    for (const file of execSync(`git ls-files src/content/${dir}`, { encoding: 'utf8' }).split('\n').filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))) {
      const text = readFileSync(file, 'utf8');
      const date = (text.match(/^(?:lastReviewed|updatedAt):\s*"?([0-9-]{10})/m) ?? [])[1];
      const title = (text.match(/^title:\s*"?(.+?)"?\s*$/m) ?? [])[1];
      const slug = file.split('/').pop().replace(/\.mdx?$/, '');
      rows.push({ page: `${CONTENT_URL[dir]}${slug}/`, title, updated: date ?? 'unknown' });
    }
  }
  return rows.sort((a, b) => a.updated.localeCompare(b.updated)).slice(0, 8);
}

// ---- Site activity from the repo ----

function siteActivity(w) {
  const since = `${w.cur.start}T00:00:00+10:00`;
  const until = `${addDays(w.cur.end, 1)}T00:00:00+10:00`;
  const git = (args) => execSync(`git ${args}`, { encoding: 'utf8' }).trim();
  const changed = (path) =>
    git(`log --since="${since}" --until="${until}" --diff-filter=A --name-only --format= -- ${path}`).split('\n').filter(Boolean);
  const count = (dir) => Number(git(`ls-files ${dir} | wc -l`));
  return {
    newListings: changed('src/content/listings/'),
    newNews: changed('src/content/news/'),
    newGuides: changed('src/content/guides/'),
    listingsEdited: git(`log --since="${since}" --until="${until}" --diff-filter=M --name-only --format= -- src/content/listings/`)
      .split('\n')
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i),
    routineAutoPublishes: Number(git(`log --since="${since}" --until="${until}" --oneline --grep="Routine auto-publish" | wc -l`)),
    totals: { listings: count('src/content/listings'), news: count('src/content/news'), guides: count('src/content/guides') },
  };
}

async function siteUp() {
  const started = Date.now();
  const res = await fetch('https://psychedelicretreats.com.au/', { redirect: 'manual' });
  return { status: res.status, ms: Date.now() - started };
}

// ---- Google Sheet history (one row per week) ----

const SHEET_COLUMNS = [
  ['Week ending', (r) => r.window.cur.end],
  ['Visitors', (r) => r.ga4.totals?.cur.activeUsers],
  ['New users', (r) => r.ga4.totals?.cur.newUsers],
  ['Sessions', (r) => r.ga4.totals?.cur.sessions],
  ['Page views', (r) => r.ga4.totals?.cur.screenPageViews],
  ['Organic search sessions', (r) => r.ga4.channels?.cur['Organic Search'] ?? (r.ga4.channels ? 0 : undefined)],
  ['Search clicks', (r) => r.searchConsole.cur?.clicks],
  ['Search impressions', (r) => r.searchConsole.cur?.impressions],
  ['Operator clicks', (r) => (r.ga4.events ? r.ga4.events.cur.outbound_click ?? 0 : undefined)],
  ['Enquiries', (r) => r.leads.cur?.enquire],
  ['Claims/contact', (r) => r.leads.cur?.claim],
  ['Newsletter joins', (r) => r.newsletter.joined?.cur],
  ['Subscribers', (r) => r.newsletter.activeSubscribers],
  ['Listings live', (r) => r.site.totals?.listings],
  ['Recorded at', () => new Date().toISOString()],
];

async function recordInSheet(report) {
  const id = process.env.REPORT_SHEET_ID;
  if (!id) throw new Error('REPORT_SHEET_ID is not set');
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values`;
  const auth = { Authorization: `Bearer ${await google()}` };
  const existing = await json(`${base}/A:A`, { headers: auth });
  const weeks = (existing.values ?? []).map((row) => row[0]);
  const week = report.window.cur.end;
  if (weeks.includes(week)) return { status: 'already recorded', week };

  const rows = weeks.length ? [] : [SHEET_COLUMNS.map(([name]) => name)];
  // Missing data stays blank rather than 0, so a failed source is visible in the sheet.
  rows.push(SHEET_COLUMNS.map(([, get]) => get(report) ?? ''));
  await json(`${base}/A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: rows }),
  });
  return { status: 'recorded', week, url: `https://docs.google.com/spreadsheets/d/${id}` };
}

// ---- Main ----

const args = process.argv.slice(2);
const w = windows(args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)));
const [ga, gsc, ml, kv, up] = await Promise.all([
  section(() => ga4(w)),
  section(() => searchConsole(w)),
  section(() => mailerlite(w)),
  section(() => leads(w)),
  section(siteUp),
]);
const growth = await section(() => growthSignals(w));
const report = {
  window: w,
  proxy: process.env.HTTPS_PROXY || process.env.https_proxy ? 'set' : 'unset',
  ga4: ga,
  searchConsole: gsc,
  newsletter: ml,
  leads: kv,
  site: { up, ...(await section(() => siteActivity(w))) },
  growth,
};
if (args.includes('--record')) report.sheet = await section(() => recordInSheet(report));
console.log(JSON.stringify(report, null, 2));
