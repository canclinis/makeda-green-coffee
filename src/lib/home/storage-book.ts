/** Holds every bag of a coffee that is not counted in another storage. Its number is never typed in. */
export const CENTRAL_STORAGE = { value: 'ballario', label: 'Ballario' };

/** Storages whose bags are counted by hand. Add one here and the page, the form and the file follow. */
export const COUNTED_STORAGES = [{ value: 'loscuro', label: 'Loscuro' }];

/** Every storage an order can be shipped from. */
export const STORAGES = [CENTRAL_STORAGE, ...COUNTED_STORAGES];

/** A coffee, the bags that arrived of it, and the bags already ordered from each storage. */
export type StorageLot = {
  id: string;
  origin: string;
  arrived: number;
  sold: Record<string, number>;
};

/** Bags counted in each counted storage, by storage. A storage with no entry holds none. */
export type StorageCounts = Record<string, number>;

/** Counts by coffee id. */
export type StorageBook = Record<string, StorageCounts>;

export type StorageBookResult = { ok: true; book: StorageBook } | { ok: false; message: string };

const WHOLE_NUMBER = /^\d{1,6}$/;

/** What the central storage started with: the bags that arrived, minus the counted storages. */
export function centralBags(arrived: number, counts: StorageCounts): number {
  return arrived - Object.values(counts).reduce((sum, bags) => sum + bags, 0);
}

/** The bags each storage started with, before any order. */
export function bagsHeld(arrived: number, counts: StorageCounts): Record<string, number> {
  return Object.fromEntries(
    STORAGES.map((storage) => [
      storage.value,
      storage.value === CENTRAL_STORAGE.value
        ? centralBags(arrived, counts)
        : (counts[storage.value] ?? 0)
    ])
  );
}

export type Overdrawn = { label: string; held: number; ordered: number };

/** The first storage with fewer bags than are ordered from it, or null when each can cover its orders. */
export function overdrawnStorage(
  arrived: number,
  counts: StorageCounts,
  sold: Record<string, number>
): Overdrawn | null {
  const held = bagsHeld(arrived, counts);
  for (const storage of STORAGES) {
    const ordered = sold[storage.value] ?? 0;
    if (ordered > held[storage.value]) {
      return { label: storage.label, held: held[storage.value], ordered };
    }
  }
  return null;
}

export function overdrawnMessage(origin: string, { label, held, ordered }: Overdrawn): string {
  return `${origin}: ${label} holds ${held} ${held === 1 ? 'bag' : 'bags'}, but ${ordered} ${ordered === 1 ? 'is' : 'are'} ordered from it.`;
}

export function parseStorageBook(value: unknown, lots: StorageLot[]): StorageBookResult {
  if (!isRecord(value)) return { ok: false, message: 'Enter the bags in each storage.' };

  const book: StorageBook = {};
  for (const lot of lots) {
    const row = value[lot.id];
    if (!isRecord(row))
      return { ok: false, message: `${lot.origin}: enter the bags in each storage.` };

    const counts: StorageCounts = {};
    for (const storage of COUNTED_STORAGES) {
      const bags = wholeNumber(row[storage.value]);
      if (bags === null) {
        return { ok: false, message: `${lot.origin}: enter the bags in ${storage.label}.` };
      }
      counts[storage.value] = bags;
    }

    if (centralBags(lot.arrived, counts) < 0) {
      return {
        ok: false,
        message: `${lot.origin}: the storages cannot hold more bags than arrived (${lot.arrived}).`
      };
    }
    // Orders that a storage cannot cover do not stop the count from being saved. The orders page flags them.
    book[lot.id] = counts;
  }
  return { ok: true, book };
}

export function parseStoredStorage(value: unknown): StorageBook {
  if (!isRecord(value)) throw new Error('Storage file is not an object.');

  const book: StorageBook = {};
  for (const [id, row] of Object.entries(value)) {
    if (!isRecord(row)) throw new Error(`Storage of ${id} could not be read.`);

    const counts: StorageCounts = {};
    for (const storage of COUNTED_STORAGES) {
      if (!Object.hasOwn(row, storage.value)) continue;
      const bags = row[storage.value];
      if (typeof bags !== 'number' || !Number.isInteger(bags) || bags < 0) {
        throw new Error(`Storage of ${id} could not be read.`);
      }
      counts[storage.value] = bags;
    }
    book[id] = counts;
  }
  return book;
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
