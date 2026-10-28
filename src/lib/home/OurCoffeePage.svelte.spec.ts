import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import OurCoffeePage from './OurCoffeePage.svelte';

const arriving = [
  ['Fully Washed K3 Classic', '2026', '92'],
  ['Natural K3 Special Selection', '2026', '84'],
  ['Natural K3 Classic', '2026', '100']
] as const;

function columnBox(name: string, index: number) {
  return page
    .getByRole('columnheader', { name, exact: true })
    .nth(index)
    .element()
    .getBoundingClientRect();
}

describe('OurCoffeePage', () => {
  it('titles the page for green coffee for roasters', async () => {
    render(OurCoffeePage);

    expect(document.title).toBe('Green coffee for roasters — Makeda Green Coffee');
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Green coffee for roasters. Specialty and commercial lots from Lake Kivu cooperatives: fully washed and natural, K3 and K4, in 60 kg bags. Enquire about a lot.'
    );
    await expect
      .element(page.getByRole('heading', { level: 1, name: 'Green coffee for roasters' }))
      .toBeInTheDocument();
    expect(document.querySelectorAll('h1')).toHaveLength(1);
  });

  it('introduces the current offer above the lots', async () => {
    render(OurCoffeePage);

    const offer = page.getByRole('region', { name: 'Green coffee for roasters' });
    await expect
      .element(
        offer.getByText(
          'Green coffee from Lake Kivu: specialty and commercial, fully washed and natural, K3 and K4, in 60 kg bags.'
        )
      )
      .toBeVisible();
  });

  it('lines up specialty and commercial columns', async () => {
    render(OurCoffeePage);
    await page.viewport(1200, 900);

    for (const name of ['Origin', 'Crop', 'Bags', 'Status', 'Request']) {
      await expect
        .element(page.getByRole('columnheader', { name, exact: true }).nth(1))
        .toBeVisible();
      const specialty = columnBox(name, 0);
      const commercial = columnBox(name, 1);
      expect(Math.abs(commercial.left - specialty.left)).toBeLessThan(1);
      expect(Math.abs(commercial.width - specialty.width)).toBeLessThan(1);
    }
  });

  it('lists specialty and commercial lots and names the crop in the enquiry', async () => {
    await page.viewport(1200, 900);
    render(OurCoffeePage);

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect
      .element(nav.getByRole('link', { name: 'Contact', exact: true }))
      .toHaveAttribute('href', '/contact');
    await expect
      .element(page.getByRole('contentinfo').getByRole('link', { name: 'Vimeo' }))
      .toHaveAttribute('href', 'https://vimeo.com/user192364448');

    const lots = page.getByRole('table', { name: 'Coffee lots' });
    await expect
      .element(lots.getByRole('columnheader', { name: 'Crop' }).nth(0))
      .toBeInTheDocument();

    for (const [origin, crop, bags] of arriving) {
      const row = lots
        .getByRole('row')
        .filter({ hasText: origin })
        .filter({ hasText: crop })
        .filter({ hasText: bags })
        .filter({ hasText: 'Arriving soon' });
      await expect.element(row).toBeInTheDocument();
      await expect.element(row.getByRole('button', { name: 'Order' })).toBeInTheDocument();
    }

    await expect
      .element(lots.getByRole('columnheader', { name: 'Crop' }).nth(1))
      .toBeInTheDocument();
    const k4 = lots
      .getByRole('row')
      .filter({ hasText: 'Natural K4' })
      .filter({ hasText: '2025' })
      .filter({ hasText: '1' })
      .filter({ hasText: 'In stock' });
    await expect.element(k4).toBeInTheDocument();

    await k4.getByRole('button', { name: 'Order' }).click();

    const dialog = page.getByRole('dialog', { name: 'Coffee enquiry' });
    await expect.element(dialog).toBeVisible();
    await expect
      .element(dialog.getByRole('textbox', { name: 'Subject *' }))
      .toHaveValue('Enquiry: Natural K4, 2025');

    await dialog.getByRole('button', { name: 'Close' }).click();

    const classic = lots
      .getByRole('row')
      .filter({ hasText: 'Fully Washed K3 Classic' })
      .filter({ hasText: '2026' });
    await classic.getByRole('button', { name: 'Order' }).click();
    await expect
      .element(dialog.getByRole('textbox', { name: 'Subject *' }))
      .toHaveValue('Enquiry: Fully Washed K3 Classic, 2026');
  });

  it('shows a header photo when a lot is opened', async () => {
    await page.viewport(1200, 900);
    render(OurCoffeePage);

    const lots = page.getByRole('table', { name: 'Coffee lots' });
    await lots.getByRole('row').filter({ hasText: 'Natural K4' }).click();

    const dialog = page.getByRole('dialog', { name: 'Natural K4' });
    await expect
      .element(dialog.getByRole('img', { name: 'A farmer reaching into the coffee tree' }))
      .toBeVisible();
  });

  it('shows a header photo on the coffee enquiry', async () => {
    await page.viewport(1200, 900);
    render(OurCoffeePage);

    const lots = page.getByRole('table', { name: 'Coffee lots' });
    await lots
      .getByRole('row')
      .filter({ hasText: 'Natural K4' })
      .getByRole('button', { name: 'Order' })
      .click();

    const dialog = page.getByRole('dialog', { name: 'Coffee enquiry' });
    await expect
      .element(
        dialog.getByRole('img', {
          name: 'Hands sorting green coffee beans on a drying bed'
        })
      )
      .toBeVisible();
  });

  it('opens lot details and PDF downloads for the clicked row', async () => {
    await page.viewport(1200, 900);
    render(OurCoffeePage);

    const lots = page.getByRole('table', { name: 'Coffee lots' });
    const k4 = lots.getByRole('row').filter({ hasText: 'Natural K4' });
    await k4.click();

    const k4Dialog = page.getByRole('dialog', { name: 'Natural K4' });
    await expect.element(k4Dialog).toBeVisible();
    await expect.element(k4Dialog.getByText(/approachable natural-process offer/i)).toBeVisible();
    await expect.element(k4Dialog.getByText(/2025 crop · 1 bag · In stock/i)).toBeVisible();
    await expect
      .element(k4Dialog.getByRole('link', { name: /Download Origin profile/i }))
      .toHaveAttribute('href', '/coffee-sheets/natural-k4-2025.pdf');

    await userEvent.keyboard('{Escape}');

    await k4.getByRole('button', { name: 'Order' }).click();
    await expect.element(page.getByRole('dialog', { name: 'Coffee enquiry' })).toBeVisible();
  });
});
