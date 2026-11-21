import { BlobNotFoundError, get, put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$app/env/private';
import type { StockLevels } from '#lib/home/stock.ts';
import { parseStoredStock, stockLevelsFromBook, type StockBook } from '#lib/home/stock-book.ts';

const PATH = 'stock.json';

const blobOptions = {
  access: 'private' as const,
  token: BLOB_READ_WRITE_TOKEN
};

/** Bags still available for each lot. Throws if the file cannot be read. */
export async function readStock(): Promise<StockLevels> {
  return stockLevelsFromBook(await readStockBook());
}

/** Throws when the store cannot be read, so an admin never saves over unknown data. */
export async function readStockBook(): Promise<StockBook> {
  try {
    const result = await get(PATH, { ...blobOptions, useCache: false });
    if (!result) return {};
    return parseStoredStock(JSON.parse(await new Response(result.stream).text()));
  } catch (error) {
    if (error instanceof BlobNotFoundError) return {};
    throw error;
  }
}

export async function writeStockBook(stock: StockBook): Promise<void> {
  await put(PATH, JSON.stringify(stock), {
    ...blobOptions,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  });
}
