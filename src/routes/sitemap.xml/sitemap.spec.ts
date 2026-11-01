import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { pageFiles, sitemapResponse } from './sitemap';

describe('sitemap', () => {
  it('lists every public page at its canonical url', async () => {
    const response = sitemapResponse(pageFiles);
    const xml = await response.text();

    expect(response.headers.get('content-type')).toBe('application/xml; charset=utf-8');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(locations(xml)).toEqual([
      'https://www.makedagreencoffee.com/',
      'https://www.makedagreencoffee.com/about',
      'https://www.makedagreencoffee.com/contact',
      'https://www.makedagreencoffee.com/our-coffee',
      'https://www.makedagreencoffee.com/privacy'
    ]);
  });

  it('picks up a new page from its route file', async () => {
    const response = sitemapResponse([...pageFiles, '/src/routes/stories/+page.svelte']);
    const xml = await response.text();

    expect(locations(xml)).toContain('https://www.makedagreencoffee.com/stories');
  });
});

describe('robots.txt', () => {
  it('points crawlers at the sitemap', () => {
    const robots = readFileSync(new URL('../../../static/robots.txt', import.meta.url), 'utf8');

    expect(robots).toMatch(/^Sitemap: https:\/\/www\.makedagreencoffee\.com\/sitemap\.xml$/m);
  });
});

function locations(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}
