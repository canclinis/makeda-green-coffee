import { describe, expect, it } from 'vitest';
import {
  bagsLeft,
  parseStockBook,
  parseStoredStock,
  stockEditorLots,
  stockLevelsFromBook
} from './stock-book';

const lots = [
  { id: 'washed', origin: 'Fully Washed K3' },
  { id: 'natural', origin: 'Natural K3' }
];

const customerIds = ['north', 'south', 'ada'];

function payload(washed: unknown, natural: unknown = { arrived: '0', sales: [] }) {
  return { washed, natural };
}

describe('stock book', () => {
  it('subtracts the bags each customer bought from the bags that arrived', () => {
    const result = parseStockBook(
      payload({
        arrived: '40',
        sales: [
          { id: 'sale-1', customerId: 'north', bags: '10', comment: 'invoice 4' },
          { id: 'sale-2', customerId: 'south', bags: '6', comment: '' }
        ]
      }),
      lots,
      customerIds
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.book.washed.sales.map((sale) => sale.customerId)).toEqual(['north', 'south']);
    expect(bagsLeft(result.book.washed)).toBe(24);
    expect(stockLevelsFromBook(result.book)).toEqual({ washed: 24, natural: 0 });
  });

  it('keeps which customer ordered, and a comment', () => {
    const result = parseStockBook(
      payload({
        arrived: '10',
        sales: [{ id: 'sale-1', customerId: ' ada ', bags: '2', comment: ' paid ' }]
      }),
      lots,
      customerIds
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.book.washed.sales[0]).toEqual({
      id: 'sale-1',
      customerId: 'ada',
      bags: 2,
      comment: 'paid',
      shipping: 'to-ship',
      invoice: 'to-issue',
      storage: 'ballario'
    });
  });

  it('keeps how far each order has got with shipping and with its invoice', () => {
    const result = parseStockBook(
      payload({
        arrived: '10',
        sales: [
          {
            id: 'sale-1',
            customerId: 'north',
            bags: '2',
            comment: '',
            shipping: 'arrived',
            invoice: 'paid'
          },
          {
            id: 'sale-2',
            customerId: 'south',
            bags: '1',
            comment: '',
            shipping: 'shipped',
            invoice: 'sent',
            storage: 'ballario'
          }
        ]
      }),
      lots,
      customerIds
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.book.washed.sales.map((sale) => [sale.shipping, sale.invoice])).toEqual([
      ['arrived', 'paid'],
      ['shipped', 'sent']
    ]);
  });

  it('keeps which storage each order was shipped from', () => {
    const result = parseStockBook(
      payload({
        arrived: '10',
        sales: [
          { id: 'sale-1', customerId: 'north', bags: '2', comment: '', storage: 'loscuro' },
          { id: 'sale-2', customerId: 'south', bags: '1', comment: '', storage: 'ballario' }
        ]
      }),
      lots,
      customerIds
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.book.washed.sales.map((sale) => sale.storage)).toEqual(['loscuro', 'ballario']);
  });

  describe('orders from a counted storage', () => {
    const order = (bags: string, extra: object = {}) => ({
      arrived: '20',
      sales: [
        { id: 'sale-1', customerId: 'north', bags, comment: '', storage: 'loscuro', ...extra }
      ]
    });

    it('refuses an order from Loscuro when it holds none of that coffee', () => {
      expect(parseStockBook(payload(order('5')), lots, customerIds, {})).toEqual({
        ok: false,
        message: 'Fully Washed K3: Loscuro holds 0 bags, but 5 are ordered from it.'
      });
    });

    it('refuses orders from Loscuro that add up to more than it holds', () => {
      const result = parseStockBook(
        payload({
          arrived: '20',
          sales: [
            { id: 'sale-1', customerId: 'north', bags: '2', comment: '', storage: 'loscuro' },
            { id: 'sale-2', customerId: 'south', bags: '2', comment: '', storage: 'loscuro' }
          ]
        }),
        lots,
        customerIds,
        { washed: { loscuro: 3 } }
      );

      expect(result.ok).toBe(false);
    });

    it('accepts orders from Loscuro that it can cover', () => {
      const result = parseStockBook(payload(order('3')), lots, customerIds, {
        washed: { loscuro: 3 }
      });

      expect(result.ok).toBe(true);
    });

    it('does not count the bags of another coffee in Loscuro', () => {
      const result = parseStockBook(payload(order('3')), lots, customerIds, {
        natural: { loscuro: 9 }
      });

      expect(result.ok).toBe(false);
    });

    it('counts an order that already shipped as bags gone from Loscuro', () => {
      const result = parseStockBook(
        payload(order('5', { shipping: 'shipped' })),
        lots,
        customerIds,
        { washed: { loscuro: 3 } }
      );

      expect(result.ok).toBe(false);
    });

    it('refuses an order from Ballario for more than it started with', () => {
      const ballario = (bags: string) => payload(order(bags, { storage: 'ballario' }), undefined);

      expect(parseStockBook(ballario('16'), lots, customerIds, { washed: { loscuro: 5 } })).toEqual(
        {
          ok: false,
          message: 'Fully Washed K3: Ballario holds 15 bags, but 16 are ordered from it.'
        }
      );
      expect(parseStockBook(ballario('15'), lots, customerIds, { washed: { loscuro: 5 } }).ok).toBe(
        true
      );
    });
  });

  it('refuses a storage it does not know', () => {
    const result = parseStockBook(
      payload({
        arrived: '10',
        sales: [{ id: 'sale-1', customerId: 'north', bags: '2', comment: '', storage: 'attic' }]
      }),
      lots,
      customerIds
    );

    expect(result.ok).toBe(false);
  });

  it('shows an order saved before storages existed as shipped from Ballario', () => {
    const book = parseStoredStock({
      washed: {
        arrived: 10,
        sales: [{ id: 'sale-1', customerId: 'north', bags: 3, comment: '' }]
      }
    });

    expect(book.washed.sales[0].storage).toBe('ballario');
  });

  it('refuses a shipping or invoice status it does not know', () => {
    for (const status of [{ shipping: 'lost' }, { invoice: 'forgotten' }]) {
      const result = parseStockBook(
        payload({
          arrived: '10',
          sales: [{ id: 'sale-1', customerId: 'north', bags: '2', comment: '', ...status }]
        }),
        lots,
        customerIds
      );
      expect(result.ok).toBe(false);
    }
  });

  it('shows an order saved before statuses existed as still to ship and to invoice', () => {
    const book = parseStoredStock({
      washed: {
        arrived: 10,
        sales: [{ id: 'sale-1', customerId: 'north', bags: 3, comment: '' }]
      }
    });

    expect(book.washed.sales[0]).toMatchObject({ shipping: 'to-ship', invoice: 'to-issue' });
  });

  it('refuses an order for a customer that is not saved', () => {
    expect(
      parseStockBook(
        payload({
          arrived: '10',
          sales: [{ id: 'sale-1', customerId: 'stranger', bags: '2', comment: '' }]
        }),
        lots,
        customerIds
      )
    ).toEqual({ ok: false, message: 'Fully Washed K3: choose a saved customer for each order.' });
  });

  it('keeps a saved customer comment with that purchase', () => {
    const result = parseStockBook(
      payload({
        arrived: '10',
        sales: [{ id: 'sale-1', customerId: 'north', bags: '2', comment: '  paid in March  ' }]
      }),
      lots,
      customerIds
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.book.washed.sales[0].comment).toBe('paid in March');
  });

  it('treats an older bag count as arrived, with no customers yet', () => {
    const book = parseStoredStock({ washed: 17 });

    expect(book).toEqual({ washed: { arrived: 17, sales: [] } });
    expect(bagsLeft(book.washed)).toBe(17);
  });

  it('reads bags left from a book that already has customers', () => {
    const book = parseStoredStock({
      washed: {
        arrived: 40,
        sales: [{ id: 'sale-1', customerId: 'north', bags: 10, comment: 'paid' }]
      }
    });

    expect(stockLevelsFromBook(book)).toEqual({ washed: 30 });
  });

  it('refuses a save where customers bought more bags than arrived', () => {
    expect(
      parseStockBook(
        payload({
          arrived: '5',
          sales: [{ id: 'sale-1', customerId: 'north', bags: '9', comment: '' }]
        }),
        lots,
        customerIds
      )
    ).toEqual({
      ok: false,
      message: 'Fully Washed K3: customers have more bags than arrived.'
    });
  });

  it('ignores a customer row that was added and left empty', () => {
    const result = parseStockBook(
      payload({
        arrived: '8',
        sales: [{ id: 'sale-1', customerId: '  ', bags: '', comment: '  ' }]
      }),
      lots,
      customerIds
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.book.washed).toEqual({ arrived: 8, sales: [] });
  });

  it('asks for a customer and a bag count when an order row is only partly filled', () => {
    const result = parseStockBook(
      payload({
        arrived: '8',
        sales: [{ id: 'sale-1', customerId: 'north', bags: '', comment: '' }]
      }),
      lots,
      customerIds
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.message).toBe(
      'Fully Washed K3: choose a customer and how many bags for each order.'
    );
  });

  it('rejects a save that leaves out a lot', () => {
    const result = parseStockBook({ washed: { arrived: '1', sales: [] } }, lots, customerIds);

    expect(result.ok).toBe(false);
  });

  it('uses the catalogue count as arrived until that lot has been saved', () => {
    expect(
      stockEditorLots([{ id: 'washed', origin: 'Fully Washed K3', crop: '2026', bags: '42' }], {})
    ).toEqual([{ id: 'washed', origin: 'Fully Washed K3', crop: '2026', arrived: 42, sales: [] }]);
  });

  it('shows saved arrivals and customers instead of the catalogue count', () => {
    const rows = stockEditorLots(
      [{ id: 'washed', origin: 'Fully Washed K3', crop: '2026', bags: '42' }],
      {
        washed: {
          arrived: 17,
          sales: [
            {
              id: 'sale-1',
              customerId: 'north',
              bags: 4,
              comment: '',
              shipping: 'to-ship',
              invoice: 'to-issue',
              storage: 'ballario'
            }
          ]
        }
      }
    );

    expect(rows[0].arrived).toBe(17);
    expect(rows[0].sales[0].customerId).toBe('north');
  });

  it('refuses to read a stock file it does not understand', () => {
    expect(() => parseStoredStock({ washed: { arrived: 4 } })).toThrow(
      'Stock file for washed is missing its customer list.'
    );
  });
});
