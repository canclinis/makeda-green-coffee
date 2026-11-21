import { error, redirect } from '@sveltejs/kit';
import { ADMIN_EMAILS, AUTH_SECRET } from '$app/env/private';
import { isAdminEmail, readLoginToken } from '#lib/server/admin-auth.ts';
import { startAdminSession } from '#lib/server/admin-session.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url, cookies }) => {
  if (!ADMIN_EMAILS || !AUTH_SECRET) error(500, 'Admin login is not set up yet.');

  const email = readLoginToken(url.searchParams.get('token') ?? '', AUTH_SECRET, Date.now());
  if (!email || !isAdminEmail(email, ADMIN_EMAILS)) redirect(303, '/admin/login?invalid=1');

  startAdminSession(cookies, email);
  redirect(303, '/admin');
};
