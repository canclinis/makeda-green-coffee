import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../design/design.css';
import StorageEditor from './StorageEditor.svelte';

// SvelteKit's form handling needs a running app, so this stands in for a successful save.
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
      await after({ result: { type: 'success' }, update: async () => {} });
    });
  }
}));

describe('StorageEditor after saving', () => {
  it('shows the bags left in Ballario and Loscuro after saving, with Ballario holding the rest', async () => {
    render(StorageEditor, {
      props: {
        lots: [
          {
            id: 'washed',
            origin: 'Fully Washed K3',
            crop: '2026',
            arrived: 40,
            sold: { ballario: 10 }
          }
        ],
        book: {}
      }
    });

    await page.getByRole('button', { name: 'Edit Fully Washed K3' }).click();
    await page.getByLabelText('Loscuro, Fully Washed K3').fill('20');
    await page.getByRole('button', { name: 'Done Fully Washed K3' }).click();

    await expect.element(page.getByLabelText('Loscuro, Fully Washed K3')).not.toBeInTheDocument();
    const row = page.getByRole('row', { name: /Fully Washed K3/ });
    await expect.element(row.getByRole('cell').nth(1)).toHaveTextContent(/^10$/);
    await expect.element(row.getByRole('cell').nth(2)).toHaveTextContent(/^20$/);
  });
});
