import { ARUBA_SMTP_PASSWORD } from '$app/env/private';
import { json } from '@sveltejs/kit';
import { createArubaSender } from '#lib/server/aruba-smtp.ts';
import { sendSampleRequest } from '#lib/server/sample-mail.ts';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  if (!ARUBA_SMTP_PASSWORD) return json({ ok: false }, { status: 500 });

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json({ ok: false }, { status: 400 });
  }

  const result = await sendSampleRequest(input, createArubaSender(ARUBA_SMTP_PASSWORD));
  return json(result, { status: result.ok ? 200 : 400 });
};
