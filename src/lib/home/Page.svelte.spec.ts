import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './Page.svelte';

describe('Page', () => {
  it('wraps page content with the primary nav and the shared footer', async () => {
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
    await expect
      .element(footer.getByRole('link', { name: 'Email' }))
      .toHaveAttribute('href', '/contact');

    const footerNav = footer.getByRole('navigation', { name: 'Footer' });
    await expect
      .element(footerNav.getByRole('link', { name: 'The Project' }))
      .toHaveAttribute('href', '/#project');
    await expect
      .element(footerNav.getByRole('link', { name: 'Coffee', exact: true }))
      .toHaveAttribute('href', '/#coffee');
    await expect
      .element(footerNav.getByRole('link', { name: 'Our coffees' }))
      .toHaveAttribute('href', '/our-coffee');
    await expect
      .element(footerNav.getByRole('link', { name: 'About' }))
      .toHaveAttribute('href', '/about');
    await expect
      .element(footerNav.getByRole('link', { name: 'Contact' }))
      .toHaveAttribute('href', '/contact');
    await expect
      .element(footerNav.getByRole('link', { name: 'Privacy policy' }))
      .toHaveAttribute('href', '/privacy');

    await expect
      .element(footer.getByRole('link', { name: 'info@makedagreencoffee.com' }))
      .toHaveAttribute('href', 'mailto:info@makedagreencoffee.com');
    await expect.element(footer.getByText(/MAKEDA GREEN COFFEE AB/)).toBeInTheDocument();
    await expect.element(footer.getByText(/BROBY ÄNGSVÄG 11/)).toBeInTheDocument();
    await expect.element(footer.getByText(/153 92 HÖLÖ, SWEDEN/)).toBeInTheDocument();
    await expect.element(footer.getByText(/ORG NO\. 5594367913/)).toBeInTheDocument();
    await expect.element(footer.getByText(/VAT NO\. SE559436791301/)).toBeInTheDocument();
    await expect.element(footer.getByText(/F-SKATT APPROVED/)).toBeInTheDocument();
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
});
