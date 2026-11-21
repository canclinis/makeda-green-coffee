import { redirect, type Cookies } from '@sveltejs/kit';
import { dev } from '$app/env';
import { ADMIN_EMAILS, AUTH_SECRET, DEV_ADMIN_BYPASS } from '$app/env/private';
import {
  devBypassEmail,
  isAdminEmail,
  issueSessionToken,
  readSessionToken,
  SESSION_TTL_MS
} from './admin-auth.ts';

const COOKIE = 'makeda_admin';

export function startAdminSession(cookies: Cookies, email: string) {
  cookies.set(COOKIE, issueSessionToken(email, requireSecret(), Date.now()), {
    path: '/admin',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_TTL_MS / 1000
  });
}

export function endAdminSession(cookies: Cookies) {
  cookies.delete(COOKIE, { path: '/admin' });
}

/** Returns the signed-in admin's email, or null. Checks the admin list on every call. */
export function getAdminEmail(cookies: Cookies): string | null {
  const bypassed = devBypassEmail({ dev, bypass: DEV_ADMIN_BYPASS, adminEmails: ADMIN_EMAILS });
  if (bypassed) return bypassed;

  const token = cookies.get(COOKIE);
  if (!token || !AUTH_SECRET || !ADMIN_EMAILS) return null;

  const email = readSessionToken(token, AUTH_SECRET, Date.now());
  if (!email || !isAdminEmail(email, ADMIN_EMAILS)) return null;
  return email;
}

export function requireAdmin(cookies: Cookies): string {
  const email = getAdminEmail(cookies);
  if (!email) redirect(303, '/admin/login');
  return email;
}

function requireSecret(): string {
  if (!AUTH_SECRET) throw new Error('AUTH_SECRET is not set');
  return AUTH_SECRET;
}
