import { canonicalUrl } from '#lib/canonical-url.ts';

export const pageFiles = Object.keys(import.meta.glob('/src/routes/**/+page.svelte'));

export function sitemapResponse(files: readonly string[] = pageFiles): Response {
  const urls = files
    .map(pathnameFromPage)
    .sort()
    .map((pathname) => canonicalUrl(pathname));
  const body = urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}

function pathnameFromPage(file: string): string {
  const route = file.replace(/^.*\/routes\//, '').replace(/\/?\+page\.svelte$/, '');
  return route === '' ? '/' : `/${route}`;
}
