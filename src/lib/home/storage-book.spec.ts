import { describe, expect, it } from 'vitest';
import {
  bagsHeld,
  centralBags,
  parseStorageBook,
  parseStoredStorage,
  type StorageLot
} from './storage-book';

const lots: StorageLot[] = [
  { id: 'washed', origin: 'Fully Washed K3', arrived: 40, sold: { ballario: 6, loscuro: 4 } },
  { id: 'natural', origin: 'Natural K3', arrived: 14, sold: {} }
];

function payload(washed: unknown, natural: unknown = { loscuro: '0' }) {
  return { washed, natural };
}

describe('storage book', () => {
  it('gives each storage the bags it started with, Ballario holding the rest', () => {
    expect(bagsHeld(40, { loscuro: 12 })).toEqual({ ballario: 28, loscuro: 12 });
    expect(bagsHeld(40, {})).toEqual({ ballario: 40, loscuro: 0 });
  });

  it('leaves the bags that are not in Loscuro in Ballario', () => {
    expect(centralBags(30, { loscuro: 12 })).toBe(18);
  });

  it('keeps every bag in Ballario until Loscuro is filled in', () => {
    expect(centralBags(30, {})).toBe(30);
  });

  it('saves the bags counted in Loscuro for each coffee', () => {
    expect(parseStorageBook(payload({ loscuro: ' 12 ' }, { loscuro: '3' }), lots)).toEqual({
      ok: true,
      book: { washed: { loscuro: 12 }, natural: { loscuro: 3 } }
    });
  });

  it('accepts every bag of a coffee in Loscuro when nothing is ordered from Ballario', () => {
    expect(parseStorageBook(payload({ loscuro: '10' }, { loscuro: '14' }), lots).ok).toBe(true);
  });

  it('refuses more bags in Loscuro than arrived of that coffee', () => {
    const result = parseStorageBook(payload({ loscuro: '41' }), lots);

    expect(result).toEqual({
      ok: false,
      message: 'Fully Washed K3: the storages cannot hold more bags than arrived (40).'
    });
  });

  it('saves fewer bags in Loscuro than are already ordered from it, the orders page flags it', () => {
    expect(parseStorageBook(payload({ loscuro: '3' }), lots).ok).toBe(true);
  });

  it('saves a Loscuro that leaves Ballario with fewer bags than are ordered from it', () => {
    expect(parseStorageBook(payload({ loscuro: '36' }), lots).ok).toBe(true);
  });

  it('does not let the bags of one coffee cover another', () => {
    const result = parseStorageBook(payload({ loscuro: '0' }, { loscuro: '15' }), lots);

    expect(result.ok).toBe(false);
  });

  it.each(['', '-1', '2.5', 'many', null])('refuses %j as a bag count', (value) => {
    const result = parseStorageBook(payload({ loscuro: value }), lots);

    expect(result).toEqual({ ok: false, message: 'Fully Washed K3: enter the bags in Loscuro.' });
  });

  it('refuses a payload that misses a coffee', () => {
    expect(parseStorageBook({ washed: { loscuro: '1' } }, lots).ok).toBe(false);
    expect(parseStorageBook('nope', lots).ok).toBe(false);
  });

  it('reads the saved file, and treats a missing coffee or storage as empty', () => {
    expect(parseStoredStorage({ washed: { loscuro: 12 } })).toEqual({ washed: { loscuro: 12 } });
    expect(parseStoredStorage({ washed: {} })).toEqual({ washed: {} });
    expect(parseStoredStorage({})).toEqual({});
  });

  it('refuses a saved file that is not readable', () => {
    expect(() => parseStoredStorage([])).toThrow();
    expect(() => parseStoredStorage({ washed: [] })).toThrow();
    expect(() => parseStoredStorage({ washed: { loscuro: 'x' } })).toThrow();
  });
});
