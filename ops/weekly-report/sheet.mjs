// Read or append rows on a tab of the "PRA weekly report" Google Sheet (REPORT_SHEET_ID).
//
//   node ops/weekly-report/sheet.mjs read "Growth log"              → JSON array of row objects
//   node ops/weekly-report/sheet.mjs append "Growth log" rows.json  → appends; rows.json is an array of objects
//
// The tab is created if missing, and its header row is taken from the first object's keys.
// Appended values follow the existing header, so column order never drifts.

import { readFileSync } from 'node:fs';
import { google, json } from './lib.mjs';

const [command, tab, file] = process.argv.slice(2);
const id = process.env.REPORT_SHEET_ID;
if (!id) throw new Error('REPORT_SHEET_ID is not set');
if (!['read', 'append'].includes(command) || !tab) {
  console.error('usage: sheet.mjs read <tab> | append <tab> <rows.json>');
  process.exit(2);
}

const base = `https://sheets.googleapis.com/v4/spreadsheets/${id}`;
const auth = { Authorization: `Bearer ${await google()}` };
const range = (r) => encodeURIComponent(`'${tab.replace(/'/g, "''")}'!${r}`);

async function ensureTab() {
  const meta = await json(`${base}?fields=sheets.properties.title`, { headers: auth });
  if (meta.sheets.some((s) => s.properties.title === tab)) return;
  await json(`${base}:batchUpdate`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tab } } }] }),
  });
}

await ensureTab();
const existing = (await json(`${base}/values/${range('A:Z')}`, { headers: auth })).values ?? [];

if (command === 'read') {
  const [header = [], ...rows] = existing;
  console.log(JSON.stringify(rows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? '']))), null, 2));
} else {
  const items = JSON.parse(readFileSync(file, 'utf8'));
  if (!Array.isArray(items) || !items.length) throw new Error('rows file must be a non-empty JSON array of objects');
  const header = existing[0] ?? Object.keys(items[0]);
  const values = items.map((item) => header.map((h) => item[h] ?? ''));
  if (!existing.length) values.unshift(header);
  await json(`${base}/values/${range('A1')}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values }),
  });
  console.log(JSON.stringify({ appended: items.length, tab }));
}
