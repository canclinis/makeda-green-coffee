import { fail, redirect } from '@sveltejs/kit';
import { commercialLots, specialtyLots } from '#lib/home/coffee-lots.ts';
import { soldByStorage, stockEditorLots } from '#lib/home/stock-book.ts';
import { parseStorageBook } from '#lib/home/storage-book.ts';
import { endAdminSession, requireAdmin } from '#lib/server/admin-session.ts';
import { readStockBook } from '#lib/server/stock-store.ts';
import { readStorageBook, writeStorageBook } from '#lib/server/storage-store.ts';
import type { Actions, PageServerLoad } from './$types';

const catalogue = [...specialtyLots, ...commercialLots];

async function readLots() {
  const lots = stockEditorLots(catalogue, await readStockBook());
  return lots.map((lot) => ({
    id: lot.id,
    origin: lot.origin,
    crop: lot.crop,
    arrived: lot.arrived,
    sold: soldByStorage(lot.sales)
  }));
}

export const load: PageServerLoad = async ({ cookies }) => {
  const email = requireAdmin(cookies);
  return { email, lots: await readLots(), book: await readStorageBook() };
};

export const actions: Actions = {
  save: async ({ request, cookies }) => {
    requireAdmin(cookies);

    let parsed: unknown;
    try {
      parsed = JSON.parse(String((await request.formData()).get('storage') ?? ''));
    } catch {
      return fail(400, { message: 'Enter the bags in each storage.' });
    }

    const result = parseStorageBook(parsed, await readLots());
    if (!result.ok) return fail(400, { message: result.message });

    await writeStorageBook(result.book);
    return { saved: true };
  },

  logout: async ({ cookies }) => {
    endAdminSession(cookies);
    redirect(303, '/admin/login');
  }
};
