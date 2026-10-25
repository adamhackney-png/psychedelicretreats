interface SendEmailOptions {
  apiKey: string | undefined;
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
}

const FROM_ADDRESS = 'Psychedelic Retreats Australia <noreply@psychedelicretreats.com.au>';

/**
 * Sends via Resend if RESEND_API_KEY is set. Swap for MailChannels here if you use that instead — see README.
 * Failures are logged (Pages → Functions logs) and returned, so callers must not report success on false.
 */
export async function sendEmail({ apiKey, to, replyTo, subject, text }: SendEmailOptions): Promise<boolean> {
  if (!apiKey) {
    console.error('sendEmail: RESEND_API_KEY is not set');
    return false;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to,
      reply_to: replyTo,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    console.error(`sendEmail: Resend returned ${response.status}: ${await response.text()}`);
  }
  return response.ok;
}
