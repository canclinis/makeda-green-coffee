import { createHmac, timingSafeEqual } from 'node:crypto';

export const LOGIN_TTL_MS = 15 * 60 * 1000;
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

type Purpose = 'login' | 'session';
type Payload = { p: Purpose; e: string; x: number };

export function issueLoginToken(email: string, secret: string, now: number): string {
  return sign({ p: 'login', e: email, x: now + LOGIN_TTL_MS }, secret);
}

export function readLoginToken(token: string, secret: string, now: number): string | null {
  return read(token, 'login', secret, now);
}

export function issueSessionToken(email: string, secret: string, now: number): string {
  return sign({ p: 'session', e: email, x: now + SESSION_TTL_MS }, secret);
}

export function readSessionToken(token: string, secret: string, now: number): string | null {
  return read(token, 'session', secret, now);
}

export function adminEmailList(adminEmails: string | undefined): string[] {
  return (adminEmails ?? '')
    .split(',')
    .map((listed) => listed.trim().toLowerCase())
    .filter((listed) => listed.length > 0);
}

export function isAdminEmail(email: string, adminEmails: string): boolean {
  const wanted = email.trim().toLowerCase();
  if (!wanted) return false;
  return adminEmailList(adminEmails).includes(wanted);
}

/** In dev only, with the bypass switched on, returns the first admin so no login is needed. */
export function devBypassEmail({
  dev,
  bypass,
  adminEmails
}: {
  dev: boolean;
  bypass: string | undefined;
  adminEmails: string | undefined;
}): string | null {
  if (!dev || bypass !== 'true') return null;
  return adminEmailList(adminEmails)[0] ?? null;
}

function sign(payload: Payload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${signature(body, secret)}`;
}

function read(token: string, purpose: Purpose, secret: string, now: number): string | null {
  const [body, given, extra] = token.split('.');
  if (!body || !given || extra !== undefined) return null;
  if (!matches(signature(body, secret), given)) return null;

  const payload = parse(body);
  if (!payload || payload.p !== purpose || payload.x <= now) return null;
  return payload.e;
}

function signature(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('base64url');
}

function matches(expected: string, given: string): boolean {
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

function parse(body: string): Payload | null {
  try {
    const value = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Partial<Payload>;
    if (typeof value.e !== 'string' || typeof value.x !== 'number') return null;
    if (value.p !== 'login' && value.p !== 'session') return null;
    return { p: value.p, e: value.e, x: value.x };
  } catch {
    return null;
  }
}
