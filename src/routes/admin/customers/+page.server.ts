import { fail, redirect } from '@sveltejs/kit';
import { mergeCustomerEdits, parseCustomerList, usedCustomerIds } from '#lib/home/customer-log.ts';
import { endAdminSession, requireAdmin } from '#lib/server/admin-session.ts';
import { readCustomers, writeCustomers } from '#lib/server/customer-store.ts';
import { readSamples } from '#lib/server/sample-store.ts';
import { readStockBook } from '#lib/server/stock-store.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const email = requireAdmin(cookies);
  return { email, customers: await readCustomers() };
};

export const actions: Actions = {
  save: async ({ request, cookies }) => {
    requireAdmin(cookies);

    const formData = await request.formData();
    let parsed: unknown;
    let loaded: unknown;
    try {
      parsed = JSON.parse(String(formData.get('customers') ?? ''));
      loaded = JSON.parse(String(formData.get('loaded') ?? ''));
    } catch {
      return fail(400, { message: 'The customer list could not be read.' });
    }
    if (!Array.isArray(loaded) || loaded.some((id) => typeof id !== 'string')) {
      return fail(400, { message: 'The customer list could not be read.' });
    }

    const result = parseCustomerList(parsed);
    if (!result.ok) return fail(400, { message: result.message });

    const customers = mergeCustomerEdits(await readCustomers(), result.customers, loaded);
    const kept = new Set(customers.map((customer) => customer.id));
    const used = usedCustomerIds(await readSamples(), await readStockBook());
    if ([...used].some((id) => !kept.has(id))) {
      return fail(400, { message: 'A customer with samples or orders cannot be removed.' });
    }

    await writeCustomers(customers);
    return { saved: true };
  },

  logout: async ({ cookies }) => {
    endAdminSession(cookies);
    redirect(303, '/admin/login');
  }
};
