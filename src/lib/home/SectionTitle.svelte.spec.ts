import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SectionTitleHarness from './SectionTitleHarness.svelte';

describe('SectionTitle', () => {
	it('renders a full-width black bar heading', async () => {
		render(SectionTitleHarness);

		const heading = page.getByRole('heading', { name: 'OUR MISSION', level: 2 });
		await expect.element(heading).toBeInTheDocument();
		await expect.element(heading).toHaveAttribute('id', 'mission-heading');
		await expect.element(heading).toHaveClass('section-title');
	});
});
