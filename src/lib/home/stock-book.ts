import type { StockLevels } from './stock';
import {
  CENTRAL_STORAGE,
  STORAGES,
  overdrawnMessage,
  overdrawnStorage,
  type StorageBook
} from './storage-book';

export const SHIPPING_STATUSES = [
  { value: 'to-ship', label: 'To ship' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'arrived', label: 'Arrived' }
] as const;

export const INVOICE_STATUSES = [
  { value: 'to-issue', label: 'To issue' },
  { value: 'issued', label: 'Issued' },
  { value: 'sent', label: 'Sent' },
  { value: 'paid', label: 'Paid' }
] as const;

export type ShippingStatus = (typeof SHIPPING_STATUSES)[number]['value'];
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]['value'];

export type Sale = {
  id: string;
  customerId: string;
  bags: number;
  comment: string;
  shipping: ShippingStatus;
  invoice: InvoiceStatus;
  /** The storage the bags were shipped from. */
  storage: string;
};

export type LotStock = {
  arrived: number;
  sales: Sale[];
};

export type StockBook = Record<string, LotStock>;

export type StockEditorLot = {
  id: string;
  origin: string;
  crop: string;
  arrived: number;
  sales: Sale[];
};

type LotMeta = {
  id: string;
  origin: string;
};

type CatalogueLot = LotMeta & {
  crop: string;
  bags: string;
};

export type StockBookResult = { ok: true; book: StockBook } | { ok: false; message: string };

const WHOLE_NUMBER = /^\d{1,6}$/;
const ROW_ID = /^[A-Za-z0-9_-]{1,80}$/;
const COMMENT_MAX = 500;
const ROW_ID_MAX = 80;

export function bagsLeft(lot: LotStock): number {
  return lot.arrived - lot.sales.reduce((sum, sale) => sum + sale.bags, 0);
}

/** A lot that arrived and has no bags left. A lot with nothing received yet is not sold out. */
export function soldOut(lot: LotStock): boolean {
  return lot.arrived > 0 && bagsLeft(lot) === 0;
}

export function stockLevelsFromBook(book: StockBook): StockLevels {
  return Object.fromEntries(Object.entries(book).map(([id, lot]) => [id, bagsLeft(lot)]));
}

export function stockEditorLots(lots: CatalogueLot[], book: StockBook): StockEditorLot[] {
  return lots.map((lot) => {
    const saved = book[lot.id];
    return {
      id: lot.id,
      origin: lot.origin,
      crop: lot.crop,
      arrived: saved ? saved.arrived : Number(lot.bags),
      sales: saved ? saved.sales : []
    };
  });
}

export function parseStockBook(
  value: unknown,
  lots: LotMeta[],
  customerIds: string[],
  /** What each counted storage started with. When given, no storage can have more bags ordered than it holds. */
  storageBook?: StorageBook
): StockBookResult {
  if (!isRecord(value)) return { ok: false, message: 'Enter arrived bags for every lot.' };

  const book: StockBook = {};
  for (const lot of lots) {
    if (!Object.hasOwn(value, lot.id)) {
      return { ok: false, message: 'Enter arrived bags for every lot.' };
    }
    const parsed = parseLotStock(value[lot.id], lot.origin, customerIds);
    if (!parsed.ok) return parsed;
    if (bagsLeft(parsed.lot) < 0) {
      return { ok: false, message: `${lot.origin}: customers have more bags than arrived.` };
    }
    const overdrawn =
      storageBook &&
      overdrawnStorage(
        parsed.lot.arrived,
        storageBook[lot.id] ?? {},
        soldByStorage(parsed.lot.sales)
      );
    if (overdrawn) return { ok: false, message: overdrawnMessage(lot.origin, overdrawn) };
    book[lot.id] = parsed.lot;
  }
  return { ok: true, book };
}

/** The bags ordered from each storage, by storage. */
export function soldByStorage(sales: Sale[]): Record<string, number> {
  const sold: Record<string, number> = {};
  for (const sale of sales) sold[sale.storage] = (sold[sale.storage] ?? 0) + sale.bags;
  return sold;
}

export function parseStoredStock(value: unknown): StockBook {
  if (!isRecord(value)) throw new Error('Stock file is not an object.');

  const book: StockBook = {};
  for (const [id, raw] of Object.entries(value)) {
    if (typeof raw === 'number') {
      const arrived = wholeNumber(raw);
      if (arrived === null) throw new Error(`Stock file for ${id} is not a whole number.`);
      book[id] = { arrived, sales: [] };
      continue;
    }
    if (!isRecord(raw) || !Object.hasOwn(raw, 'sales')) {
      throw new Error(`Stock file for ${id} is missing its customer list.`);
    }
    const parsed = parseLotStock(raw, id);
    if (!parsed.ok) throw new Error(`Stock file for ${id} could not be read.`);
    book[id] = parsed.lot;
  }
  return book;
}

function parseLotStock(
  value: unknown,
  origin: string,
  customerIds?: string[]
): { ok: true; lot: LotStock } | { ok: false; message: string } {
  if (!isRecord(value) || !Array.isArray(value.sales)) {
    return { ok: false, message: `Enter arrived bags for ${origin}.` };
  }

  const arrived = wholeNumber(value.arrived);
  if (arrived === null) return { ok: false, message: `Enter arrived bags for ${origin}.` };

  const sales: Sale[] = [];
  for (const raw of value.sales) {
    const sale = parseSale(raw, origin, customerIds);
    if (!sale.ok) return sale;
    if (sale.sale) sales.push(sale.sale);
  }
  return { ok: true, lot: { arrived, sales } };
}

function parseSale(
  value: unknown,
  origin: string,
  customerIds?: string[]
): { ok: true; sale: Sale | null } | { ok: false; message: string } {
  if (!isRecord(value)) {
    return { ok: false, message: customerRowMessage(origin) };
  }

  const customerId = optionalText(value.customerId, ROW_ID_MAX);
  const comment = optionalText(value.comment, COMMENT_MAX);
  if (typeof value.comment === 'string' && value.comment.trim().length > COMMENT_MAX) {
    return { ok: false, message: 'Keep each comment under 500 characters.' };
  }
  if (customerId === null || comment === null) {
    return { ok: false, message: customerRowMessage(origin) };
  }

  const shipping = status(value.shipping, SHIPPING_STATUSES, 'to-ship');
  const invoice = status(value.invoice, INVOICE_STATUSES, 'to-issue');
  if (shipping === null || invoice === null) {
    return {
      ok: false,
      message: `${origin}: choose a shipping and invoice status for each order.`
    };
  }

  const storage = status(value.storage, STORAGES, CENTRAL_STORAGE.value);
  if (storage === null) {
    return { ok: false, message: `${origin}: choose a storage for each order.` };
  }

  const bagsBlank = value.bags === '' || value.bags === null || value.bags === undefined;
  if (customerId === '' && bagsBlank && comment === '') return { ok: true, sale: null };

  const bags = saleBags(value.bags);
  if (customerId === '' || bags === null) {
    return { ok: false, message: customerRowMessage(origin) };
  }
  if (customerIds && !customerIds.includes(customerId)) {
    return { ok: false, message: `${origin}: choose a saved customer for each order.` };
  }
  if (typeof value.id !== 'string' || !ROW_ID.test(value.id)) {
    return { ok: false, message: customerRowMessage(origin) };
  }

  return {
    ok: true,
    sale: { id: value.id, customerId, bags, comment, shipping, invoice, storage }
  };
}

/** The default when the field is missing, so orders saved before statuses existed still load. */
function status<T extends string>(
  value: unknown,
  allowed: readonly { value: T }[],
  fallback: T
): T | null {
  if (value === undefined || value === null || value === '') return fallback;
  return allowed.find((entry) => entry.value === value)?.value ?? null;
}

function optionalText(value: unknown, max: number): string | null {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length > max) return null;
  return trimmed;
}

function customerRowMessage(origin: string): string {
  return `${origin}: choose a customer and how many bags for each order.`;
}

function saleBags(value: unknown): number | null {
  const bags = wholeNumber(value);
  if (bags === null || bags < 1) return null;
  return bags;
}

function wholeNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 999999) {
    return value;
  }
  if (typeof value === 'string' && WHOLE_NUMBER.test(value.trim())) return Number(value.trim());
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
