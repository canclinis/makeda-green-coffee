import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import OurCoffeePage from './OurCoffeePage.svelte';

const arriving = [
  ['Fully Washed K3 Special Selection', '2026', '42'],
  ['Arabica Fully Washed K3', '2026', '92'],
  ['Arabica Natural K3 Special Selection', '2026', '84'],
  ['Arabica Natural K3', '2026', '100']
] as const;

describe('OurCoffeePage', () => {
  it('lists specialty and commercial lots and names the crop in the inquiry', async () => {
    render(OurCoffeePage);

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect
      .element(nav.getByRole('link', { name: 'Contact', exact: true }))
      .toHaveAttribute('href', '/contact');
    await expect
      .element(page.getByRole('contentinfo').getByRole('link', { name: 'Vimeo' }))
      .toHaveAttribute('href', 'https://vimeo.com/user192364448');

    const specialty = page.getByRole('table', { name: 'Specialty coffee' });
    await expect.element(specialty.getByRole('columnheader', { name: 'Crop' })).toBeInTheDocument();

    for (const [origin, crop, bags] of arriving) {
      const row = specialty
        .getByRole('row')
        .filter({ hasText: origin })
        .filter({ hasText: crop })
        .filter({ hasText: bags })
        .filter({ hasText: 'Arriving soon' });
      await expect.element(row).toBeInTheDocument();
      await expect.element(row.getByRole('button', { name: 'Order' })).toBeInTheDocument();
    }

    const inStore = specialty
      .getByRole('row')
      .filter({ hasText: 'Arabica Fully Washed K3 Microlot Special Selection' })
      .filter({ hasText: 'In store' })
      .filter({ hasText: '2025' })
      .filter({ hasText: '2' });
    await expect.element(inStore).toBeInTheDocument();

    const commercial = page.getByRole('table', { name: 'Commercial coffee' });
    await expect
      .element(commercial.getByRole('columnheader', { name: 'Crop' }))
      .toBeInTheDocument();
    const k4 = commercial
      .getByRole('row')
      .filter({ hasText: 'Arabica Natural K4' })
      .filter({ hasText: '2025' })
      .filter({ hasText: '1' })
      .filter({ hasText: 'In store' });
    await expect.element(k4).toBeInTheDocument();

    await k4.getByRole('button', { name: 'Order' }).click();

    const dialog = page.getByRole('dialog', { name: 'Coffee inquiry' });
    await expect.element(dialog).toBeVisible();
    await expect
      .element(dialog.getByRole('textbox', { name: 'Subject *' }))
      .toHaveValue('Inquiry: Arabica Natural K4, 2025');

    await dialog.getByRole('button', { name: 'Close' }).click();

    await inStore.getByRole('button', { name: 'Order' }).click();
    await expect
      .element(dialog.getByRole('textbox', { name: 'Subject *' }))
      .toHaveValue('Inquiry: Arabica Fully Washed K3 Microlot Special Selection, 2025');
  });

  it('shows a header photo when a lot is opened', async () => {
    render(OurCoffeePage);

    const commercial = page.getByRole('table', { name: 'Commercial coffee' });
    await commercial.getByRole('row').filter({ hasText: 'Natural K4' }).click();

    const dialog = page.getByRole('dialog', { name: 'Natural K4' });
    await expect
      .element(dialog.getByRole('img', { name: 'A farmer reaching into the coffee tree' }))
      .toBeVisible();
  });

  it('shows a header photo on the coffee inquiry', async () => {
    render(OurCoffeePage);

    const commercial = page.getByRole('table', { name: 'Commercial coffee' });
    await commercial.getByRole('row').filter({ hasText: 'Natural K4' }).getByRole('button', { name: 'Order' }).click();

    const dialog = page.getByRole('dialog', { name: 'Coffee inquiry' });
    await expect
      .element(
        dialog.getByRole('img', {
          name: 'Hands sorting green coffee beans on a drying bed'
        })
      )
      .toBeVisible();
  });

  it('opens lot details and PDF downloads for the clicked row', async () => {
    render(OurCoffeePage);

    const commercial = page.getByRole('table', { name: 'Commercial coffee' });
    const k4 = commercial.getByRole('row').filter({ hasText: 'Arabica Natural K4' });
    await k4.click();

    const k4Dialog = page.getByRole('dialog', { name: 'Arabica Natural K4' });
    await expect.element(k4Dialog).toBeVisible();
    await expect.element(k4Dialog.getByText(/approachable natural-process offer/i)).toBeVisible();
    await expect.element(k4Dialog.getByText(/2025 crop · 1 × 60 kg · In store/i)).toBeVisible();
    await expect
      .element(k4Dialog.getByRole('link', { name: /Download Origin profile/i }))
      .toHaveAttribute('href', '/coffee-sheets/natural-k4-2025.pdf');

    await userEvent.keyboard('{Escape}');

    const specialty = page.getByRole('table', { name: 'Specialty coffee' });
    const inStore = specialty
      .getByRole('row')
      .filter({ hasText: 'Arabica Fully Washed K3 Microlot Special Selection' })
      .filter({ hasText: 'In store' })
      .filter({ hasText: '2025' });
    await inStore.click();

    const microlot = page.getByRole('dialog', {
      name: 'Arabica Fully Washed K3 Microlot Special Selection'
    });
    await expect.element(microlot).toBeVisible();
    await expect
      .element(microlot.getByText(/Best of Congo Cooperative Competition 2025/i))
      .toBeVisible();
    await expect
      .element(microlot.getByRole('link', { name: /Download SCA cupping note/i }))
      .toHaveAttribute('href', '/coffee-sheets/cupping-note-sca-2025-microlot.pdf');

    await userEvent.keyboard('{Escape}');

    await k4.getByRole('button', { name: 'Order' }).click();
    await expect.element(page.getByRole('dialog', { name: 'Coffee inquiry' })).toBeVisible();
  });
});
