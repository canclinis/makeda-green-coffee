// The live site already delivers this form to the company inbox.
// Keep using that form until this app has its own mail transport.
const COMPANY_SITE = 'https://makedagreencoffee.com/';

export type ContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: true;
};

type SendResult = { ok: true } | { ok: false };

export async function sendContactMessage(
  input: unknown,
  fetchImpl: typeof fetch = fetch
): Promise<SendResult> {
  const message = parseContactMessage(input);
  if (!message) return { ok: false };

  const page = await fetchImpl(COMPANY_SITE);
  if (!page.ok) return { ok: false };

  const form = (await page.text()).match(
    /<form\b[^>]*data-uk-yooessentials-form[\s\S]*?<\/form>/i
  )?.[0];
  const submission = form ? buildCompanySubmission(form, message) : null;
  if (!submission) return { ok: false };

  const response = await fetchImpl(submission.action, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
      Referer: COMPANY_SITE
    },
    body: submission.body
  });

  try {
    const payload = (await response.json()) as { success?: boolean };
    return payload.success === true ? { ok: true } : { ok: false };
  } catch {
    return { ok: false };
  }
}

function parseContactMessage(input: unknown): ContactMessage | null {
  if (!input || typeof input !== 'object') return null;

  const record = input as Record<string, unknown>;
  if (record.consent !== true) return null;

  const name = trimmed(record.name, 200);
  const email = trimmed(record.email, 200);
  const subject = trimmed(record.subject, 200);
  const message = trimmed(record.message, 5000);
  if (!name || !email || !subject || !message) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return { name, email, subject, message, consent: true };
}

function trimmed(value: unknown, max: number) {
  if (typeof value !== 'string') return '';
  const text = value.trim();
  if (!text || text.length > max) return '';
  return text;
}

function buildCompanySubmission(source: string, message: ContactMessage) {
  const action = decodeHtml(source.match(/<form\b[^>]*\baction="([^"]+)"/i)?.[1] ?? '');
  const formid = source.match(/name="formid" value="([^"]+)"/)?.[1] ?? '';
  const nonce = source.match(/name="_wpnonce_yooessentials" value="([^"]+)"/)?.[1] ?? '';
  const checkbox = source.match(/name="(checkbox[^"]+)"/)?.[1] ?? '';
  if (!action || !formid || !nonce || !checkbox) return null;

  const body = new URLSearchParams({
    name: message.name,
    email: message.email,
    subject: message.subject,
    message: message.message,
    formid,
    _wpnonce_yooessentials: nonce
  });
  body.set(checkbox, 'privacy');

  return { action, body };
}

function decodeHtml(value: string) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}
