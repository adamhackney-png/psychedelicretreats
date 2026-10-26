// Weekly metrics for psychedelicretreats.com.au — run by the "PRA weekly report" routine.
//
// Prints one JSON object: this week vs last week for GA4 traffic and events, Search Console,
// MailerLite newsletter, and enquiries/claims logged in KV, plus site activity from git.
// Each source is fetched independently; a failure becomes { error } so the rest still reports.
//
// Environment ("PRA reports" cloud environment):
//   GA4_PROPERTY_ID      plain env var
//   GOOGLE_SA_KEY_B64    plain env var, base64 of the weekly-report service account JSON key
//   MailerLite and Cloudflare tokens are network secrets: the proxy adds the Authorization header
//   for connect.mailerlite.com and api.cloudflare.com, so this script sends none.
//
// Usage: node ops/weekly-report/report.mjs [YYYY-MM-DD week-ending Sunday]

import { createSign } from 'node:crypto';
import { execFileSync, execSync } from 'node:child_process';

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

// ---- Helpers ----

async function json(url, init = {}) {
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${url.split('?')[0]}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}
// GET through curl, which honours the session's HTTPS_PROXY: network secrets are added by that
// proxy, and Node's fetch bypasses it.
function viaProxy(url) {
  const out = execFileSync('curl', ['-sSg', '-H', 'Accept: application/json', '-w', '\n%{http_code}', url], {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });
  const i = out.lastIndexOf('\n');
  const status = Number(out.slice(i + 1));
  const text = out.slice(0, i);
  if (status < 200 || status >= 300) throw new Error(`${status} ${url.split('?')[0]}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}
async function section(fn) {
  try {
    return await fn();
  } catch (err) {
    return { error: String(err.message || err) };
  }
}
const num = (v) => Number(v ?? 0);

// ---- Google (service account JWT → access token) ----

let googleToken;
async function google() {
  if (googleToken) return googleToken;
  const b64 = process.env.GOOGLE_SA_KEY_B64;
  if (!b64) throw new Error('GOOGLE_SA_KEY_B64 is not set');
  const key = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  const now = Math.floor(Date.now() / 1000);
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned = `${enc({ alg: 'RS256', typ: 'JWT' })}.${enc({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url');
  const res = await json('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  googleToken = res.access_token;
  return googleToken;
}
async function googlePost(url, body) {
  return json(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await google()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
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

// ---- Main ----

const w = windows(process.argv[2]);
const [ga, gsc, ml, kv, up] = await Promise.all([
  section(() => ga4(w)),
  section(() => searchConsole(w)),
  section(() => mailerlite(w)),
  section(() => leads(w)),
  section(siteUp),
]);
console.log(
  JSON.stringify(
    { window: w, proxy: process.env.HTTPS_PROXY || process.env.https_proxy ? 'set' : 'unset', ga4: ga, searchConsole: gsc, newsletter: ml, leads: kv, site: { up, ...(await section(() => siteActivity(w))) } },
    null,
    2,
  ),
);
