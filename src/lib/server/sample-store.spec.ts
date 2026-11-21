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

import { readSamples, writeSamples } from './sample-store';

const token = 'vercel_blob_rw_teststore_secret';

describe('sample store', () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
    delete process.env.BLOB_READ_WRITE_TOKEN;
    delete process.env.BLOB_STORE_ID;
    delete process.env.VERCEL_OIDC_TOKEN;
  });

  it('reads the sample list with the private blob token', async () => {
    const samples = [
      {
        id: 'sample-1',
        customerId: 'customer-1',
        status: 'sent',
        comment: '',
        owner: '',
        coffees: '',
        amount: '',
        message: '',
        requestedAt: ''
      }
    ];
    get.mockResolvedValue({ stream: new Response(JSON.stringify(samples)).body });

    await expect(readSamples()).resolves.toEqual(samples);
    expect(get).toHaveBeenCalledWith('samples.json', {
      access: 'private',
      useCache: false,
      token
    });
  });

  it('writes the sample list with the private blob token', async () => {
    put.mockResolvedValue(undefined);
    const samples = [
      {
        id: 'sample-1',
        customerId: 'customer-1',
        status: 'received' as const,
        comment: 'At the door',
        owner: '',
        coffees: '',
        amount: '',
        message: '',
        requestedAt: ''
      }
    ];

    await writeSamples(samples);

    expect(put).toHaveBeenCalledWith('samples.json', JSON.stringify(samples), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      token
    });
  });
});
