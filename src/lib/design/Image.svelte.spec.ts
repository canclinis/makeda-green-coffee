import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Image from './Image.svelte';
import mark from './Image.fixture.webp';

describe('Image', () => {
  it('serves a webp and reserves space', async () => {
    const { container } = await render(Image, {
      props: { src: mark, alt: 'A small mark', width: 8, height: 8 }
    });

    const picture = page.getByRole('img', { name: 'A small mark' });
    await expect.element(picture).toBeVisible();
    await expect.element(picture).toHaveAttribute('src', mark);
    await expect.element(picture).toHaveAttribute('width', '8');
    await expect.element(picture).toHaveAttribute('height', '8');
    await expect.element(picture).toHaveAttribute('loading', 'lazy');
    expect(mark).toMatch(/\.webp/);
    expect(container.querySelector('source')).toBeNull();
  });

  it('loads a priority picture ahead of other images', async () => {
    render(Image, {
      props: { src: mark, alt: 'A small mark', width: 8, height: 8, priority: true }
    });

    const picture = page.getByRole('img', { name: 'A small mark' });
    await expect.element(picture).toHaveAttribute('fetchpriority', 'high');
    await expect.element(picture).toHaveAttribute('loading', 'eager');
  });

  it('can load immediately without taking priority', async () => {
    render(Image, {
      props: { src: mark, alt: 'A small mark', width: 8, height: 8, loading: 'eager' }
    });

    const picture = page.getByRole('img', { name: 'A small mark' });
    await expect.element(picture).toHaveAttribute('loading', 'eager');
    await expect.element(picture).not.toHaveAttribute('fetchpriority');
  });
});
