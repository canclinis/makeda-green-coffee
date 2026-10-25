import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AboutPage from './AboutPage.svelte';
import HomePage from './HomePage.svelte';
import OurCoffeePage from './OurCoffeePage.svelte';

async function box(locator: ReturnType<typeof page.getByRole>) {
  return (await locator.element()).getBoundingClientRect();
}

describe('phone layout', () => {
  it('keeps the primary links on one row', async () => {
    await page.viewport(320, 700);
    render(HomePage);

    const nav = page.getByRole('navigation', { name: 'Primary' });
    const links = await Promise.all(
      ['Our coffee', 'About', 'Contact'].map((name) =>
        box(nav.getByRole('link', { name, exact: true }))
      )
    );

    const tops = links.map((link) => link.top);
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(2);
    expect(links[0].left).toBeLessThan(links[1].left);
    expect(links[1].left).toBeLessThan(links[2].left);
  });

  it('gives body copy a readable width', async () => {
    await page.viewport(320, 700);
    render(AboutPage);

    const copy = await box(page.getByText(/Antonio and Giovanni/));
    expect(copy.width).toBe(0);
  });

  it('lines a coffee lot up along the left edge', async () => {
    await page.viewport(390, 800);
    render(OurCoffeePage);

    const lots = page.getByRole('table', { name: 'Coffee lots' });
    const row = lots.getByRole('row').filter({ hasText: 'Natural K4' });
    const origin = await box(row.getByText('Natural K4'));
    const order = await box(row.getByRole('button', { name: 'Order' }));

    expect(Math.abs(order.left - origin.left)).toBeLessThan(4);
  });

  it('stacks lot details under their labels', async () => {
    await page.viewport(390, 800);
    render(OurCoffeePage);

    await page.getByRole('table', { name: 'Coffee lots' }).getByRole('row').filter({ hasText: 'Natural K4' }).click();

    const dialog = page.getByRole('dialog', { name: 'Natural K4' });
    const label = await box(dialog.getByRole('rowheader', { name: 'Country' }));
    const value = await box(dialog.getByText('Democratic Republic of the Congo'));

    expect(value.top).toBeGreaterThanOrEqual(label.bottom - 1);
    expect(value.left).toBeLessThanOrEqual(label.left + 4);
  });
});
