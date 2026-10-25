import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Text from './Text.svelte';

describe('Text', () => {
  it('renders a body paragraph', async () => {
    const { container } = await render(Text, {
      props: {
        class: 'copy',
        children: createRawSnippet(() => ({
          render: () => '<span>Grown on volcanic soil.</span>'
        }))
      }
    });

    const paragraph = page.elementLocator(container.querySelector('p') as HTMLElement);
    await expect.element(paragraph).toHaveTextContent('Grown on volcanic soil.');
    await expect.element(paragraph).toHaveClass('copy');
  });
});
