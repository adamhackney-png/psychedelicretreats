// Create (never send) a MailerLite campaign draft for the Newsletter group.
//
//   node ops/weekly-report/newsletter-draft.mjs draft.json
//
// draft.json: { "name": "Monthly digest — November 2026", "subject": "...", "html": "<full HTML email>" }
// Adam reviews and sends it from MailerLite → Campaigns → Drafts. The MailerLite token is a network
// secret, so requests go through curl (viaProxy) for the proxy to add it.

import { readFileSync } from 'node:fs';
import { viaProxy } from './lib.mjs';

const draft = JSON.parse(readFileSync(process.argv[2], 'utf8'));
for (const key of ['name', 'subject', 'html']) if (!draft[key]) throw new Error(`draft.json is missing "${key}"`);

const groups = viaProxy('https://connect.mailerlite.com/api/groups?filter[name]=Newsletter');
const group = (groups.data ?? []).find((g) => g.name === 'Newsletter');
if (!group) throw new Error('MailerLite group "Newsletter" not found');

const res = viaProxy('https://connect.mailerlite.com/api/campaigns', {
  method: 'POST',
  body: {
    name: draft.name,
    type: 'regular',
    groups: [group.id],
    emails: [
      {
        subject: draft.subject,
        from_name: 'Psychedelic Retreats Australia',
        from: 'info@psychedelicretreats.com.au',
        content: draft.html,
      },
    ],
  },
});
console.log(JSON.stringify({ draftCreated: res.data?.id, status: res.data?.status, open: 'https://dashboard.mailerlite.com/campaigns/status/draft' }));
