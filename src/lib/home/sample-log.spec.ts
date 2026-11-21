import { describe, expect, it } from 'vitest';
import {
  mergeSampleEdits,
  parseSampleLog,
  parseStoredSamples,
  type SampleRecord
} from './sample-log';

const emptyRequest = {
  owner: '',
  coffees: '',
  amount: '',
  message: '',
  requestedAt: ''
};

function sample(
  row: Omit<SampleRecord, keyof typeof emptyRequest> & Partial<SampleRecord>
): SampleRecord {
  return { ...emptyRequest, ...row };
}

describe('sample log', () => {
  it('keeps which customer ordered a sample, and a comment', () => {
    const result = parseSampleLog([
      { id: 'sample-1', customerId: 'customer-1', status: 'ordered', comment: ' Washed K3 ' }
    ]);

    expect(result).toEqual({
      ok: true,
      samples: [
        sample({
          id: 'sample-1',
          customerId: 'customer-1',
          status: 'ordered',
          comment: 'Washed K3'
        })
      ]
    });
  });

  it('keeps the request, who owns it, and an admin comment', () => {
    const result = parseSampleLog(
      [
        {
          id: 'sample-1',
          customerId: 'customer-1',
          status: 'ordered',
          comment: ' Call Tuesday ',
          owner: ' Sofia@makedagreencoffee.com ',
          coffees: 'Fully Washed K3 Classic · 2026\nNatural K4 · 2025',
          amount: '1 kg of each — paid, send price',
          message: 'Our roaster needs at least 1 kg.',
          requestedAt: '2026-11-14T10:00:00.000Z'
        }
      ],
      ['sofia@makedagreencoffee.com']
    );

    expect(result).toEqual({
      ok: true,
      samples: [
        sample({
          id: 'sample-1',
          customerId: 'customer-1',
          status: 'ordered',
          comment: 'Call Tuesday',
          owner: 'sofia@makedagreencoffee.com',
          coffees: 'Fully Washed K3 Classic · 2026\nNatural K4 · 2025',
          amount: '1 kg of each — paid, send price',
          message: 'Our roaster needs at least 1 kg.',
          requestedAt: '2026-11-14T10:00:00.000Z'
        })
      ]
    });
  });

  it('rejects an owner who is not on the admin list', () => {
    const result = parseSampleLog(
      [
        {
          id: 'sample-1',
          customerId: 'customer-1',
          status: 'ordered',
          comment: '',
          owner: 'stranger@example.com'
        }
      ],
      ['sofia@makedagreencoffee.com']
    );

    expect(result).toEqual({
      ok: false,
      message: 'Assign the sample to someone on the admin list.'
    });
  });

  it('accepts a sample that was sent or received', () => {
    const result = parseSampleLog([
      { id: 'sample-1', customerId: 'customer-1', status: 'sent', comment: '' },
      { id: 'sample-2', customerId: 'customer-2', status: 'received', comment: 'At the roastery' }
    ]);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.samples.map((row) => row.status)).toEqual(['sent', 'received']);
  });

  it('rejects a status other than ordered, sent, or received', () => {
    const result = parseSampleLog([
      { id: 'sample-1', customerId: 'customer-1', status: 'lost', comment: '' }
    ]);

    expect(result).toEqual({
      ok: false,
      message: 'Each sample is ordered, sent, or received.'
    });
  });

  it('asks for a customer when a sample row has none', () => {
    const result = parseSampleLog([
      { id: 'sample-1', customerId: '  ', status: 'sent', comment: 'Posted Tuesday' }
    ]);

    expect(result).toEqual({
      ok: false,
      message: 'Each sample needs a customer.'
    });
  });

  it('reads a saved sample list', () => {
    expect(
      parseStoredSamples([
        { id: 'sample-1', customerId: 'customer-1', status: 'received', comment: 'Delivered' }
      ])
    ).toEqual([
      sample({
        id: 'sample-1',
        customerId: 'customer-1',
        status: 'received',
        comment: 'Delivered'
      })
    ]);
  });

  it('refuses to read a sample file it does not understand', () => {
    expect(() => parseStoredSamples({ name: 'Ada' })).toThrow('Sample file is not a list.');
  });

  it('keeps a request that arrived while the page was open, and a removed row stays removed', () => {
    const ada = sample({
      id: 'sample-1',
      customerId: 'customer-1',
      status: 'ordered',
      comment: '',
      coffees: 'Fully Washed K3 Classic · 2026'
    });
    const grace = sample({
      id: 'sample-2',
      customerId: 'customer-2',
      status: 'ordered',
      comment: '',
      coffees: 'Natural K4 · 2025'
    });

    expect(
      mergeSampleEdits(
        [grace, ada],
        [
          {
            ...ada,
            status: 'sent',
            owner: 'sofia@makedagreencoffee.com',
            comment: 'Posted',
            coffees: 'changed in the browser'
          }
        ],
        ['sample-1']
      )
    ).toEqual([
      grace,
      {
        ...ada,
        status: 'sent',
        owner: 'sofia@makedagreencoffee.com',
        comment: 'Posted'
      }
    ]);

    expect(mergeSampleEdits([grace, ada], [grace], ['sample-1', 'sample-2'])).toEqual([grace]);
  });

  it('adds a sample an admin entered by hand, above the existing ones', () => {
    const ada = sample({
      id: 'sample-1',
      customerId: 'customer-1',
      status: 'ordered',
      comment: ''
    });
    const manual = sample({
      id: 'sample-2',
      customerId: 'customer-2',
      status: 'sent',
      comment: 'Handed over at the fair',
      coffees: 'Natural K4 · 2025',
      requestedAt: '2026-11-21T10:00:00.000Z'
    });

    expect(mergeSampleEdits([ada], [ada, manual], ['sample-1'])).toEqual([manual, ada]);
  });
});
