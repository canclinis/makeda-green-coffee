import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import IconButton from './IconButton.svelte';

function icon() {
  return createRawSnippet(() => ({ render: () => '<span aria-hidden="true">•</span>' }));
}

describe('IconButton', () => {
  it('renders an icon link', async () => {
    render(IconButton, {
      props: {
        href: 'https://instagram.com/makedagreencoffee',
        'aria-label': 'Instagram',
        target: '_blank',
        rel: 'noreferrer',
        children: icon()
      }
    });

    const instagram = page.getByRole('link', { name: 'Instagram' });
    await expect
      .element(instagram)
      .toHaveAttribute('href', 'https://instagram.com/makedagreencoffee');
    await expect.element(instagram).toHaveClass('icon-button');
  });

  it('renders an icon button', async () => {
    render(IconButton, {
      props: {
        'aria-label': 'Email',
        children: icon()
      }
    });

    await expect.element(page.getByRole('button', { name: 'Email' })).toHaveClass('icon-button');
  });
});
