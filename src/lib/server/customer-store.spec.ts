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

import { readCustomers, writeCustomers } from './customer-store';

const token = 'vercel_blob_rw_teststore_secret';

const customers = [
  {
    id: 'customer-1',
    name: 'Ada Lovelace',
    roastery: 'Resistance Roastery',
    email: 'ada@example.com',
    phone: '',
    street: '12 Roastery Lane',
    postalCode: '1200',
    city: 'Geneva',
    country: 'Switzerland'
  }
];

describe('customer store', () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
  });

  it('reads the customer list with the private blob token', async () => {
    get.mockResolvedValue({ stream: new Response(JSON.stringify(customers)).body });

    await expect(readCustomers()).resolves.toEqual(customers);
    expect(get).toHaveBeenCalledWith('customers.json', {
      access: 'private',
      useCache: false,
      token
    });
  });

  it('writes the customer list with the private blob token', async () => {
    put.mockResolvedValue(undefined);

    await writeCustomers(customers);

    expect(put).toHaveBeenCalledWith('customers.json', JSON.stringify(customers), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      token
    });
  });
});
