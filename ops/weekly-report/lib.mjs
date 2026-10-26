// Shared helpers for the weekly report and growth scripts (see report.mjs for the environment).

import { createSign } from 'node:crypto';
import { execFileSync } from 'node:child_process';

export async function json(url, init = {}) {
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${url.split('?')[0]}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}
// GET through curl, which honours the session's HTTPS_PROXY: network secrets are added by that
// proxy, and Node's fetch bypasses it.
export function viaProxy(url, { method = 'GET', body } = {}) {
  const args = ['-sSg', '-X', method, '-H', 'Accept: application/json', '-w', '\n%{http_code}', url];
  if (body !== undefined) args.push('-H', 'Content-Type: application/json', '--data-binary', '@-');
  const out = execFileSync('curl', args, {
    encoding: 'utf8',
    input: body === undefined ? undefined : JSON.stringify(body),
    maxBuffer: 50 * 1024 * 1024,
  });
  const i = out.lastIndexOf('\n');
  const status = Number(out.slice(i + 1));
  const text = out.slice(0, i);
  if (status < 200 || status >= 300) throw new Error(`${status} ${url.split('?')[0]}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}
export async function section(fn) {
  try {
    return await fn();
  } catch (err) {
    return { error: String(err.message || err) };
  }
}
export const num = (v) => Number(v ?? 0);

// ---- Google (service account JWT → access token) ----

let googleToken;
export async function google() {
  if (googleToken) return googleToken;
  const b64 = process.env.GOOGLE_SA_KEY_B64;
  if (!b64) throw new Error('GOOGLE_SA_KEY_B64 is not set');
  const key = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  const now = Math.floor(Date.now() / 1000);
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned = `${enc({ alg: 'RS256', typ: 'JWT' })}.${enc({
    iss: key.client_email,
    scope: [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/spreadsheets',
    ].join(' '),
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
export async function googlePost(url, body) {
  return json(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await google()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// Rows of a tab in the "PRA weekly report" sheet (REPORT_SHEET_ID) as objects keyed by the header row.
export async function readTab(tab) {
  const id = process.env.REPORT_SHEET_ID;
  if (!id) throw new Error('REPORT_SHEET_ID is not set');
  const range = encodeURIComponent(`'${tab.replace(/'/g, "''")}'!A:Z`);
  const res = await json(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}`, {
    headers: { Authorization: `Bearer ${await google()}` },
  });
  const [header = [], ...rows] = res.values ?? [];
  return rows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}
