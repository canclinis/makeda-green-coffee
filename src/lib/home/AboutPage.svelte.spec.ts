import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AboutPage from './AboutPage.svelte';

describe('AboutPage', () => {
  it('introduces the founders on their own page', async () => {
    render(AboutPage);

    await expect.element(page.getByRole('heading', { name: 'WHO WE ARE' })).toBeInTheDocument();
    await expect.element(page.getByText(/Antonio and Giovanni/)).toBeInTheDocument();
    await expect.element(page.getByRole('heading', { name: /OUR MISSION/ })).toBeInTheDocument();
    await expect
      .element(
        page
          .getByRole('navigation', { name: 'Primary' })
          .getByRole('link', { name: 'About', exact: true })
      )
      .toHaveAttribute('href', '/about');
    await expect
      .element(page.getByRole('contentinfo').getByRole('link', { name: 'Vimeo' }))
      .toHaveAttribute('href', 'https://vimeo.com/user192364448');
  });
});
