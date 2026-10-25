import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../design/design.css';
import AboutPage from './AboutPage.svelte';
import ContactPage from './ContactPage.svelte';
import HomePage from './HomePage.svelte';
import OurCoffeePage from './OurCoffeePage.svelte';
import Page from './Page.svelte';
import PrivacyPage from './PrivacyPage.svelte';
import { createRawSnippet } from 'svelte';

async function box(locator: ReturnType<typeof page.getByRole>) {
  return (await locator.element()).getBoundingClientRect();
}

async function documentOverflow() {
  const root = await page.getByRole('navigation', { name: 'Primary' }).element();
  const doc = root.ownerDocument!.documentElement;
  return doc.scrollWidth - doc.clientWidth;
}

describe('phone layout', () => {
  it('keeps the logo and primary links on one row at 320px', async () => {
    await page.viewport(320, 700);
    render(HomePage);

    const nav = page.getByRole('navigation', { name: 'Primary' });
    const logo = await box(nav.getByRole('link', { name: 'Makeda Green Coffee', exact: true }));
    const links = await Promise.all(
      ['Our coffee', 'About', 'Contact'].map((name) =>
        box(nav.getByRole('link', { name, exact: true }))
      )
    );

    const linkTops = links.map((link) => link.top);
    expect(Math.max(...linkTops) - Math.min(...linkTops)).toBeLessThan(2);
    expect(logo.right).toBeLessThan(links[0].left);
    expect(links[2].right).toBeLessThanOrEqual(320 + 1);
  });

  it('keeps the logo and primary links on one row, links right-aligned', async () => {
    await page.viewport(531, 700);
    render(HomePage);

    const nav = page.getByRole('navigation', { name: 'Primary' });
    const logo = await box(nav.getByRole('link', { name: 'Makeda Green Coffee', exact: true }));
    const links = await Promise.all(
      ['Our coffee', 'About', 'Contact'].map((name) =>
        box(nav.getByRole('link', { name, exact: true }))
      )
    );

    const linkTops = links.map((link) => link.top);
    expect(Math.max(...linkTops) - Math.min(...linkTops)).toBeLessThan(2);
    expect(logo.right).toBeLessThan(links[0].left);
    expect(logo.bottom).toBeGreaterThan(links[0].top);
    expect(logo.top).toBeLessThan(links[0].bottom);
    expect(links[0].left).toBeLessThan(links[1].left);
    expect(links[1].left).toBeLessThan(links[2].left);
    expect(links[2].right).toBeLessThanOrEqual(531 + 1);
  });

  it.each([
    ['home', HomePage],
    ['our coffee', OurCoffeePage],
    ['about', AboutPage],
    ['contact', ContactPage],
    ['privacy', PrivacyPage]
  ] as const)('%s has no horizontal overflow at 320px', async (_name, PageComponent) => {
    await page.viewport(320, 800);
    render(PageComponent);
    expect(await documentOverflow()).toBeLessThanOrEqual(1);
  });

  it('stretches the hero order button across the page section on a phone', async () => {
    await page.viewport(390, 800);
    render(HomePage);

    const order = await box(page.getByRole('button', { name: 'Order now' }));
    const section = await box(page.getByRole('heading', { name: 'The Project' }));

    expect(Math.abs(order.left - section.left)).toBeLessThan(2);
    expect(Math.abs(order.right - section.right)).toBeLessThan(2);
    expect(order.left).toBeGreaterThan(0);
  });

  it('places the order button just under the hero line', async () => {
    await page.viewport(390, 800);
    render(HomePage);

    const copy = await page.getByText(/Bring home a unique coffee/).element();
    const range = copy.ownerDocument.createRange();
    range.selectNodeContents(copy);
    const textBottom = range.getBoundingClientRect().bottom;
    const order = await box(page.getByRole('button', { name: 'Order now' }));

    expect(order.top).toBeGreaterThan(textBottom);
    expect(order.top - textBottom).toBeLessThan(48);
  });

  it('keeps the collapsible footer through tablet widths', async () => {
    await page.viewport(936, 800);
    render(Page, {
      props: {
        children: createRawSnippet(() => ({ render: () => '<p>Footer check</p>' }))
      }
    });

    const footer = page.getByRole('contentinfo');
    await expect.element(footer.locator('.compact')).toBeVisible();
    await expect.element(footer.locator('.desktop')).not.toBeVisible();
  });

  it('keeps the compact footer tagline on one line', async () => {
    await page.viewport(320, 800);
    render(Page, {
      props: {
        children: createRawSnippet(() => ({ render: () => '<p>Footer check</p>' }))
      }
    });

    const tagline = page.getByRole('contentinfo').locator('.compact-tagline');
    await expect.element(tagline).toBeVisible();
    const taglineEl = await tagline.element();
    expect(taglineEl.scrollWidth).toBeLessThanOrEqual(taglineEl.clientWidth + 1);
  });

  it('gives body copy a readable width', async () => {
    await page.viewport(320, 700);
    render(AboutPage);

    const copy = await box(page.getByText(/Antonio and Giovanni/));
    expect(copy.width).toBeGreaterThan(265);
  });

  it('switches between specialty and commercial tabs on mobile', async () => {
    await page.viewport(390, 800);
    render(OurCoffeePage);

    const specialtyTab = page.getByRole('tab', { name: 'Specialty' });
    const commercialTab = page.getByRole('tab', { name: 'Commercial' });
    await expect.element(specialtyTab).toHaveAttribute('aria-selected', 'true');
    const lots = page.getByRole('table', { name: 'Coffee lots' });
    await expect.element(lots.getByText('Natural K4')).not.toBeVisible();

    await commercialTab.click();
    await expect.element(commercialTab).toHaveAttribute('aria-selected', 'true');
    await expect.element(lots.getByText('Natural K4')).toBeVisible();
    await expect.element(lots.getByText('Fully Washed K3 Classic')).not.toBeVisible();
  });

  it('lines a coffee lot up along the left edge', async () => {
    await page.viewport(390, 800);
    render(OurCoffeePage);

    const lots = page.getByRole('table', { name: 'Coffee lots' });
    const row = lots.getByRole('row').filter({ hasText: 'Natural K3 Special Selection' });
    const origin = await box(row.getByText('Natural K3 Special Selection'));
    const order = await box(row.getByRole('button', { name: 'Order' }));

    expect(Math.abs(order.left - origin.left)).toBeLessThan(4);
  });

  it('stacks lot details under their labels', async () => {
    await page.viewport(390, 800);
    render(OurCoffeePage);

    await page
      .getByRole('table', { name: 'Coffee lots' })
      .getByRole('row')
      .filter({ hasText: 'Natural K3 Special Selection' })
      .click();

    const dialog = page.getByRole('dialog', { name: 'Natural K3 Special Selection' });
    const label = await box(dialog.getByRole('rowheader', { name: 'Country' }));
    const value = await box(dialog.getByText('Democratic Republic of the Congo'));

    expect(value.top).toBeGreaterThanOrEqual(label.bottom - 1);
    expect(value.left).toBeLessThanOrEqual(label.left + 4);
  });

  it('collapses company details in the footer', async () => {
    await page.viewport(390, 800);
    render(Page, {
      props: {
        children: createRawSnippet(() => ({ render: () => '<p>Footer check</p>' }))
      }
    });

    const footer = page.getByRole('contentinfo').locator('.compact');
    const contact = footer.locator('details.footer-details').nth(1);
    const sweden = contact.getByRole('link', { name: '+ 46 70 874 96 26' });
    const italy = contact.getByRole('link', { name: '+ 39 349 76 46 077' });
    await expect.element(contact).not.toHaveAttribute('open');

    await contact.getByText('Contact', { exact: true }).click();
    await expect.element(contact.getByRole('link', { name: /info@makedagreencoffee\.com/ })).toBeVisible();
    await expect.element(sweden).toBeVisible();
    await expect.element(italy).toBeVisible();
    await expect.element(sweden).toHaveAttribute('href', 'tel:+46708749626');
    await expect.element(italy).toHaveAttribute('href', 'tel:+393497646077');

    const explore = footer.locator('details.footer-details').nth(0);
    await expect.element(explore).not.toHaveAttribute('open');
    await expect.element(footer.getByText(/ORG NO\. 5594367913/)).not.toBeVisible();

    await explore.getByText('Explore', { exact: true }).click();
    await expect.element(explore.getByRole('link', { name: 'Our coffee' })).toBeVisible();

    await footer.getByText('Company', { exact: true }).click();
    await expect.element(footer.getByText(/ORG NO\. 5594367913/)).toBeVisible();
  });
});
