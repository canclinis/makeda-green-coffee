const INBOX = 'info@makedagreencoffee.com';

export type OutboundMail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

export type MailSender = (mail: OutboundMail) => Promise<void>;

type SendResult = { ok: true } | { ok: false };

export async function sendContactMessage(input: unknown, send: MailSender): Promise<SendResult> {
  const message = parseContactMessage(input);
  if (!message) return { ok: false };

  try {
    await send({
      from: `Makeda Green Coffee <${INBOX}>`,
      to: INBOX,
      replyTo: message.email,
      subject: message.subject,
      text: `Name: ${message.name}\nEmail: ${message.email}\n\n${message.message}`
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

function parseContactMessage(input: unknown) {
  if (!input || typeof input !== 'object') return null;

  const record = input as Record<string, unknown>;
  if (record.consent !== true) return null;

  const name = trimmed(record.name, 200);
  const email = trimmed(record.email, 200);
  const subject = trimmed(record.subject, 200);
  const message = trimmed(record.message, 5000);
  if (!name || !email || !subject || !message) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return { name, email, subject, message };
}

function trimmed(value: unknown, max: number) {
  if (typeof value !== 'string') return '';
  const text = value.trim();
  if (!text || text.length > max) return '';
  return text;
}
