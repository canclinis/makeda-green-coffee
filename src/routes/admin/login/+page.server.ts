import { fail, redirect } from '@sveltejs/kit';
import { ADMIN_EMAILS, ARUBA_SMTP_PASSWORD, AUTH_SECRET } from '$app/env/private';
import { isAdminEmail, issueLoginToken } from '#lib/server/admin-auth.ts';
import { getAdminEmail } from '#lib/server/admin-session.ts';
import { buildAdminLoginMail } from '#lib/server/admin-login-mail.ts';
import { createArubaSender } from '#lib/server/aruba-smtp.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url, cookies }) => {
  if (getAdminEmail(cookies)) redirect(303, '/admin');
  return { linkInvalid: url.searchParams.has('invalid') };
};

export const actions: Actions = {
  default: async ({ request, url }) => {
    if (!ADMIN_EMAILS || !AUTH_SECRET || !ARUBA_SMTP_PASSWORD) {
      return fail(500, { message: 'Admin login is not set up yet.' });
    }

    const email = String((await request.formData()).get('email') ?? '').trim();
    // Only admins get a link. Everyone else gets the same "sent" answer.
    if (isAdminEmail(email, ADMIN_EMAILS)) {
      const token = issueLoginToken(email, AUTH_SECRET, Date.now());
      const link = new URL(`/admin/verify?token=${encodeURIComponent(token)}`, url.origin).href;
      try {
        await createArubaSender(ARUBA_SMTP_PASSWORD)(buildAdminLoginMail(email, link));
      } catch (error) {
        console.error('Could not send admin login link', error);
        return fail(500, { message: 'We could not send the link. Please try again.' });
      }
    }

    return { sent: true };
  }
};
