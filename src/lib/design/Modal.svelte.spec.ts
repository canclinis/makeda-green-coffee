import { createRawSnippet } from 'svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Modal from './Modal.svelte';

describe('Modal', () => {
  it('shows its content while open and hides it when dismissed', async () => {
    const view = await render(Modal, {
      props: {
        title: 'Lot details',
        children: createRawSnippet(() => ({
          render: () => '<p>More about this coffee is coming soon.</p>'
        }))
      }
    });

    const dialog = page.getByRole('dialog', { name: 'Lot details', includeHidden: true });

    await expect.element(dialog).not.toBeVisible();

    await view.rerender({ open: true });
    await expect.element(dialog).toBeVisible();
    await expect.element(dialog.getByRole('heading', { name: 'Lot details' })).toBeVisible();
    await expect.element(dialog.getByText('More about this coffee is coming soon.')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await expect.element(dialog).not.toBeVisible();

    await view.rerender({ open: true });
    await expect.element(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect.element(dialog).not.toBeVisible();
  });
});
