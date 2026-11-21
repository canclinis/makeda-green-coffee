import { describe, expect, it } from 'vitest';
import { buildAdminLoginMail } from './admin-login-mail';

describe('buildAdminLoginMail', () => {
  it('sends the login link to the admin who asked for it', () => {
    const mail = buildAdminLoginMail(
      'admin@makedagreencoffee.com',
      'https://www.makedagreencoffee.com/admin/verify?token=abc'
    );

    expect(mail.to).toBe('admin@makedagreencoffee.com');
    expect(mail.text).toContain('https://www.makedagreencoffee.com/admin/verify?token=abc');
  });

  it('says how long the link works', () => {
    const mail = buildAdminLoginMail('admin@makedagreencoffee.com', 'https://example.com/x');

    expect(mail.text).toContain('15 minutes');
  });
});
