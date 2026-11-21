import { describe, expect, it, vi } from 'vitest';
import type { CustomerRecord } from '../home/customer-log.ts';
import type { SampleRecord } from '../home/sample-log.ts';
import { fileSampleRequest, sendSampleRequest, type OutboundMail } from './sample-mail';

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

const site = 'https://www.makedagreencoffee.com';

describe('sendSampleRequest', () => {
  it('links the email to the samples page so the team can log it', async () => {
    const sent: OutboundMail[] = [];

    await sendSampleRequest(
      request,
      async (mail) => {
        sent.push(mail);
      },
      site
    );

    expect(sent[0].text).toContain(`${site}/admin/samples`);
  });

  it('emails the inbox what to send, how much, to whom, and where', async () => {
    const sent: OutboundMail[] = [];

    const result = await sendSampleRequest(
      request,
      async (mail) => {
        sent.push(mail);
      },
      site
    );

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

    await sendSampleRequest(
      { ...request, grams: 50, phone: '', message: '' },
      async (mail) => {
        sent.push(mail);
      },
      site
    );

    expect(sent[0].subject).toBe('Free sample request — Ada Lovelace');
    expect(sent[0].text).toContain('50 g of each — free');
    expect(sent[0].text).not.toContain('Message');
    expect(sent[0].text).not.toContain('+41');
  });

  it('asks for a price on 300 g, which is priced by email', async () => {
    const sent: OutboundMail[] = [];

    await sendSampleRequest(
      { ...request, grams: 300 },
      async (mail) => {
        sent.push(mail);
      },
      site
    );

    expect(sent[0].subject).toBe('Sample request — Ada Lovelace (price to send)');
    expect(sent[0].text).toContain('300 g of each — paid, send price');
  });

  it('does not send a request without coffees, a known amount, a full address, or consent', async () => {
    const send = vi.fn<(mail: OutboundMail) => Promise<void>>();

    expect(await sendSampleRequest({ ...request, samples: [] }, send, site)).toEqual({ ok: false });
    expect(await sendSampleRequest({ ...request, samples: ['not-a-lot'] }, send, site)).toEqual({
      ok: false
    });
    expect(
      await sendSampleRequest(
        { ...request, samples: ['washed-k3-2026', 'washed-k3-2026'] },
        send,
        site
      )
    ).toEqual({ ok: false });
    expect(await sendSampleRequest({ ...request, grams: 200 }, send, site)).toEqual({ ok: false });
    expect(await sendSampleRequest({ ...request, country: '  ' }, send, site)).toEqual({
      ok: false
    });
    expect(await sendSampleRequest({ ...request, roastery: '  ' }, send, site)).toEqual({
      ok: false
    });
    expect(await sendSampleRequest({ ...request, street: '' }, send, site)).toEqual({ ok: false });
    expect(await sendSampleRequest({ ...request, consent: false }, send, site)).toEqual({
      ok: false
    });
    expect(send).not.toHaveBeenCalled();
  });

  it('reports failure when the mailbox rejects the request', async () => {
    const result = await sendSampleRequest(
      request,
      async () => {
        throw new Error('mailbox rejected the message');
      },
      site
    );

    expect(result).toEqual({ ok: false });
  });
});

describe('fileSampleRequest', () => {
  const earlier: SampleRecord = {
    id: 'older',
    customerId: 'customer-grace',
    status: 'sent',
    comment: 'Posted',
    owner: '',
    coffees: '',
    amount: '',
    message: '',
    requestedAt: ''
  };

  const ada: CustomerRecord = {
    id: 'customer-ada',
    name: 'Ada Lovelace',
    roastery: 'Resistance Roastery',
    email: 'ada@example.com',
    phone: '+41 79 000 00 00',
    street: '12 Roastery Lane',
    postalCode: '1200',
    city: 'Geneva',
    country: 'Switzerland'
  };

  function stores(customers: CustomerRecord[], samples: SampleRecord[] = [earlier]) {
    const written = {
      customers: [] as CustomerRecord[][],
      samples: [] as SampleRecord[][]
    };
    return {
      written,
      files: {
        customers: {
          read: async () => customers,
          write: async (rows: CustomerRecord[]) => {
            written.customers.push(rows);
          }
        },
        samples: {
          read: async () => samples,
          write: async (rows: SampleRecord[]) => {
            written.samples.push(rows);
          }
        }
      }
    };
  }

  async function file(input: unknown, files: ReturnType<typeof stores>['files']) {
    return fileSampleRequest(
      input,
      async () => {},
      files,
      { sample: 'sample-new', customer: 'customer-new' },
      '2026-11-14T10:00:00.000Z',
      site
    );
  }

  it('saves a new customer and links the sample to them after the email is sent', async () => {
    const sent: OutboundMail[] = [];
    const { files, written } = stores([]);

    const result = await fileSampleRequest(
      request,
      async (mail) => {
        sent.push(mail);
      },
      files,
      { sample: 'sample-new', customer: 'customer-new' },
      '2026-11-14T10:00:00.000Z',
      site
    );

    expect(result).toEqual({ ok: true });
    expect(sent).toHaveLength(1);
    expect(written.customers).toEqual([[{ ...ada, id: 'customer-new' }]]);
    expect(written.samples).toEqual([
      [
        {
          id: 'sample-new',
          customerId: 'customer-new',
          status: 'ordered',
          comment: '',
          owner: '',
          coffees: 'Fully Washed K3 Classic · 2026\nNatural K4 · 2025',
          amount: '1 kg of each — paid, send price',
          message: 'Our roaster needs at least 1 kg.',
          requestedAt: '2026-11-14T10:00:00.000Z'
        },
        earlier
      ]
    ]);
  });

  it('links a repeat request to the saved customer without adding them again', async () => {
    const { files, written } = stores([ada]);

    await file({ ...request, email: 'ADA@example.com' }, files);

    expect(written.customers).toEqual([]);
    expect(written.samples[0][0]).toMatchObject({ customerId: 'customer-ada', comment: '' });
  });

  it('keeps the saved details and notes what the form said when it differs', async () => {
    const { files, written } = stores([ada]);

    await file(
      { ...request, roastery: 'Resistance Coffee', street: '3 New Street', phone: '' },
      files
    );

    expect(written.customers).toEqual([]);
    expect(written.samples[0][0].customerId).toBe('customer-ada');
    const comment = written.samples[0][0].comment;
    expect(comment).toContain('Resistance Coffee');
    expect(comment).toContain('3 New Street');
    expect(comment).not.toContain('Geneva');
    expect(comment).not.toContain('+41');
  });

  it('keeps the note within the comment limit', async () => {
    const long = 'x'.repeat(200);
    const { files, written } = stores([ada]);

    await file(
      {
        ...request,
        name: long,
        roastery: long,
        street: long,
        city: long.slice(0, 100),
        country: long.slice(0, 100)
      },
      files
    );

    expect(written.samples[0][0].comment.length).toBeLessThanOrEqual(500);
  });

  it('does not add a row when the mailbox rejects the request', async () => {
    const { files, written } = stores([]);

    const result = await fileSampleRequest(
      request,
      async () => {
        throw new Error('mailbox rejected the message');
      },
      files,
      { sample: 'sample-new', customer: 'customer-new' },
      '2026-11-14T10:00:00.000Z',
      site
    );

    expect(result).toEqual({ ok: false });
    expect(written).toEqual({ customers: [], samples: [] });
  });

  it('does not email or store an incomplete request', async () => {
    const send = vi.fn<(mail: OutboundMail) => Promise<void>>();
    const { files, written } = stores([]);

    const result = await fileSampleRequest(
      { ...request, consent: false },
      send,
      files,
      { sample: 'sample-new', customer: 'customer-new' },
      '2026-11-14T10:00:00.000Z',
      site
    );

    expect(result).toEqual({ ok: false });
    expect(send).not.toHaveBeenCalled();
    expect(written).toEqual({ customers: [], samples: [] });
  });
});
