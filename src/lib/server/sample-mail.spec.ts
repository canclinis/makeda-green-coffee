import { describe, expect, it, vi } from 'vitest';
import { sendSampleRequest, type OutboundMail } from './sample-mail';

const request = {
  samples: ['washed-k3-2026', 'natural-k4-2025'],
  grams: 1000,
  roastery: 'Resistance Roastery',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '+41 79 000 00 00',
  street: '12 Roastery Lane',
  postalCode: '1200',
  city: 'Geneva',
  country: 'Switzerland',
  message: 'Our roaster needs at least 1 kg.',
  consent: true
};

describe('sendSampleRequest', () => {
  it('emails the inbox what to send, how much, to whom, and where', async () => {
    const sent: OutboundMail[] = [];

    const result = await sendSampleRequest(request, async (mail) => {
      sent.push(mail);
    });

    expect(result).toEqual({ ok: true });
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({
      from: 'Makeda Green Coffee <info@makedagreencoffee.com>',
      to: 'info@makedagreencoffee.com',
      replyTo: 'ada@example.com',
      subject: 'Sample request — Ada Lovelace (price to send)'
    });
    expect(sent[0].text).toContain('Fully Washed K3 Classic · 2026');
    expect(sent[0].text).toContain('Natural K4 · 2025');
    expect(sent[0].text).toContain('1 kg of each — paid, send price');
    expect(sent[0].text).toContain('Our roaster needs at least 1 kg.');
    expect(sent[0].text).toContain('Resistance Roastery');
    expect(sent[0].text).toContain('Ada Lovelace');
    expect(sent[0].text).toContain('ada@example.com');
    expect(sent[0].text).toContain('+41 79 000 00 00');
    expect(sent[0].text).toContain('12 Roastery Lane');
    expect(sent[0].text).toContain('1200 Geneva');
    expect(sent[0].text).toContain('Switzerland');
  });

  it('uses the free sample subject for a free amount, including 50 g', async () => {
    const sent: OutboundMail[] = [];

    await sendSampleRequest({ ...request, grams: 50, phone: '', message: '' }, async (mail) => {
      sent.push(mail);
    });

    expect(sent[0].subject).toBe('Free sample request — Ada Lovelace');
    expect(sent[0].text).toContain('50 g of each — free');
    expect(sent[0].text).not.toContain('Message');
    expect(sent[0].text).not.toContain('+41');
  });

  it('asks for a price on 300 g, which is priced by email', async () => {
    const sent: OutboundMail[] = [];

    await sendSampleRequest({ ...request, grams: 300 }, async (mail) => {
      sent.push(mail);
    });

    expect(sent[0].subject).toBe('Sample request — Ada Lovelace (price to send)');
    expect(sent[0].text).toContain('300 g of each — paid, send price');
  });

  it('does not send a request without coffees, a known amount, a full address, or consent', async () => {
    const send = vi.fn<(mail: OutboundMail) => Promise<void>>();

    expect(await sendSampleRequest({ ...request, samples: [] }, send)).toEqual({ ok: false });
    expect(await sendSampleRequest({ ...request, samples: ['not-a-lot'] }, send)).toEqual({
      ok: false
    });
    expect(
      await sendSampleRequest({ ...request, samples: ['washed-k3-2026', 'washed-k3-2026'] }, send)
    ).toEqual({ ok: false });
    expect(await sendSampleRequest({ ...request, grams: 200 }, send)).toEqual({ ok: false });
    expect(await sendSampleRequest({ ...request, country: '  ' }, send)).toEqual({ ok: false });
    expect(await sendSampleRequest({ ...request, roastery: '  ' }, send)).toEqual({ ok: false });
    expect(await sendSampleRequest({ ...request, street: '' }, send)).toEqual({ ok: false });
    expect(await sendSampleRequest({ ...request, consent: false }, send)).toEqual({ ok: false });
    expect(send).not.toHaveBeenCalled();
  });

  it('reports failure when the mailbox rejects the request', async () => {
    const result = await sendSampleRequest(request, async () => {
      throw new Error('mailbox rejected the message');
    });

    expect(result).toEqual({ ok: false });
  });
});
