import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AboutPage from './AboutPage.svelte';

describe('AboutPage', () => {
  it('titles the page Who are we', async () => {
    render(AboutPage);

    expect(document.title).toBe('Who are we — Makeda Green Coffee');
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Fair-trade green coffee from Kivu. Antonio and Giovanni follow it from the cooperatives to the roastery door, with no intermediaries. Enquire about the project.'
    );
    await expect
      .element(page.getByRole('heading', { level: 1, name: 'Who are we' }))
      .toBeInTheDocument();
    expect(document.querySelectorAll('h1')).toHaveLength(1);
  });

  it('introduces the founders on their own page', async () => {
    render(AboutPage);

    await expect
      .element(page.getByRole('heading', { level: 1, name: 'Who are we' }))
      .toBeInTheDocument();
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
