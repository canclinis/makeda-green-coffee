import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../design/design.css';
import StockEditor from './StockEditor.svelte';

// SvelteKit's form handling needs a running app, so this stands in for a successful save.
// It resets the form the way SvelteKit does unless the component opts out.
vi.mock('$app/forms', () => ({
  enhance: (
    form: HTMLFormElement,
    submit: (input: { formData: FormData; cancel: () => void }) => unknown
  ) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const after = (await submit({ formData: new FormData(form), cancel() {} })) as (input: {
        result: { type: string };
        update: (options?: { reset?: boolean }) => Promise<void>;
      }) => Promise<void>;
      await after({
        result: { type: 'success' },
        update: async (options) => {
          if (options?.reset !== false) HTMLFormElement.prototype.reset.call(form);
        }
      });
    });
  }
}));

describe('StockEditor after saving', () => {
  it('keeps the received bags of every coffee, also when one sells out', async () => {
    render(StockEditor, {
      props: {
        customers: [
          {
            id: 'ada',
            name: 'Ada Lovelace',
            roastery: '',
            email: '',
            phone: '',
            street: '',
            postalCode: '',
            city: '',
            country: ''
          }
        ],
        lots: [
          { id: 'washed', origin: 'Fully Washed K3', crop: '2026', arrived: 10, sales: [] },
          { id: 'natural', origin: 'Natural K3', crop: '2026', arrived: 5, sales: [] }
        ]
      }
    });

    const washed = page.getByRole('region', { name: 'Fully Washed K3 · 2026' });
    await washed.getByRole('heading', { name: 'Fully Washed K3 · 2026' }).click();
    await washed.getByRole('button', { name: 'Add order for Fully Washed K3' }).click();
    await washed
      .getByLabelText('Customer 1, Fully Washed K3', { exact: true })
      .selectOptions('Ada Lovelace');
    await washed.getByLabelText('Bags 1, Fully Washed K3', { exact: true }).fill('10');
    await washed.getByRole('button', { name: 'Done editing order 1, Fully Washed K3' }).click();

    await expect.element(washed.getByText('0 of 10')).toBeVisible();
    await expect
      .element(washed.getByLabelText('Received bags, Fully Washed K3', { exact: true }))
      .toHaveValue('10');
    await expect
      .element(
        page
          .getByRole('region', { name: 'Natural K3 · 2026' })
          .getByLabelText('Received bags, Natural K3', { exact: true })
      )
      .toHaveValue('5');
  });
});
