import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AboutPage from './AboutPage.svelte';

describe('AboutPage', () => {
  it('describes the founders and the fair-trade supply for search', () => {
    render(AboutPage);

    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Antonio and Giovanni bring green coffee from Kivu cooperatives to roasters in Europe, directly and on fair terms.'
    );
  });

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

  it('shows the coffee leaves as a photo with a reserved size', async () => {
    render(AboutPage);

    const photo = page.getByRole('img', { name: 'Coffee leaves covered in raindrops' });
    await expect.element(photo).toBeVisible();
    await expect.element(photo).toHaveAttribute('width', '2560');
    await expect.element(photo).toHaveAttribute('height', '1702');
  });
});
