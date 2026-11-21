import { fail, redirect } from '@sveltejs/kit';
import { commercialLots, specialtyLots } from '#lib/home/coffee-lots.ts';
import { parseStockBook, stockEditorLots } from '#lib/home/stock-book.ts';
import { endAdminSession, requireAdmin } from '#lib/server/admin-session.ts';
import { readCustomers } from '#lib/server/customer-store.ts';
import { readStockBook, writeStockBook } from '#lib/server/stock-store.ts';
import { readStorageBook } from '#lib/server/storage-store.ts';
import type { Actions, PageServerLoad } from './$types';

const catalogue = [...specialtyLots, ...commercialLots];

export const load: PageServerLoad = async ({ cookies }) => {
  const email = requireAdmin(cookies);
  const book = await readStockBook();

  return {
    email,
    customers: await readCustomers(),
    storageBook: await readStorageBook(),
    lots: stockEditorLots(catalogue, book)
  };
};

export const actions: Actions = {
  save: async ({ request, cookies }) => {
    requireAdmin(cookies);

    let parsed: unknown;
    try {
      parsed = JSON.parse(String((await request.formData()).get('book') ?? ''));
    } catch {
      return fail(400, { message: 'Enter arrived bags for every lot.' });
    }

    const customers = await readCustomers();
    const result = parseStockBook(
      parsed,
      catalogue.map((lot) => ({ id: lot.id, origin: lot.origin })),
      customers.map((customer) => customer.id),
      await readStorageBook()
    );
    if (!result.ok) return fail(400, { message: result.message });

    await writeStockBook(result.book);
    return { saved: true };
  },

  logout: async ({ cookies }) => {
    endAdminSession(cookies);
    redirect(303, '/admin/login');
  }
};
