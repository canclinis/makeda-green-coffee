import type { OutboundMail } from './contact-mail.ts';

const INBOX = 'info@makedagreencoffee.com';

export function buildAdminLoginMail(email: string, link: string): OutboundMail {
  return {
    from: `Makeda Green Coffee <${INBOX}>`,
    to: email,
    replyTo: INBOX,
    subject: 'Your Makeda stock admin login',
    text: `Open this link to sign in to the stock admin. It works for 15 minutes.\n\n${link}\n\nIf you did not ask for this, you can ignore this email.`
  };
}
