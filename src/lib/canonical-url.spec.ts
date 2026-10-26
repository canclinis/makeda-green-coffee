import { describe, expect, it } from 'vitest';
import { canonicalUrl } from './canonical-url';

describe('canonicalUrl', () => {
  it('names the www host for each page, without a query or hash', () => {
    expect(canonicalUrl('/')).toBe('https://www.makedagreencoffee.com/');
    expect(canonicalUrl('/about')).toBe('https://www.makedagreencoffee.com/about');
    expect(canonicalUrl('/our-coffee')).toBe('https://www.makedagreencoffee.com/our-coffee');
    expect(canonicalUrl('/contact')).toBe('https://www.makedagreencoffee.com/contact');
    expect(canonicalUrl('/privacy')).toBe('https://www.makedagreencoffee.com/privacy');
    expect(canonicalUrl('/about?lot=1')).toBe('https://www.makedagreencoffee.com/about');
    expect(canonicalUrl('/about#top')).toBe('https://www.makedagreencoffee.com/about');
  });
});
