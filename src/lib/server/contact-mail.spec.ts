import { describe, expect, it, vi } from 'vitest';
import { sendContactMessage, type OutboundMail } from './contact-mail';

const message = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Green coffee',
  message: 'Hello from the roastery',
  consent: true
};

describe('sendContactMessage', () => {
  it('sends the visitor message to the company inbox', async () => {
    const sent: OutboundMail[] = [];

    const result = await sendContactMessage(message, async (mail) => {
      sent.push(mail);
    });

    expect(result).toEqual({ ok: true });
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({
      from: 'Makeda Green Coffee <info@makedagreencoffee.com>',
      to: 'info@makedagreencoffee.com',
      replyTo: 'ada@example.com',
      subject: 'Green coffee'
    });
    expect(sent[0].text).toContain('Ada');
    expect(sent[0].text).toContain('ada@example.com');
    expect(sent[0].text).toContain('Hello from the roastery');
  });

  it('reports failure when the mailbox rejects the message', async () => {
    const result = await sendContactMessage(message, async () => {
      throw new Error('mailbox rejected the message');
    });

    expect(result).toEqual({ ok: false });
  });

  it('does not send a message without privacy consent', async () => {
    const send = vi.fn<(mail: OutboundMail) => Promise<void>>();

    const result = await sendContactMessage({ ...message, consent: false }, send);

    expect(result).toEqual({ ok: false });
    expect(send).not.toHaveBeenCalled();
  });
});
