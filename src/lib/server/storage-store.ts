import { BlobNotFoundError, get, put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$app/env/private';
import { parseStoredStorage, type StorageBook } from '#lib/home/storage-book.ts';

const PATH = 'storage.json';

const blobOptions = {
  access: 'private' as const,
  token: BLOB_READ_WRITE_TOKEN
};

/** Throws when the store cannot be read, so an admin never saves over unknown data. */
export async function readStorageBook(): Promise<StorageBook> {
  try {
    const result = await get(PATH, { ...blobOptions, useCache: false });
    if (!result) return {};
    return parseStoredStorage(JSON.parse(await new Response(result.stream).text()));
  } catch (error) {
    if (error instanceof BlobNotFoundError) return {};
    throw error;
  }
}

export async function writeStorageBook(book: StorageBook): Promise<void> {
  await put(PATH, JSON.stringify(book), {
    ...blobOptions,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  });
}
