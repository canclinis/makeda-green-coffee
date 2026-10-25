import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ZigZag from './ZigZag.svelte';

function text(content: string) {
  return createRawSnippet(() => ({ render: () => `<p>${content}</p>` }));
}

function columns(container: HTMLElement) {
  const media = container.querySelector('img, video') as HTMLElement;
  const copy = container.querySelector('p')?.parentElement as HTMLElement;
  return {
    media: media.getBoundingClientRect(),
    copy: copy.getBoundingClientRect()
  };
}

describe('ZigZag', () => {
  it('places an image to the left of the text', async () => {
    await page.viewport(1200, 800);
    const { container } = await render(ZigZag, {
      props: {
        mediaSide: 'left',
        media: {
          type: 'image',
          src: '/images/coffee.jpeg',
          alt: 'Washed beans falling through a farmer’s hands',
          width: 1707,
          height: 2560
        },
        children: text('From the heart of Lake Kivu.')
      }
    });

    await expect
      .element(page.getByRole('img', { name: 'Washed beans falling through a farmer’s hands' }))
      .toBeVisible();
    const { media, copy } = columns(container);
    expect(media.right).toBeLessThanOrEqual(copy.left);
    expect(Math.abs(media.top - copy.top)).toBeLessThan(2);
  });

  it('places an image to the right of the text', async () => {
    await page.viewport(1200, 800);
    const { container } = await render(ZigZag, {
      props: {
        mediaSide: 'right',
        media: {
          type: 'image',
          src: '/images/logo-symbol-burgundy.jpg',
          alt: 'Makeda symbol',
          width: 420,
          height: 420
        },
        children: text('A project of sustainability and fair trade.')
      }
    });

    const { media, copy } = columns(container);
    expect(copy.right).toBeLessThanOrEqual(media.left);
    expect(Math.abs(media.top - copy.top)).toBeLessThan(2);
  });

  it('places custom media on the chosen side of the text', async () => {
    await page.viewport(1200, 800);
    const { container } = await render(ZigZag, {
      props: {
        mediaSide: 'right',
        mediaSlot: createRawSnippet(() => ({
          render: () =>
            '<video aria-label="Coffee film" src="/video/coffee_pill_women.mp4"></video>'
        })),
        children: text('Write to us.')
      }
    });

    await expect.element(page.getByLabelText('Coffee film')).toBeVisible();
    const { media, copy } = columns(container);
    expect(copy.right).toBeLessThanOrEqual(media.left);
    expect(Math.abs(media.top - copy.top)).toBeLessThan(2);
  });

  it('places a video on the chosen side of the text', async () => {
    await page.viewport(1200, 800);
    const { container } = await render(ZigZag, {
      props: {
        mediaSide: 'left',
        media: {
          type: 'video',
          src: '/video/hero.mp4',
          poster: '/images/hero-poster.jpg',
          label: 'Farmers at the washing station'
        },
        children: text('Beside the film.')
      }
    });

    const film = page.getByLabelText('Farmers at the washing station');
    await expect.element(film).toBeVisible();
    await expect.element(film).toHaveAttribute('src', '/video/hero.mp4');
    const { media, copy } = columns(container);
    expect(media.right).toBeLessThanOrEqual(copy.left);
    expect(Math.abs(media.top - copy.top)).toBeLessThan(2);
  });
});
