import { beforeEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const put = vi.fn();

vi.mock('$app/env/private', () => ({
  BLOB_READ_WRITE_TOKEN: 'vercel_blob_rw_teststore_secret'
}));

vi.mock('@vercel/blob', () => ({
  BlobNotFoundError: class BlobNotFoundError extends Error {},
  get: (...args: unknown[]) => get(...args),
  put: (...args: unknown[]) => put(...args)
}));

import { readStock, writeStockBook } from './stock-store';

const token = 'vercel_blob_rw_teststore_secret';

describe('stock store', () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
    delete process.env.BLOB_READ_WRITE_TOKEN;
    delete process.env.BLOB_STORE_ID;
    delete process.env.VERCEL_OIDC_TOKEN;
  });

  it('reads stock with the private blob token when process.env has none', async () => {
    get.mockResolvedValue({
      stream: new Response(JSON.stringify({ 'lot-1': 4 })).body
    });

    await expect(readStock()).resolves.toEqual({ 'lot-1': 4 });
    expect(get).toHaveBeenCalledWith('stock.json', {
      access: 'private',
      useCache: false,
      token
    });
  });

  it('returns bags left after customers have bought', async () => {
    get.mockResolvedValue({
      stream: new Response(
        JSON.stringify({
          'lot-1': {
            arrived: 10,
            sales: [{ id: 'sale-1', customerId: 'north', bags: 3, comment: '' }]
          }
        })
      ).body
    });

    await expect(readStock()).resolves.toEqual({ 'lot-1': 7 });
  });

  it('writes the arrived bags and each customer purchase', async () => {
    put.mockResolvedValue(undefined);
    const book = {
      'lot-1': {
        arrived: 10,
        sales: [
          {
            id: 'sale-1',
            customerId: 'north',
            bags: 3,
            comment: 'paid',
            shipping: 'shipped' as const,
            invoice: 'sent' as const,
            storage: 'ballario' as const
          }
        ]
      }
    };

    await writeStockBook(book);

    expect(put).toHaveBeenCalledWith('stock.json', JSON.stringify(book), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      token
    });
  });
});
