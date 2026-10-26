import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './Page.svelte';

describe('Page', () => {
  it('wraps page content with the primary nav and the shared footer', async () => {
    await page.viewport(1200, 800);
    render(Page, {
      props: {
        children: createRawSnippet(() => ({
          render: () => '<p>Resistance Coffee</p>'
        }))
      }
    });

    await expect.element(page.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    await expect.element(page.getByText('Resistance Coffee')).toBeInTheDocument();

    const footer = page.getByRole('contentinfo');
    await expect
      .element(footer.getByRole('link', { name: 'Vimeo' }))
      .toHaveAttribute('href', 'https://vimeo.com/user192364448');
    await expect.element(footer.getByRole('button', { name: 'Email' })).toBeInTheDocument();

    const footerNav = footer.locator('.desktop').getByRole('navigation', { name: 'Footer' });
    await expect
      .element(footerNav.getByRole('link', { name: 'Home' }))
      .toHaveAttribute('href', '/');
    await expect
      .element(footerNav.getByRole('link', { name: 'Our coffee' }))
      .toHaveAttribute('href', '/our-coffee');
    await expect
      .element(footerNav.getByRole('link', { name: 'About' }))
      .toHaveAttribute('href', '/about');
    await expect
      .element(footerNav.getByRole('link', { name: 'Contact' }))
      .toHaveAttribute('href', '/contact');

    await expect
      .element(footer.getByRole('link', { name: 'info@makedagreencoffee.com' }))
      .toHaveAttribute('href', 'mailto:info@makedagreencoffee.com');
    const company = footer.locator('.desktop');
    await expect.element(company.getByText(/MAKEDA GREEN COFFEE AB/)).toBeInTheDocument();
    await expect.element(company.getByText(/BROBY ÄNGSVÄG 11/)).toBeInTheDocument();
    await expect.element(company.getByText(/153 92 HÖLÖ, SWEDEN/)).toBeInTheDocument();
    await expect.element(company.getByText(/ORG NO\. 5594367913/)).toBeInTheDocument();
    await expect.element(company.getByText(/VAT NO\. SE559436791301/)).toBeInTheDocument();
    await expect.element(company.getByText(/F-SKATT APPROVED/)).toBeInTheDocument();
    await expect
      .element(footer.getByText(`© ${new Date().getFullYear()} Makeda Green Coffee AB`))
      .toBeInTheDocument();
    await expect
      .element(footer.getByRole('link', { name: 'Privacy', exact: true }))
      .toHaveAttribute('href', '/privacy');
    await expect
      .element(footer.getByRole('link', { name: 'Back to top' }))
      .toHaveAttribute('href', '/#top');
  });

  it('opens the contact form from the email icon', async () => {
    await page.viewport(1200, 800);
    render(Page, {
      props: {
        children: createRawSnippet(() => ({
          render: () => '<p>Resistance Coffee</p>'
        }))
      }
    });

    await page.getByRole('contentinfo').getByRole('button', { name: 'Email' }).click();

    const dialog = page.getByRole('dialog', { name: 'Get in touch' });
    await expect.element(dialog).toBeVisible();
    await expect
      .element(dialog.getByRole('img', { name: 'A volcano rising above dense forest' }))
      .toBeVisible();
    await expect
      .element(dialog.getByRole('textbox', { name: 'Subject *' }))
      .toHaveValue("I'd like to get in touch");
    await expect.element(dialog.getByLabelText('Name *')).toBeVisible();
  });
});
