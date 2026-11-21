export type CustomerRecord = {
  id: string;
  name: string;
  roastery: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
};

export type CustomerListResult =
  { ok: true; customers: CustomerRecord[] } | { ok: false; message: string };

const ROW_ID = /^[A-Za-z0-9_-]{1,80}$/;
const LIMITS = {
  name: 200,
  roastery: 200,
  email: 200,
  phone: 40,
  street: 200,
  postalCode: 20,
  city: 100,
  country: 100
};

const UNREADABLE = 'The customer list could not be read.';
const NAME_REQUIRED = 'Enter a name for each customer.';

export function parseCustomerList(value: unknown): CustomerListResult {
  if (!Array.isArray(value)) return { ok: false, message: UNREADABLE };

  const customers: CustomerRecord[] = [];
  for (const raw of value) {
    const parsed = parseCustomer(raw);
    if (!parsed.ok) return parsed;
    if (parsed.customer) customers.push(parsed.customer);
  }
  return { ok: true, customers };
}

export function parseStoredCustomers(value: unknown): CustomerRecord[] {
  const parsed = parseCustomerList(value);
  if (!parsed.ok) {
    if (!Array.isArray(value)) throw new Error('Customer file is not a list.');
    throw new Error('Customer file could not be read.');
  }
  return parsed.customers;
}

export function findCustomerByEmail(
  customers: CustomerRecord[],
  email: string
): CustomerRecord | undefined {
  const wanted = email.trim().toLowerCase();
  if (wanted === '') return undefined;
  return customers.find((customer) => customer.email.toLowerCase() === wanted);
}

/** Applies an admin's edits without dropping a customer who arrived later. */
export function mergeCustomerEdits(
  current: CustomerRecord[],
  submitted: CustomerRecord[],
  loadedIds: string[]
): CustomerRecord[] {
  const loaded = new Set(loadedIds);
  const submittedIds = new Set(submitted.map((customer) => customer.id));
  const arrived = current.filter(
    (customer) => !loaded.has(customer.id) && !submittedIds.has(customer.id)
  );
  return [...arrived, ...submitted];
}

export function usedCustomerIds(
  samples: { customerId: string }[],
  book: Record<string, { sales: { customerId: string }[] }>
): Set<string> {
  const ids = new Set(samples.map((sample) => sample.customerId));
  for (const lot of Object.values(book)) {
    for (const sale of lot.sales) ids.add(sale.customerId);
  }
  return ids;
}

function parseCustomer(
  value: unknown
): { ok: true; customer: CustomerRecord | null } | { ok: false; message: string } {
  if (!isRecord(value)) return { ok: false, message: NAME_REQUIRED };

  const fields = {
    name: readText(value.name, LIMITS.name),
    roastery: readText(value.roastery, LIMITS.roastery),
    email: readText(value.email, LIMITS.email),
    phone: readText(value.phone, LIMITS.phone),
    street: readText(value.street, LIMITS.street),
    postalCode: readText(value.postalCode, LIMITS.postalCode),
    city: readText(value.city, LIMITS.city),
    country: readText(value.country, LIMITS.country)
  };
  const texts = Object.values(fields);
  if (texts.some((text) => text === null)) return { ok: false, message: NAME_REQUIRED };

  const customer = { id: '', ...fields } as CustomerRecord;
  if (texts.every((text) => text === '')) return { ok: true, customer: null };
  if (customer.name === '') return { ok: false, message: NAME_REQUIRED };
  if (typeof value.id !== 'string' || !ROW_ID.test(value.id)) {
    return { ok: false, message: NAME_REQUIRED };
  }
  return { ok: true, customer: { ...customer, id: value.id } };
}

function readText(value: unknown, max: number): string | null {
  if (value == null) return '';
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (text.length > max || /[\r\n]/.test(text)) return null;
  return text;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
