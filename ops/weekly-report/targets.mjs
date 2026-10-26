// Progress against the growth targets in the sheet's "Targets" tab, using the "Weekly" tab's history.
//
//   node ops/weekly-report/targets.mjs   → JSON array, one entry per target
//
// Targets tab columns: Metric | Measure | Baseline | Baseline date | then pairs "On track YYYY-MM-DD" /
// "Stretch YYYY-MM-DD" for each milestone. Measure is one of:
//   sum4:<Weekly column>   sum of the latest 4 weekly rows (a monthly figure)
//   last:<Weekly column>   the latest weekly value
//   manual                 not tracked automatically (e.g. revenue)
// "Expected now" is a straight line from the previous point (baseline or last milestone) to the next
// milestone's on-track value; status compares the actual figure against it.

import { readTab } from './lib.mjs';

const [weekly, targets] = await Promise.all([readTab('Weekly'), readTab('Targets')]);
const latest = weekly.filter((r) => /^\d{4}-\d{2}-\d{2}$/.test(r['Week ending'])).sort((a, b) => a['Week ending'].localeCompare(b['Week ending']));
const asOf = latest.at(-1)?.['Week ending'];
const day = (iso) => Date.parse(`${iso}T00:00:00Z`) / 86400000;

function actual(measure) {
  const [kind, column] = measure.split(':');
  if (kind === 'sum4') {
    const rows = latest.slice(-4).filter((r) => r[column] !== '');
    return rows.length ? { value: rows.reduce((n, r) => n + Number(r[column]), 0), weeks: rows.length } : null;
  }
  if (kind === 'last') {
    const row = [...latest].reverse().find((r) => r[column] !== '');
    return row ? { value: Number(row[column]), weeks: 1 } : null;
  }
  return null;
}

const out = targets.map((t) => {
  const milestones = Object.keys(t)
    .map((k) => k.match(/^On track (\d{4}-\d{2}-\d{2})$/)?.[1])
    .filter(Boolean)
    .sort()
    .map((date) => ({ date, onTrack: Number(t[`On track ${date}`]), stretch: Number(t[`Stretch ${date}`]) }));
  const a = actual(t.Measure);
  const next = milestones.find((m) => m.date >= asOf) ?? milestones.at(-1);
  const prevIdx = milestones.indexOf(next) - 1;
  const from = prevIdx >= 0 ? { date: milestones[prevIdx].date, value: milestones[prevIdx].onTrack } : { date: t['Baseline date'], value: Number(t.Baseline) };
  const share = Math.min(1, Math.max(0, (day(asOf) - day(from.date)) / (day(next.date) - day(from.date))));
  const expected = Math.round(from.value + (next.onTrack - from.value) * share);
  const entry = { metric: t.Metric, asOf, actual: a?.value ?? null, expectedNow: expected, nextMilestone: next };
  if (!a) entry.status = t.Measure === 'manual' ? 'not tracked automatically' : 'no data yet';
  else if (a.weeks < 4 && t.Measure.startsWith('sum4')) entry.status = `only ${a.weeks} week(s) of data`;
  else if (a.value >= expected) entry.status = 'on track';
  else entry.status = 'behind';
  if (a && expected > 0) entry.percentOfExpected = Math.round((a.value / expected) * 100);
  return entry;
});
console.log(JSON.stringify(out, null, 2));
