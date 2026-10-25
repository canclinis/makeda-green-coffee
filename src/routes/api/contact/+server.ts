import { json } from '@sveltejs/kit';
import { sendContactMessage } from '#lib/server/contact-mail.ts';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json({ ok: false }, { status: 400 });
  }

  const result = await sendContactMessage(input);
  return json(result, { status: result.ok ? 200 : 400 });
};
