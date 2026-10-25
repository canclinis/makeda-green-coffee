import { createRawSnippet } from 'svelte';
import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import './design.css';
import Modal from './Modal.svelte';
import SectionTitle from './SectionTitle.svelte';

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
    await expect.element(dialog.getByRole('button', { name: 'Close' })).toHaveStyle({
      color: 'rgb(17, 17, 17)'
    });
    await expect.element(dialog.getByRole('heading', { name: 'Lot details' })).toBeVisible();
    await expect.element(dialog.getByText('More about this coffee is coming soon.')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await expect.element(dialog).not.toBeVisible();

    await view.rerender({ open: true });
    await expect.element(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect.element(dialog).not.toBeVisible();
  });

  it('opens scrolled to the top', async () => {
    const view = await render(Modal, {
      props: {
        title: 'Lot details',
        children: createRawSnippet(() => ({
          render: () =>
            '<div><p>The lot starts here.</p><div style="height: 2400px"></div><label>Notes <input name="notes" /></label></div>'
        }))
      }
    });

    const dialog = page.getByRole('dialog', { name: 'Lot details', includeHidden: true });

    await view.rerender({ open: true });
    await expect.element(dialog).toBeVisible();
    expect(dialog.element().scrollTop).toBe(0);
    await expect.element(dialog.getByText('The lot starts here.')).toBeInViewport();

    dialog.element().scrollTop = dialog.element().scrollHeight;
    expect(dialog.element().scrollTop).toBeGreaterThan(0);

    await userEvent.keyboard('{Escape}');
    await expect.element(dialog).not.toBeVisible();

    await view.rerender({ open: true });
    await expect.element(dialog).toBeVisible();
    expect(dialog.element().scrollTop).toBe(0);
    await expect.element(dialog.getByText('The lot starts here.')).toBeInViewport();
  });

  it('shows a header image for the lot', async () => {
    await render(Modal, {
      props: {
        open: true,
        title: 'Lot details',
        image: {
          src: '/images/lots/drying.jpg',
          alt: 'Women sorting coffee cherries on raised drying beds'
        },
        children: createRawSnippet(() => ({
          render: () => '<p>More about this coffee is coming soon.</p>'
        }))
      }
    });

    const dialog = page.getByRole('dialog', { name: 'Lot details' });
    await expect
      .element(
        dialog.getByRole('img', { name: 'Women sorting coffee cherries on raised drying beds' })
      )
      .toBeVisible();
    await expect.element(dialog.getByRole('button', { name: 'Close' })).toHaveStyle({
      color: 'rgb(255, 255, 255)'
    });
  });

  it('uses a smaller title than a section title', async () => {
    render(SectionTitle, {
      props: {
        children: createRawSnippet(() => ({ render: () => '<span>OUR COFFEE</span>' }))
      }
    });
    await render(Modal, {
      props: {
        open: true,
        title: 'Fully Washed K3 Classic',
        children: createRawSnippet(() => ({ render: () => '<p>Details</p>' }))
      }
    });

    const sectionTitle = page.getByRole('heading', { name: 'OUR COFFEE' });
    const modalTitle = page.getByRole('heading', { name: 'Fully Washed K3 Classic' });
    await expect.element(sectionTitle).toBeVisible();
    await expect.element(modalTitle).toBeVisible();

    const sectionSize = parseFloat(getComputedStyle(sectionTitle.element()).fontSize);
    const modalSize = parseFloat(getComputedStyle(modalTitle.element()).fontSize);
    expect(modalSize).toBeLessThan(sectionSize);
  });
});
