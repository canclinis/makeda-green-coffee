import { commercialLots, specialtyLots } from '../home/coffee-lots.ts';
import { findCustomerByEmail, type CustomerRecord } from '../home/customer-log.ts';
import type { SampleRecord } from '../home/sample-log.ts';
import { sampleSizes } from '../home/sample-sizes.ts';
import type { MailSender, OutboundMail } from './contact-mail.ts';

export type { OutboundMail };

const INBOX = 'info@makedagreencoffee.com';

const offers = [...specialtyLots, ...commercialLots];

type SendResult = { ok: true } | { ok: false };

type Store<Row> = {
  read: () => Promise<Row[]>;
  write: (rows: Row[]) => Promise<void>;
};

type RequestFiles = {
  customers: Store<CustomerRecord>;
  samples: Store<SampleRecord>;
};

const COMMENT_MAX = 500;

export async function fileSampleRequest(
  input: unknown,
  send: MailSender,
  files: RequestFiles,
  ids: { sample: string; customer: string },
  requestedAt: string,
  siteUrl: string
): Promise<SendResult> {
  const request = parseSampleRequest(input);
  if (!request) return { ok: false };

  const mailed = await sendSampleRequest(input, send, siteUrl);
  if (!mailed.ok) return { ok: false };

  const customers = await files.customers.read();
  const saved = findCustomerByEmail(customers, request.email);
  const customer = saved ?? { ...contactOf(request), id: ids.customer };
  if (!saved) await files.customers.write([customer, ...customers]);

  const samples = await files.samples.read();
  await files.samples.write([
    sampleRow(
      request,
      customer.id,
      saved ? differences(saved, request) : '',
      ids.sample,
      requestedAt
    ),
    ...samples
  ]);
  return { ok: true };
}

export async function sendSampleRequest(
  input: unknown,
  send: MailSender,
  siteUrl: string
): Promise<SendResult> {
  const request = parseSampleRequest(input);
  if (!request) return { ok: false };

  const lines = request.lots.map((lot) => `- ${lot.origin} · ${lot.crop}`);
  const amount = `${request.size.label} of each — ${request.size.paid ? 'paid, send price' : 'free'}`;

  try {
    await send({
      from: `Makeda Green Coffee <${INBOX}>`,
      to: INBOX,
      replyTo: request.email,
      subject: request.size.paid
        ? `Sample request — ${request.name} (price to send)`
        : `Free sample request — ${request.name}`,
      text: [
        `Log this request: ${siteUrl}/admin/samples`,
        '',
        'Samples',
        ...lines,
        '',
        amount,
        ...(request.message ? ['', 'Message', request.message] : []),
        '',
        'Send to',
        request.name,
        request.roastery,
        request.email,
        ...(request.phone ? [request.phone] : []),
        request.street,
        `${request.postalCode} ${request.city}`,
        request.country
      ].join('\n')
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

type SampleRequest = NonNullable<ReturnType<typeof parseSampleRequest>>;

function contactOf(request: SampleRequest): Omit<CustomerRecord, 'id'> {
  return {
    name: request.name,
    roastery: request.roastery,
    email: request.email,
    phone: request.phone,
    street: request.street,
    postalCode: request.postalCode,
    city: request.city,
    country: request.country
  };
}

const detailLabels: [keyof Omit<CustomerRecord, 'id' | 'email'>, string][] = [
  ['name', 'Name'],
  ['roastery', 'Roastery'],
  ['phone', 'Phone'],
  ['street', 'Street'],
  ['postalCode', 'Postal code'],
  ['city', 'City'],
  ['country', 'Country']
];

/** What the form said that the saved customer does not already have. */
function differences(saved: CustomerRecord, request: SampleRequest): string {
  const said = contactOf(request);
  const changed = detailLabels
    .filter(([key]) => said[key] !== '' && said[key].toLowerCase() !== saved[key].toLowerCase())
    .map(([key, label]) => `${label}: ${said[key]}`);
  if (changed.length === 0) return '';
  return `Request form said — ${changed.join('; ')}`.slice(0, COMMENT_MAX);
}

function sampleRow(
  request: SampleRequest,
  customerId: string,
  comment: string,
  id: string,
  requestedAt: string
): SampleRecord {
  return {
    id,
    customerId,
    status: 'ordered',
    comment,
    owner: '',
    coffees: request.lots.map((lot) => `${lot.origin} · ${lot.crop}`).join('\n'),
    amount: `${request.size.label} of each — ${request.size.paid ? 'paid, send price' : 'free'}`,
    message: request.message,
    requestedAt
  };
}

function parseSampleRequest(input: unknown) {
  if (!input || typeof input !== 'object') return null;

  const record = input as Record<string, unknown>;
  if (record.consent !== true) return null;

  const lots = parseLots(record.samples);
  const size = sampleSizes.find((option) => option.grams === record.grams);
  if (!lots || !size) return null;

  const roastery = oneLine(record.roastery, 200);
  const name = oneLine(record.name, 200);
  const email = oneLine(record.email, 200);
  const phone = optionalLine(record.phone, 40);
  const street = oneLine(record.street, 200);
  const postalCode = oneLine(record.postalCode, 20);
  const city = oneLine(record.city, 100);
  const country = oneLine(record.country, 100);
  const message = optionalMessage(record.message);
  if (!roastery || !name || !email || !street || !postalCode || !city || !country) return null;
  if (phone === null || message === null) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return {
    lots,
    size,
    roastery,
    name,
    email,
    phone,
    street,
    postalCode,
    city,
    country,
    message
  };
}

function parseLots(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) return null;

  const lots: typeof offers = [];
  for (const id of value) {
    const lot = offers.find((offer) => offer.id === id);
    if (!lot || lots.some((chosen) => chosen.id === lot.id)) return null;
    lots.push(lot);
  }
  return lots;
}

function optionalLine(value: unknown, max: number) {
  if (value == null || value === '') return '';
  const text = oneLine(value, max);
  return text || null;
}

function optionalMessage(value: unknown) {
  if (value == null || value === '') return '';
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (text.length > 2000) return null;
  return text;
}

function oneLine(value: unknown, max: number) {
  const text = trimmed(value, max);
  if (/[\r\n]/.test(text)) return '';
  return text;
}

function trimmed(value: unknown, max: number) {
  if (typeof value !== 'string') return '';
  const text = value.trim();
  if (!text || text.length > max) return '';
  return text;
}
