import { ARUBA_SMTP_PASSWORD } from '$app/env/private';
import { json } from '@sveltejs/kit';
import { createArubaSender } from '#lib/server/aruba-smtp.ts';
import { readCustomers, writeCustomers } from '#lib/server/customer-store.ts';
import { fileSampleRequest } from '#lib/server/sample-mail.ts';
import { readSamples, writeSamples } from '#lib/server/sample-store.ts';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url }) => {
  if (!ARUBA_SMTP_PASSWORD) return json({ ok: false }, { status: 500 });

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json({ ok: false }, { status: 400 });
  }

  try {
    const result = await fileSampleRequest(
      input,
      createArubaSender(ARUBA_SMTP_PASSWORD),
      {
        customers: { read: readCustomers, write: writeCustomers },
        samples: { read: readSamples, write: writeSamples }
      },
      { sample: crypto.randomUUID(), customer: crypto.randomUUID() },
      new Date().toISOString(),
      url.origin
    );
    return json(result, { status: result.ok ? 200 : 400 });
  } catch {
    return json({ ok: false }, { status: 500 });
  }
};
