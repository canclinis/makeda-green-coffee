import { readStock } from '#lib/server/stock-store.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    return { stock: await readStock() };
  } catch (error) {
    console.error('Could not read stock, showing default bag counts', error);
    return { stock: {} };
  }
};
