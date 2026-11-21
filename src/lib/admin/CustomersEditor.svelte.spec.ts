import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { parseCustomerList, type CustomerRecord } from '#lib/home/customer-log.ts';
import '../design/design.css';
import CustomersEditor from './CustomersEditor.svelte';

// SvelteKit's form handling needs a running app, so this stands in for the server's answer.
const server = vi.hoisted(() => ({
  answer: { type: 'success', status: 200, data: { saved: true } } as unknown,
  sent: [] as FormData[]
}));

vi.mock('$app/forms', () => ({
  enhance: (
    form: HTMLFormElement,
    submit: (input: { formData: FormData; cancel: () => void }) => unknown
  ) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const after = (await submit({ formData, cancel() {} })) as (input: {
        result: unknown;
        update: (options?: unknown) => Promise<void>;
      }) => Promise<void>;
      server.sent.push(formData);
      await after({ result: server.answer, update: async () => {} });
    });
  }
}));

const ada = {
  id: 'customer-1',
  name: 'Ada Lovelace',
  roastery: 'Resistance Roastery',
  email: 'ada@example.com',
  phone: '+41 79 000 00 00',
  street: '12 Roastery Lane',
  postalCode: '1200',
  city: 'Geneva',
  country: 'Switzerland'
};

beforeEach(() => {
  server.answer = { type: 'success', status: 200, data: { saved: true } };
  server.sent = [];
});

/** The customer list sent with the most recent save. */
function lastSavedCustomers(): CustomerRecord[] | null {
  const raw = server.sent.at(-1)?.get('customers');
  if (typeof raw !== 'string') return null;
  const result = parseCustomerList(JSON.parse(raw));
  return result.ok ? result.customers : null;
}

describe('CustomersEditor', () => {
  it('shows only the roastery of a saved customer until it is opened', async () => {
    render(CustomersEditor, { props: { customers: [ada] } });

    const customer = page.getByRole('region', { name: 'Resistance Roastery' });
    await expect.element(customer.getByText('Resistance Roastery')).toBeVisible();
    await expect.element(page.getByLabelText('Email 1')).not.toBeVisible();

    await customer.getByText('Resistance Roastery').click();

    await expect.element(page.getByLabelText('Name 1')).toHaveValue('Ada Lovelace');
    await expect.element(page.getByLabelText('Roastery 1')).toHaveValue('Resistance Roastery');
    await expect.element(page.getByLabelText('Email 1')).toHaveValue('ada@example.com');
    await expect.element(page.getByLabelText('Phone 1')).toHaveValue('+41 79 000 00 00');
    await expect.element(page.getByLabelText('Street 1')).toHaveValue('12 Roastery Lane');
    await expect.element(page.getByLabelText('Postal code 1')).toHaveValue('1200');
    await expect.element(page.getByLabelText('City 1')).toHaveValue('Geneva');
    await expect.element(page.getByLabelText('Country 1')).toHaveValue('Switzerland');
  });

  it('shows the name when a customer has no roastery', async () => {
    render(CustomersEditor, { props: { customers: [{ ...ada, roastery: '' }] } });

    await expect.element(page.getByRole('region', { name: 'Ada Lovelace' })).toBeVisible();
  });

  it('saves an edit on its own, without a save button', async () => {
    render(CustomersEditor, { props: { customers: [ada] } });

    await page.getByText('Resistance Roastery').click();
    await page.getByLabelText('City 1').fill('Zurich');

    await expect.poll(() => lastSavedCustomers()).toEqual([{ ...ada, city: 'Zurich' }]);
    await expect.element(page.getByText('All changes saved')).toBeVisible();
    await expect.element(page.getByRole('button', { name: /save/i })).not.toBeInTheDocument();
  });

  it('does not save a new customer until it has a name', async () => {
    render(CustomersEditor, { props: { customers: [ada] } });

    await page.getByRole('button', { name: 'Add customer' }).click();
    await page.getByLabelText('Email 2').fill('grace@example.com');
    await page.getByLabelText('Name 2').fill('Grace Hopper');

    await expect
      .poll(() => lastSavedCustomers()?.map((customer) => customer.name))
      .toEqual(['Ada Lovelace', 'Grace Hopper']);
    for (const sent of server.sent) {
      const list = parseCustomerList(JSON.parse(String(sent.get('customers'))));
      expect(list.ok && list.customers.every((customer) => customer.name !== '')).toBe(true);
    }
  });

  it('removes a customer straight away', async () => {
    render(CustomersEditor, { props: { customers: [ada] } });

    await page.getByText('Resistance Roastery').click();
    await page.getByRole('button', { name: 'Remove customer 1' }).click();

    await expect.element(page.getByText('No customers yet.')).toBeVisible();
    await expect.poll(() => lastSavedCustomers()).toEqual([]);
  });

  it('keeps a customer that is in use and says why it cannot be removed', async () => {
    server.answer = {
      type: 'failure',
      status: 400,
      data: { message: 'A customer with samples or orders cannot be removed.' }
    };
    render(CustomersEditor, { props: { customers: [ada] } });

    await page.getByText('Resistance Roastery').click();
    await page.getByRole('button', { name: 'Remove customer 1' }).click();

    await expect
      .element(page.getByRole('alert'))
      .toHaveTextContent('A customer with samples or orders cannot be removed.');
    await expect.element(page.getByRole('region', { name: 'Resistance Roastery' })).toBeVisible();
  });

  it('opens a new customer to fill in, and removes one', async () => {
    render(CustomersEditor, { props: { customers: [ada] } });

    await page.getByRole('button', { name: 'Add customer' }).click();
    await page.getByLabelText('Name 2').fill('Grace Hopper');
    await page.getByLabelText('Email 2').fill('grace@example.com');
    await page.getByText('Resistance Roastery').click();
    await page.getByRole('button', { name: 'Remove customer 1' }).click();

    await expect
      .poll(() => lastSavedCustomers()?.map((customer) => customer.name))
      .toEqual(['Grace Hopper']);
  });

  it('opens the customer a link points to', async () => {
    window.location.hash = '#customer-customer-1';
    render(CustomersEditor, { props: { customers: [ada] } });

    await expect.element(page.getByLabelText('Email 1')).toBeVisible();
    window.location.hash = '';
  });

  it('treats refreshed customers as already saved', async () => {
    const screen = render(CustomersEditor, { props: { customers: [ada] } });

    await screen.rerender({ customers: [{ ...ada, city: 'Zurich' }] });
    await page.getByText('Resistance Roastery').click();
    await page.getByLabelText('Country 1').fill('Swiss');
    await page.getByLabelText('Country 1').fill('Switzerland');
    await new Promise((resolve) => setTimeout(resolve, 800));

    expect(server.sent).toEqual([]);
  });

  it('says so when there are no customers yet', async () => {
    render(CustomersEditor, { props: { customers: [] } });

    await expect.element(page.getByText('No customers yet.')).toBeVisible();
  });
});
