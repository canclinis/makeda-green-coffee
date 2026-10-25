import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TextHarness from './TextHarness.svelte';

describe('Text', () => {
  it('renders a body paragraph', async () => {
    render(TextHarness);

    const paragraph = page.getByText('Grown on volcanic soil.');
    await expect.element(paragraph).toBeInTheDocument();
    await expect.element(paragraph).toHaveClass('paragraph', 'copy');
  });
});
