import { page } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { bagsLeft, parseStockBook } from '#lib/home/stock-book.ts';
import '../design/design.css';
import StockEditor from './StockEditor.svelte';

const customers = [
  {
    id: 'south',
    name: 'Sam South',
    roastery: 'South Roastery',
    email: '',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
    country: ''
  },
  {
    id: 'ada',
    name: 'Ada Lovelace',
    roastery: '',
    email: 'ada@example.com',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
    country: ''
  }
];

function bagsLeftInForm(): number | null {
  const field = document.querySelector<HTMLInputElement>('input[name="book"]');
  if (!field) return null;
  const result = parseStockBook(
    JSON.parse(field.value),
    [{ id: 'washed', origin: 'Fully Washed K3' }],
    customers.map((customer) => customer.id)
  );
  if (!result.ok) return null;
  return bagsLeft(result.book.washed);
}

describe('StockEditor', () => {
  // Never answers: SvelteKit's form handling needs a running app to apply a response.
  const fetch = vi.fn(() => new Promise<Response>(() => {}));

  beforeEach(() => {
    fetch.mockClear();
    vi.stubGlobal('fetch', fetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('lists orders under the bags left out of the bags received', async () => {
    render(StockEditor, {
      props: {
        customers,
        lots: [
          {
            id: 'washed',
            origin: 'Fully Washed K3',
            crop: '2026',
            arrived: 10,
            sales: [
              {
                id: 'sale-1',
                customerId: 'south',
                bags: 2,
                comment: 'paid',
                shipping: 'to-ship' as const,
                invoice: 'to-issue' as const,
                storage: 'ballario' as const
              }
            ]
          }
        ]
      }
    });

    const lot = page.getByRole('region', { name: 'Fully Washed K3 · 2026' });
    await expect.element(lot.getByText('8 of 10')).toBeVisible();

    await lot.getByRole('heading', { name: 'Fully Washed K3 · 2026' }).click();

    await expect.element(lot.getByRole('columnheader', { name: 'Customer' })).toBeVisible();
    await expect.element(lot.getByRole('columnheader', { name: 'Bags' })).toBeVisible();
    await expect.element(lot.getByRole('columnheader', { name: 'Comment' })).toBeVisible();
    await expect
      .element(lot.getByLabelText('Received bags, Fully Washed K3', { exact: true }))
      .toHaveValue('10');
    await expect
      .element(lot.getByRole('link', { name: 'Sam South · South Roastery' }))
      .toHaveAttribute('href', '/admin/customers#customer-south');
    await expect.element(lot.getByText('paid', { exact: true })).toBeVisible();
    await expect
      .element(lot.getByLabelText('Bags 1, Fully Washed K3', { exact: true }))
      .not.toBeInTheDocument();

    await lot.getByRole('button', { name: 'Edit order 1, Fully Washed K3' }).click();
    await expect
      .element(lot.getByLabelText('Bags 1, Fully Washed K3', { exact: true }))
      .toHaveValue('2');
    await expect
      .element(lot.getByLabelText('Comment 1, Fully Washed K3', { exact: true }))
      .toHaveValue('paid');
    await lot.getByRole('button', { name: 'Done editing order 1, Fully Washed K3' }).click();
    await expect
      .element(lot.getByLabelText('Bags 1, Fully Washed K3', { exact: true }))
      .not.toBeInTheDocument();

    await lot.getByRole('button', { name: 'Add order for Fully Washed K3' }).click();
    await lot
      .getByLabelText('Customer 2, Fully Washed K3', { exact: true })
      .selectOptions('Ada Lovelace');
    await lot.getByLabelText('Bags 2, Fully Washed K3', { exact: true }).fill('4');
    await lot.getByLabelText('Comment 2, Fully Washed K3', { exact: true }).fill('invoice 4');

    await expect.element(lot.getByText('4 of 10')).toBeVisible();

    await lot.getByRole('button', { name: 'Remove order 1, Fully Washed K3' }).click();
    await expect.element(lot.getByText('6 of 10')).toBeVisible();
    await expect.poll(() => bagsLeftInForm()).toBe(6);
  });

  it('saves the book when the admin is done with an order', async () => {
    render(StockEditor, {
      props: {
        customers,
        lots: [{ id: 'washed', origin: 'Fully Washed K3', crop: '2026', arrived: 10, sales: [] }]
      }
    });

    const lot = page.getByRole('region', { name: 'Fully Washed K3 · 2026' });
    await lot.getByRole('heading', { name: 'Fully Washed K3 · 2026' }).click();
    await lot.getByRole('button', { name: 'Add order for Fully Washed K3' }).click();
    await lot
      .getByLabelText('Customer 1, Fully Washed K3', { exact: true })
      .selectOptions('Ada Lovelace');
    await lot.getByLabelText('Bags 1, Fully Washed K3', { exact: true }).fill('4');
    await lot.getByRole('button', { name: 'Done editing order 1, Fully Washed K3' }).click();

    await expect.poll(() => fetch.mock.calls.length).toBe(1);
    const [, init] = fetch.mock.calls[0] as unknown as [string, { body: FormData }];
    const sales = JSON.parse(String(init.body.get('book'))).washed.sales;
    expect(
      sales.map((sale: { customerId: string; bags: string }) => [sale.customerId, sale.bags])
    ).toEqual([['ada', '4']]);
  });

  it('lets the admin set shipping and invoice status on each order', async () => {
    render(StockEditor, {
      props: {
        customers,
        lots: [
          {
            id: 'washed',
            origin: 'Fully Washed K3',
            crop: '2026',
            arrived: 10,
            sales: [
              {
                id: 'sale-1',
                customerId: 'south',
                bags: 2,
                comment: '',
                shipping: 'to-ship' as const,
                invoice: 'to-issue' as const,
                storage: 'ballario' as const
              }
            ]
          }
        ]
      }
    });

    const lot = page.getByRole('region', { name: 'Fully Washed K3 · 2026' });
    await lot.getByRole('heading', { name: 'Fully Washed K3 · 2026' }).click();

    const shipping = lot.getByLabelText('Shipping 1, Fully Washed K3', { exact: true });
    const invoice = lot.getByLabelText('Invoice 1, Fully Washed K3', { exact: true });
    await expect.element(shipping).not.toBeInTheDocument();
    await expect.element(invoice).not.toBeInTheDocument();
    await expect.element(lot.getByText('To ship')).toBeVisible();
    await expect.element(lot.getByText('To issue')).toBeVisible();

    await lot.getByRole('button', { name: 'Edit order 1, Fully Washed K3' }).click();
    await expect.element(shipping).toHaveDisplayValue('To ship');
    await expect.element(invoice).toHaveDisplayValue('To issue');

    await shipping.selectOptions('Arrived');
    await invoice.selectOptions('Paid');

    const field = document.querySelector<HTMLInputElement>('input[name="book"]');
    const sale = JSON.parse(field?.value ?? '{}').washed.sales[0];
    expect([sale.shipping, sale.invoice]).toEqual(['arrived', 'paid']);
  });

  it('lets the admin say which storage an order was shipped from', async () => {
    render(StockEditor, {
      props: {
        customers,
        lots: [
          {
            id: 'washed',
            origin: 'Fully Washed K3',
            crop: '2026',
            arrived: 10,
            sales: [
              {
                id: 'sale-1',
                customerId: 'south',
                bags: 2,
                comment: '',
                shipping: 'to-ship' as const,
                invoice: 'to-issue' as const,
                storage: 'ballario'
              }
            ]
          }
        ]
      }
    });

    const lot = page.getByRole('region', { name: 'Fully Washed K3 · 2026' });
    await lot.getByRole('heading', { name: 'Fully Washed K3 · 2026' }).click();

    const storage = lot.getByLabelText('Storage 1, Fully Washed K3', { exact: true });
    await expect.element(storage).not.toBeInTheDocument();
    await expect
      .element(lot.getByRole('link', { name: 'Ballario' }))
      .toHaveAttribute('href', '/admin/storage');

    await lot.getByRole('button', { name: 'Edit order 1, Fully Washed K3' }).click();
    await expect.element(storage).toHaveDisplayValue('Ballario');

    await storage.selectOptions('Loscuro');

    const field = document.querySelector<HTMLInputElement>('input[name="book"]');
    expect(JSON.parse(field?.value ?? '{}').washed.sales[0].storage).toBe('loscuro');
  });

  it('explains when customers have more bags than arrived', async () => {
    render(StockEditor, {
      props: {
        customers,
        lots: [
          {
            id: 'washed',
            origin: 'Fully Washed K3',
            crop: '2026',
            arrived: 10,
            sales: [
              {
                id: 'sale-1',
                customerId: 'south',
                bags: 12,
                comment: '',
                shipping: 'to-ship' as const,
                invoice: 'to-issue' as const,
                storage: 'ballario' as const
              }
            ]
          },
          {
            id: 'natural',
            origin: 'Natural K3',
            crop: '2026',
            arrived: 5,
            sales: []
          }
        ]
      }
    });

    const lot = page.getByRole('region', { name: 'Fully Washed K3 · 2026' });
    const other = page.getByRole('region', { name: 'Natural K3 · 2026' });
    await lot.getByRole('heading', { name: 'Fully Washed K3 · 2026' }).click();
    await other.getByRole('heading', { name: 'Natural K3 · 2026' }).click();

    await expect
      .element(lot.getByRole('alert'))
      .toHaveTextContent('Only 10 bags received, but 12 are ordered. Remove 2 bags to save.');
    await expect.element(other.getByRole('alert')).toHaveTextContent('Fix Fully Washed K3 first.');

    await lot.getByRole('button', { name: 'Edit order 1, Fully Washed K3' }).click();
    await lot.getByLabelText('Bags 1, Fully Washed K3', { exact: true }).fill('10');

    await expect.element(lot.getByRole('alert')).not.toBeInTheDocument();
  });
  it('explains when a storage has fewer bags than are ordered from it', async () => {
    render(StockEditor, {
      props: {
        customers,
        storageBook: { washed: { loscuro: 3 } },
        lots: [
          {
            id: 'washed',
            origin: 'Fully Washed K3',
            crop: '2026',
            arrived: 92,
            sales: [
              {
                id: 'sale-1',
                customerId: 'south',
                bags: 5,
                comment: '',
                shipping: 'to-ship' as const,
                invoice: 'to-issue' as const,
                storage: 'loscuro'
              }
            ]
          }
        ]
      }
    });

    const lot = page.getByRole('region', { name: 'Fully Washed K3 · 2026' });
    await lot.getByRole('heading', { name: 'Fully Washed K3 · 2026' }).click();

    await expect
      .element(lot.getByRole('alert'))
      .toHaveTextContent('Fully Washed K3: Loscuro holds 3 bags, but 5 are ordered from it.');

    await lot.getByRole('button', { name: 'Edit order 1, Fully Washed K3' }).click();
    await lot.getByLabelText('Bags 1, Fully Washed K3', { exact: true }).fill('3');

    await expect.element(lot.getByRole('alert')).not.toBeInTheDocument();
  });

  describe('tabs', () => {
    const lots = [
      {
        id: 'washed',
        origin: 'Fully Washed K3',
        crop: '2026',
        arrived: 10,
        sales: [
          {
            id: 'sale-1',
            customerId: 'south',
            bags: 4,
            comment: '',
            shipping: 'to-ship' as const,
            invoice: 'to-issue' as const,
            storage: 'ballario' as const
          }
        ]
      },
      {
        id: 'old',
        origin: 'Old Harvest',
        crop: '2022',
        arrived: 5,
        sales: [
          {
            id: 'sale-2',
            customerId: 'ada',
            bags: 5,
            comment: '',
            shipping: 'to-ship' as const,
            invoice: 'to-issue' as const,
            storage: 'ballario' as const
          }
        ]
      }
    ];

    it('opens on the coffees still in stock and keeps sold out coffees on their own tab', async () => {
      render(StockEditor, { props: { customers, lots } });

      await expect
        .element(page.getByRole('tab', { name: 'In stock' }))
        .toHaveAttribute('aria-selected', 'true');
      await expect
        .element(page.getByRole('region', { name: 'Fully Washed K3 · 2026' }))
        .toBeVisible();
      await expect
        .element(page.getByRole('region', { name: 'Old Harvest · 2022' }))
        .not.toBeInTheDocument();

      await page.getByRole('tab', { name: 'Sold out' }).click();

      await expect.element(page.getByRole('region', { name: 'Old Harvest · 2022' })).toBeVisible();
      await expect
        .element(page.getByRole('region', { name: 'Fully Washed K3 · 2026' }))
        .not.toBeInTheDocument();

      await page.getByRole('region', { name: 'Old Harvest · 2022' }).getByRole('heading').click();
      await expect.element(page.getByRole('link', { name: 'Ada Lovelace' })).toBeVisible();
    });

    it('still saves every coffee while only one tab is showing', async () => {
      render(StockEditor, { props: { customers, lots } });

      const field = document.querySelector<HTMLInputElement>('input[name="book"]');
      expect(Object.keys(JSON.parse(field?.value ?? '{}')).sort()).toEqual(['old', 'washed']);
    });

    it('moves a coffee to sold out once the saved book has no bags left', async () => {
      const screen = render(StockEditor, { props: { customers, lots } });

      await page
        .getByRole('region', { name: 'Fully Washed K3 · 2026' })
        .getByRole('heading')
        .click();
      await page
        .getByRole('region', { name: 'Fully Washed K3 · 2026' })
        .getByRole('button', { name: 'Add order for Fully Washed K3' })
        .click();
      await page
        .getByLabelText('Customer 2, Fully Washed K3', { exact: true })
        .selectOptions('Ada Lovelace');
      await page.getByLabelText('Bags 2, Fully Washed K3', { exact: true }).fill('6');

      // Not saved yet, so the coffee stays where the admin is working on it.
      await expect
        .element(page.getByRole('region', { name: 'Fully Washed K3 · 2026' }))
        .toBeVisible();

      await screen.rerender({
        customers,
        lots: [
          {
            ...lots[0],
            sales: [
              ...lots[0].sales,
              {
                id: 's3',
                customerId: 'ada',
                bags: 6,
                comment: '',
                shipping: 'to-ship' as const,
                invoice: 'to-issue' as const,
                storage: 'ballario' as const
              }
            ]
          },
          lots[1]
        ]
      });

      await expect
        .element(page.getByRole('region', { name: 'Fully Washed K3 · 2026' }))
        .not.toBeInTheDocument();
      await page.getByRole('tab', { name: 'Sold out' }).click();
      await expect
        .element(page.getByRole('region', { name: 'Fully Washed K3 · 2026' }))
        .toBeVisible();
    });
  });
});
