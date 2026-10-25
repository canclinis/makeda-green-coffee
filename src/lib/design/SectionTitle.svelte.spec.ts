import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SectionTitle from './SectionTitle.svelte';

describe('SectionTitle', () => {
  it('renders a full-width black bar heading', async () => {
    render(SectionTitle, {
      props: {
        id: 'mission-heading',
        children: createRawSnippet(() => ({ render: () => '<span>OUR MISSION</span>' }))
      }
    });

    const heading = page.getByRole('heading', { name: 'OUR MISSION', level: 2 });
    await expect.element(heading).toBeInTheDocument();
    await expect.element(heading).toHaveAttribute('id', 'mission-heading');
  });
});
