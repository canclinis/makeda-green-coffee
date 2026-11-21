export type SampleStatus = 'ordered' | 'sent' | 'received';

export type SampleRecord = {
  id: string;
  customerId: string;
  status: SampleStatus;
  comment: string;
  owner: string;
  coffees: string;
  amount: string;
  message: string;
  requestedAt: string;
};

export type SampleLogResult =
  { ok: true; samples: SampleRecord[] } | { ok: false; message: string };

const STATUSES: SampleStatus[] = ['ordered', 'sent', 'received'];
const ROW_ID = /^[A-Za-z0-9_-]{1,80}$/;
const COMMENT_MAX = 500;
const OWNER_MAX = 200;
const COFFEES_MAX = 2000;
const AMOUNT_MAX = 200;
const MESSAGE_MAX = 2000;
const REQUESTED_MAX = 40;

const UNREADABLE = 'The sample list could not be read.';
const CUSTOMER_REQUIRED = 'Each sample needs a customer.';
const OWNER_UNKNOWN = 'Assign the sample to someone on the admin list.';

export function parseSampleLog(value: unknown, owners?: string[]): SampleLogResult {
  if (!Array.isArray(value)) return { ok: false, message: UNREADABLE };

  const samples: SampleRecord[] = [];
  for (const raw of value) {
    const parsed = parseSample(raw, owners);
    if (!parsed.ok) return parsed;
    samples.push(parsed.sample);
  }
  return { ok: true, samples };
}

/**
 * Applies owner, status, and comment edits without dropping a request that arrived later.
 * Rows the page never loaded and the store does not have are samples added by hand.
 */
export function mergeSampleEdits(
  current: SampleRecord[],
  submitted: SampleRecord[],
  loadedIds: string[]
): SampleRecord[] {
  const loaded = new Set(loadedIds);
  const known = new Set(current.map((sample) => sample.id));
  const added = submitted.filter((sample) => !loaded.has(sample.id) && !known.has(sample.id));
  const arrived = current.filter((sample) => !loaded.has(sample.id));
  const edited = submitted.flatMap((sample) => {
    if (!loaded.has(sample.id)) return [];
    const previous = current.find((row) => row.id === sample.id);
    if (!previous) return [];
    return [{ ...previous, owner: sample.owner, status: sample.status, comment: sample.comment }];
  });
  return [...added, ...arrived, ...edited];
}

export function parseStoredSamples(value: unknown): SampleRecord[] {
  const parsed = parseSampleLog(value);
  if (!parsed.ok) {
    if (!Array.isArray(value)) throw new Error('Sample file is not a list.');
    throw new Error('Sample file could not be read.');
  }
  return parsed.samples;
}

function parseSample(
  value: unknown,
  owners?: string[]
): { ok: true; sample: SampleRecord } | { ok: false; message: string } {
  if (!isRecord(value)) return { ok: false, message: CUSTOMER_REQUIRED };

  const comment = readText(value.comment, COMMENT_MAX, true);
  const owner = readText(value.owner, OWNER_MAX, false);
  const coffees = readText(value.coffees, COFFEES_MAX, true);
  const amount = readText(value.amount, AMOUNT_MAX, false);
  const message = readText(value.message, MESSAGE_MAX, true);
  const requestedAt = readText(value.requestedAt, REQUESTED_MAX, false);
  const status = value.status;
  if (typeof value.comment === 'string' && value.comment.trim().length > COMMENT_MAX) {
    return { ok: false, message: 'Keep each comment under 500 characters.' };
  }
  if (
    comment === null ||
    owner === null ||
    coffees === null ||
    amount === null ||
    message === null ||
    requestedAt === null ||
    typeof status !== 'string'
  ) {
    return { ok: false, message: CUSTOMER_REQUIRED };
  }
  if (!isStatus(status))
    return { ok: false, message: 'Each sample is ordered, sent, or received.' };

  const knownOwner = owner.toLowerCase();
  if (owners && knownOwner !== '' && !owners.includes(knownOwner)) {
    return { ok: false, message: OWNER_UNKNOWN };
  }

  const customerId = typeof value.customerId === 'string' ? value.customerId.trim() : '';
  if (!ROW_ID.test(customerId)) return { ok: false, message: CUSTOMER_REQUIRED };
  if (typeof value.id !== 'string' || !ROW_ID.test(value.id)) {
    return { ok: false, message: CUSTOMER_REQUIRED };
  }

  return {
    ok: true,
    sample: {
      id: value.id,
      customerId,
      status,
      comment,
      owner: knownOwner,
      coffees,
      amount,
      message,
      requestedAt
    }
  };
}

function readText(value: unknown, max: number, multiline: boolean): string | null {
  if (value == null) return '';
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (text.length > max) return null;
  if (!multiline && /[\r\n]/.test(text)) return null;
  return text;
}

function isStatus(value: string): value is SampleStatus {
  return STATUSES.some((status) => status === value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
