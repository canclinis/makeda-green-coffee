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

import { readStorageBook, writeStorageBook } from './storage-store';

const token = 'vercel_blob_rw_teststore_secret';

describe('storage store', () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
  });

  it('reads the bags counted in each storage of each coffee', async () => {
    get.mockResolvedValue({
      stream: new Response(JSON.stringify({ washed: { loscuro: 14 } })).body
    });

    await expect(readStorageBook()).resolves.toEqual({ washed: { loscuro: 14 } });
    expect(get).toHaveBeenCalledWith('storage.json', {
      access: 'private',
      useCache: false,
      token
    });
  });

  it('starts empty before anything has been saved', async () => {
    get.mockResolvedValue(null);

    await expect(readStorageBook()).resolves.toEqual({});
  });

  it('writes the bags counted in each storage of each coffee', async () => {
    put.mockResolvedValue(undefined);

    await writeStorageBook({ washed: { loscuro: 14 } });

    expect(put).toHaveBeenCalledWith('storage.json', JSON.stringify({ washed: { loscuro: 14 } }), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      token
    });
  });
});
