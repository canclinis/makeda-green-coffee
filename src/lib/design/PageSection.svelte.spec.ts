import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import './design.css';
import AboutPage from '../home/AboutPage.svelte';
import ContactPage from '../home/ContactPage.svelte';
import HomePage from '../home/HomePage.svelte';
import OurCoffeePage from '../home/OurCoffeePage.svelte';
import PrivacyPage from '../home/PrivacyPage.svelte';

function pageSections(container: HTMLElement) {
  return [...container.querySelectorAll('h1, h2')]
    .filter((heading) => heading.parentElement?.tagName === 'SECTION')
    .map((heading) => {
      const section = heading.parentElement as HTMLElement;
      const well = heading.nextElementSibling as HTMLElement;
      const body = well.querySelector('p, table, form, ul') as HTMLElement;
      const headingBox = heading.getBoundingClientRect();
      const bodyBox = body.getBoundingClientRect();
      const sectionBox = section.getBoundingClientRect();
      const wellBox = well.getBoundingClientRect();
      const style = getComputedStyle(section);
      return {
        name: heading.textContent?.trim() ?? '',
        titleGap: Math.round(bodyBox.top - headingBox.bottom),
        tail: Math.round(sectionBox.bottom - wellBox.bottom),
        frame: style.borderLeftWidth,
        frameColor: style.borderLeftColor,
        scrollMargin: style.scrollMarginTop
      };
    });
}

describe('PageSection', () => {
  it('starts every body the same distance under its title, in the same frame', async () => {
    await page.viewport(1200, 800);
    const pages = [HomePage, AboutPage, OurCoffeePage, ContactPage, PrivacyPage];
    const rows = [];

    for (const Page of pages) {
      const view = render(Page);
      await expect.element(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
      rows.push(...pageSections(view.container));
      await view.unmount();
    }

    expect(rows.length).toBeGreaterThan(1);
    const [first] = rows;
    for (const row of rows) {
      expect(row.titleGap, row.name).toBe(first.titleGap);
      expect(row.tail, row.name).toBe(first.tail);
      expect(row.frame, row.name).toBe(first.frame);
      expect(row.frameColor, row.name).toBe(first.frameColor);
      expect(row.scrollMargin, row.name).toBe(first.scrollMargin);
    }
  });
});
