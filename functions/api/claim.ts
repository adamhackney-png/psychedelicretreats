import type { Env } from '../lib/types';
import { verifyTurnstile } from '../lib/turnstile';
import { isRateLimited } from '../lib/rateLimit';
import { sendEmail } from '../lib/email';
import { isValidEmail, cleanString } from '../lib/validate';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';

  if (await isRateLimited(env.RETREATS_LOG_KV, ip, 'claim')) {
    return Response.json({ ok: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const name = cleanString(body.name, 200);
  const email = cleanString(body.email, 254);
  const role = cleanString(body.role, 200);
  const message = cleanString(body.message, 4000);
  const listingSlug = cleanString(body.listingSlug, 200);
  const listingName = cleanString(body.listingName, 200);
  const turnstileToken = cleanString(body['cf-turnstile-response'], 4000);

  if (!name || !isValidEmail(email) || !message) {
    return Response.json({ ok: false, error: 'Please fill in all required fields with a valid email.' }, { status: 400 });
  }

  const verified = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET, ip);
  if (!verified) {
    return Response.json({ ok: false, error: 'Verification failed. Please try again.' }, { status: 403 });
  }

  const subject = `Claim / operator request${listingName ? `: ${listingName}` : ''}`;
  const text = [
    `New claim/intake request from ${name} <${email}>`,
    role ? `Role: ${role}` : null,
    listingName ? `Listing: ${listingName} (${listingSlug})` : 'No existing listing referenced (new operator enquiry)',
    '',
    message,
  ]
    .filter(Boolean)
    .join('\n');

  await sendEmail({
    apiKey: env.RESEND_API_KEY,
    to: [env.CONTACT_EMAIL],
    replyTo: email,
    subject,
    text,
  });

  if (env.RETREATS_LOG_KV) {
    const logKey = `log:claim:${Date.now()}:${crypto.randomUUID()}`;
    await env.RETREATS_LOG_KV.put(
      logKey,
      JSON.stringify({ type: 'claim', name, email, role, listingSlug, listingName, message, ip, at: new Date().toISOString() }),
    );
  }

  return Response.json({ ok: true });
};
