import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../design/design.css';
import AdminShell from './AdminShell.svelte';

const child = createRawSnippet(() => ({ render: () => '<p>Lot rows</p>' }));

function shell(section: 'stock' | 'storage' | 'samples' | 'customers') {
  return {
    email: 'sofia@example.com',
    section,
    title: section === 'stock' ? 'Bags in stock' : 'Samples',
    headingId: 'admin-heading',
    documentTitle: 'Admin',
    children: child
  };
}

describe('AdminShell', () => {
  it('replaces the public menu with orders, samples, customers, and log out', async () => {
    render(AdminShell, { props: shell('stock') });

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect
      .element(nav.getByRole('link', { name: 'Orders', exact: true }))
      .toHaveAttribute('href', '/admin');
    await expect
      .element(nav.getByRole('link', { name: 'Orders', exact: true }))
      .toHaveAttribute('aria-current', 'page');
    await expect
      .element(nav.getByRole('link', { name: 'Samples', exact: true }))
      .toHaveAttribute('href', '/admin/samples');
    await expect
      .element(nav.getByRole('link', { name: 'Customers', exact: true }))
      .toHaveAttribute('href', '/admin/customers');
    await expect.element(nav.getByRole('button', { name: 'Log out' })).toBeVisible();
    await expect.element(nav.getByRole('link', { name: 'Our coffee' })).not.toBeInTheDocument();
    await expect.element(nav.getByRole('link', { name: 'About' })).not.toBeInTheDocument();
    await expect.element(nav.getByRole('link', { name: 'Contact' })).not.toBeInTheDocument();
    await expect.element(page.getByRole('button', { name: 'Sign out' })).not.toBeInTheDocument();
  });

  it('shows who is signed in in the nav, and not again in the page', async () => {
    await page.viewport(1200, 800);
    render(AdminShell, {
      props: { ...shell('stock'), email: 'info@makedagreencoffee.com' }
    });

    const nav = page.getByRole('navigation', { name: 'Primary' });
    const signedIn = nav.getByText('Signed in as info@makedagreencoffee.com.');
    await expect.element(signedIn).toBeVisible();
    await expect
      .element(page.getByRole('region', { name: 'Bags in stock' }).getByText(/Signed in as/))
      .not.toBeInTheDocument();

    const stock = nav.getByRole('link', { name: 'Orders', exact: true });
    const wideIdentity = (await signedIn.element()).getBoundingClientRect();
    const wideStock = (await stock.element()).getBoundingClientRect();
    expect(wideIdentity.right).toBeLessThanOrEqual(wideStock.left + 1);
    expect(Math.abs(wideIdentity.top - wideStock.top)).toBeLessThan(8);

    await page.viewport(320, 700);
    const narrowIdentity = (await signedIn.element()).getBoundingClientRect();
    const narrowStock = (await stock.element()).getBoundingClientRect();
    expect(narrowIdentity.top).toBeGreaterThanOrEqual(narrowStock.bottom - 1);
    expect(narrowIdentity.left).toBeGreaterThanOrEqual(0);
    expect(narrowIdentity.right).toBeLessThanOrEqual(320);
  });

  it('marks Samples as the current page on the samples screen', async () => {
    render(AdminShell, { props: shell('samples') });

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect
      .element(nav.getByRole('link', { name: 'Samples', exact: true }))
      .toHaveAttribute('aria-current', 'page');
    await expect
      .element(nav.getByRole('link', { name: 'Orders', exact: true }))
      .not.toHaveAttribute('aria-current', 'page');
  });

  it('links to Storage, and marks it as the current page on the storage screen', async () => {
    render(AdminShell, { props: shell('storage') });

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect
      .element(nav.getByRole('link', { name: 'Storage', exact: true }))
      .toHaveAttribute('href', '/admin/storage');
    await expect
      .element(nav.getByRole('link', { name: 'Storage', exact: true }))
      .toHaveAttribute('aria-current', 'page');
    await expect
      .element(nav.getByRole('link', { name: 'Orders', exact: true }))
      .not.toHaveAttribute('aria-current', 'page');
  });

  it('marks Customers as the current page on the customers screen', async () => {
    render(AdminShell, { props: shell('customers') });

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect
      .element(nav.getByRole('link', { name: 'Customers', exact: true }))
      .toHaveAttribute('aria-current', 'page');
  });
});
