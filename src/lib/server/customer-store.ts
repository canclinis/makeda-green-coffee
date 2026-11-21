import { BlobNotFoundError, get, put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$app/env/private';
import { parseStoredCustomers, type CustomerRecord } from '#lib/home/customer-log.ts';

const PATH = 'customers.json';

const blobOptions = {
  access: 'private' as const,
  token: BLOB_READ_WRITE_TOKEN
};

/** Throws when the store cannot be read, so an admin never saves over unknown data. */
export async function readCustomers(): Promise<CustomerRecord[]> {
  try {
    const result = await get(PATH, { ...blobOptions, useCache: false });
    if (!result) return [];
    return parseStoredCustomers(JSON.parse(await new Response(result.stream).text()));
  } catch (error) {
    if (error instanceof BlobNotFoundError) return [];
    throw error;
  }
}

export async function writeCustomers(customers: CustomerRecord[]): Promise<void> {
  await put(PATH, JSON.stringify(customers), {
    ...blobOptions,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  });
}
