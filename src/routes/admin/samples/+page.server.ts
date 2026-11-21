import { fail, redirect } from '@sveltejs/kit';
import { ADMIN_EMAILS } from '$app/env/private';
import { mergeSampleEdits, parseSampleLog } from '#lib/home/sample-log.ts';
import { adminEmailList } from '#lib/server/admin-auth.ts';
import { endAdminSession, requireAdmin } from '#lib/server/admin-session.ts';
import { readCustomers } from '#lib/server/customer-store.ts';
import { readSamples, writeSamples } from '#lib/server/sample-store.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const email = requireAdmin(cookies);
  return {
    email,
    samples: await readSamples(),
    customers: await readCustomers(),
    owners: adminEmailList(ADMIN_EMAILS)
  };
};

export const actions: Actions = {
  save: async ({ request, cookies }) => {
    requireAdmin(cookies);

    const formData = await request.formData();
    let parsed: unknown;
    let loaded: unknown;
    try {
      parsed = JSON.parse(String(formData.get('samples') ?? ''));
      loaded = JSON.parse(String(formData.get('loaded') ?? ''));
    } catch {
      return fail(400, { message: 'The sample list could not be read.' });
    }
    if (!Array.isArray(loaded) || loaded.some((id) => typeof id !== 'string')) {
      return fail(400, { message: 'The sample list could not be read.' });
    }

    const result = parseSampleLog(parsed, adminEmailList(ADMIN_EMAILS));
    if (!result.ok) return fail(400, { message: result.message });

    const customerIds = new Set((await readCustomers()).map((customer) => customer.id));
    if (result.samples.some((sample) => !customerIds.has(sample.customerId))) {
      return fail(400, { message: 'Each sample needs a customer from the customer list.' });
    }

    await writeSamples(mergeSampleEdits(await readSamples(), result.samples, loaded));
    return { saved: true };
  },

  remove: async ({ request, cookies }) => {
    requireAdmin(cookies);

    const id = String((await request.formData()).get('id') ?? '');
    await writeSamples((await readSamples()).filter((sample) => sample.id !== id));
    return { removed: true };
  },

  logout: async ({ cookies }) => {
    endAdminSession(cookies);
    redirect(303, '/admin/login');
  }
};
