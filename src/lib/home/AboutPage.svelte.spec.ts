import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AboutPage from './AboutPage.svelte';

describe('AboutPage', () => {
  it('titles the about page for Makeda Green Coffee', async () => {
    render(AboutPage);

    expect(document.title).toBe('About Makeda Green Coffee');
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Green coffee from Kivu. Antonio and Giovanni follow it from the cooperatives to the roastery door, with no intermediaries. Enquire about the project.'
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

  it('lists each mission objective beside a coffee bean', async () => {
    render(AboutPage);

    const items = page.getByRole('region', { name: 'OUR MISSION' }).getByRole('listitem');
    await expect.element(items.nth(0)).toBeVisible();

    const objectives = items.elements();
    expect(objectives).toHaveLength(4);
    expect(objectives.map((item) => item.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'Importing coffee from cooperatives in the Kivu region, to support the region’s growing economy;',
      'bringing green coffee to European roasters who want a quality product, on terms and at prices that are fair to small and medium-sized producers;',
      'improving the quality of coffee growing and processing in the cooperatives, by reinvesting part of our profits in equipment, training and logistical support;',
      'following every step ourselves, from the Congo to the roastery door, with no intermediaries between the cooperative and the roaster.'
    ]);

    for (const item of objectives) {
      expect(item.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('shows the coffee leaves as a photo with a reserved size', async () => {
    render(AboutPage);

    const photo = page.getByRole('img', { name: 'Coffee leaves covered in raindrops' });
    await expect.element(photo).toBeVisible();
    await expect.element(photo).toHaveAttribute('width', '1600');
    await expect.element(photo).toHaveAttribute('height', '720');
  });
});
