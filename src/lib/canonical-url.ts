const SITE = 'https://www.makedagreencoffee.com';

/** Official URL for a path. Query and hash stay off the tag. */
export function canonicalUrl(pathname: string): string {
  const url = new URL(pathname, SITE);
  url.search = '';
  url.hash = '';
  return url.href;
}
