import { describe, expect, it } from 'vitest';
import {
  devBypassEmail,
  isAdminEmail,
  issueLoginToken,
  issueSessionToken,
  LOGIN_TTL_MS,
  readLoginToken,
  readSessionToken
} from './admin-auth';

const secret = 'test-secret-that-is-long-enough';
const now = Date.parse('2026-11-14T10:00:00Z');

describe('admin login links', () => {
  it('opens for the admin email shortly after it was issued', () => {
    const token = issueLoginToken('admin@makedagreencoffee.com', secret, now);

    expect(readLoginToken(token, secret, now + 60_000)).toBe('admin@makedagreencoffee.com');
  });

  it('stops working after its time limit', () => {
    const token = issueLoginToken('admin@makedagreencoffee.com', secret, now);

    expect(readLoginToken(token, secret, now + LOGIN_TTL_MS + 1)).toBeNull();
  });

  it('rejects a link whose email was changed', () => {
    const token = issueLoginToken('admin@makedagreencoffee.com', secret, now);
    const [, signature] = token.split('.');
    const forged = Buffer.from(
      JSON.stringify({ p: 'login', e: 'someone@example.com', x: now + LOGIN_TTL_MS })
    ).toString('base64url');

    expect(readLoginToken(`${forged}.${signature}`, secret, now)).toBeNull();
  });

  it('rejects a link signed with another secret', () => {
    const token = issueLoginToken('admin@makedagreencoffee.com', 'another-secret-value', now);

    expect(readLoginToken(token, secret, now)).toBeNull();
  });

  it('does not accept a session token as a login link', () => {
    const session = issueSessionToken('admin@makedagreencoffee.com', secret, now);

    expect(readLoginToken(session, secret, now)).toBeNull();
  });
});

describe('admin sessions', () => {
  it('keeps the admin signed in after the link is opened', () => {
    const session = issueSessionToken('admin@makedagreencoffee.com', secret, now);

    expect(readSessionToken(session, secret, now + 60 * 60 * 1000)).toBe(
      'admin@makedagreencoffee.com'
    );
  });

  it('does not accept a login link as a session', () => {
    const link = issueLoginToken('admin@makedagreencoffee.com', secret, now);

    expect(readSessionToken(link, secret, now)).toBeNull();
  });

  it('ignores a missing or garbage cookie', () => {
    expect(readSessionToken('', secret, now)).toBeNull();
    expect(readSessionToken('not.a.token', secret, now)).toBeNull();
  });
});

describe('isAdminEmail', () => {
  it('matches a listed admin ignoring case and spaces', () => {
    const list = 'sofia@makedagreencoffee.com, Partner@makedagreencoffee.com';

    expect(isAdminEmail('partner@MAKEDAGREENCOFFEE.com', list)).toBe(true);
    expect(isAdminEmail(' sofia@makedagreencoffee.com ', list)).toBe(true);
  });

  it('rejects an email that is not on the list', () => {
    expect(isAdminEmail('stranger@example.com', 'sofia@makedagreencoffee.com')).toBe(false);
  });

  it('rejects everyone when no admins are configured', () => {
    expect(isAdminEmail('sofia@makedagreencoffee.com', '')).toBe(false);
    expect(isAdminEmail('', '')).toBe(false);
  });
});

describe('dev admin bypass', () => {
  const admins = 'sofia@makedagreencoffee.com, partner@makedagreencoffee.com';

  it('signs in as the first admin in dev when the bypass is on', () => {
    expect(devBypassEmail({ dev: true, bypass: 'true', adminEmails: admins })).toBe(
      'sofia@makedagreencoffee.com'
    );
  });

  it('does nothing outside dev, even when the bypass is on', () => {
    expect(devBypassEmail({ dev: false, bypass: 'true', adminEmails: admins })).toBeNull();
  });

  it('does nothing in dev when the bypass is off', () => {
    expect(devBypassEmail({ dev: true, bypass: undefined, adminEmails: admins })).toBeNull();
    expect(devBypassEmail({ dev: true, bypass: 'false', adminEmails: admins })).toBeNull();
  });

  it('does nothing when no admins are configured', () => {
    expect(devBypassEmail({ dev: true, bypass: 'true', adminEmails: '' })).toBeNull();
  });
});
