import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import OurCoffeePage from './OurCoffeePage.svelte';

const arriving = [
  ['Arabica Fully Washed K3 Microlot Special Selection', '2026', '42 × 60 kg'],
  ['Arabica Fully Washed K3', '2026', '92 × 60 kg'],
  ['Arabica Natural K3 Special Selection', '2026', '84 × 60 kg'],
  ['Arabica Natural K3', '2026', '100 × 60 kg']
] as const;

describe('OurCoffeePage', () => {
  it('lists specialty and commercial lots and names the crop in the inquiry', async () => {
    render(OurCoffeePage);

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect
      .element(nav.getByRole('link', { name: 'Contact', exact: true }))
      .toHaveAttribute('href', '/#contact');

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
      .filter({ hasText: '2 × 60 kg' });
    await expect.element(inStore).toBeInTheDocument();

    const commercial = page.getByRole('table', { name: 'Commercial coffee' });
    await expect
      .element(commercial.getByRole('columnheader', { name: 'Crop' }))
      .toBeInTheDocument();
    const k4 = commercial
      .getByRole('row')
      .filter({ hasText: 'Arabica Natural K4' })
      .filter({ hasText: '2025' })
      .filter({ hasText: '1 × 60 kg' })
      .filter({ hasText: 'In store' });
    await expect.element(k4).toBeInTheDocument();

    await k4.getByRole('button', { name: 'Order' }).click();

    const dialog = page.getByRole('dialog', { name: 'Get In Touch' });
    await expect.element(dialog).toBeVisible();
    await expect
      .element(dialog.getByRole('textbox', { name: 'Subject *' }))
      .toHaveValue('Inquiry: Arabica Natural K4, crop 2025');

    await dialog.getByRole('button', { name: 'Close' }).click();

    await inStore.getByRole('button', { name: 'Order' }).click();
    await expect
      .element(dialog.getByRole('textbox', { name: 'Subject *' }))
      .toHaveValue('Inquiry: Arabica Fully Washed K3 Microlot Special Selection, crop 2025');
  });

  it('opens a placeholder for the clicked lot', async () => {
    render(OurCoffeePage);

    const commercial = page.getByRole('table', { name: 'Commercial coffee' });
    const k4 = commercial.getByRole('row').filter({ hasText: 'Arabica Natural K4' });
    await k4.click();

    const k4Dialog = page.getByRole('dialog', { name: 'Arabica Natural K4' });
    await expect.element(k4Dialog).toBeVisible();
    await expect
      .element(k4Dialog.getByText('More about this coffee is coming soon.'))
      .toBeVisible();
    await expect.element(k4Dialog.getByText('2025')).toBeVisible();
    await expect.element(k4Dialog.getByText('1 × 60 kg')).toBeVisible();

    await k4Dialog.getByRole('button', { name: 'Close' }).click();
    await expect
      .element(page.getByText('More about this coffee is coming soon.'))
      .not.toBeVisible();

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
    await expect.element(microlot.getByText('2 × 60 kg')).toBeVisible();
    await expect
      .element(microlot.getByText('More about this coffee is coming soon.'))
      .toBeVisible();

    await microlot.getByRole('button', { name: 'Close' }).click();

    await k4.getByRole('button', { name: 'Order' }).click();
    await expect.element(page.getByRole('dialog', { name: 'Get In Touch' })).toBeVisible();
    await expect
      .element(page.getByText('More about this coffee is coming soon.'))
      .not.toBeVisible();
  });
});
