import nodemailer from 'nodemailer';
import type { MailSender } from './contact-mail.ts';

const INBOX = 'info@makedagreencoffee.com';

export function createArubaSender(password: string): MailSender {
  const transport = nodemailer.createTransport({
    host: 'smtps.aruba.it',
    port: 465,
    secure: true,
    auth: {
      user: INBOX,
      pass: password
    }
  });

  return async (mail) => {
    await transport.sendMail({
      from: mail.from,
      to: mail.to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text
    });
  };
}
