import { BlobNotFoundError, get, put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$app/env/private';
import { parseStoredSamples, type SampleRecord } from '#lib/home/sample-log.ts';

const PATH = 'samples.json';

const blobOptions = {
  access: 'private' as const,
  token: BLOB_READ_WRITE_TOKEN
};

/** Throws when the store cannot be read, so an admin never saves over unknown data. */
export async function readSamples(): Promise<SampleRecord[]> {
  try {
    const result = await get(PATH, { ...blobOptions, useCache: false });
    if (!result) return [];
    return parseStoredSamples(JSON.parse(await new Response(result.stream).text()));
  } catch (error) {
    if (error instanceof BlobNotFoundError) return [];
    throw error;
  }
}

export async function writeSamples(samples: SampleRecord[]): Promise<void> {
  await put(PATH, JSON.stringify(samples), {
    ...blobOptions,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  });
}
