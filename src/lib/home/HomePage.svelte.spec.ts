import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import HomePage from './HomePage.svelte';

describe('HomePage', () => {
	it('tells the project story and collects contact instead of taking an order', async () => {
		render(HomePage);

		const nav = page.getByRole('navigation', { name: 'Primary' });
		await expect.element(nav).toBeInTheDocument();
		await expect
			.element(nav.getByRole('link', { name: 'Makeda Green Coffee', exact: true }))
			.toBeInTheDocument();
		await expect
			.element(nav.getByRole('link', { name: 'The Project', exact: true }))
			.toBeInTheDocument();
		await expect
			.element(nav.getByRole('link', { name: 'Mission', exact: true }))
			.toBeInTheDocument();
		await expect
			.element(nav.getByRole('link', { name: 'Coffee', exact: true }))
			.toBeInTheDocument();
		await expect.element(nav.getByRole('link', { name: 'About', exact: true })).toBeInTheDocument();
		await expect
			.element(nav.getByRole('link', { name: 'Contact', exact: true }))
			.toBeInTheDocument();

		await expect
			.element(page.getByRole('region', { name: 'Makeda Green Coffee' }))
			.toBeInTheDocument();
		await expect.element(page.getByLabelText('Hero film')).toBeInTheDocument();

		await expect.element(page.getByRole('heading', { name: 'The Project' })).toBeInTheDocument();
		await expect.element(page.getByText(/Resistance Coffee/)).toBeInTheDocument();
		await expect.element(page.getByRole('heading', { name: /OUR MISSION/ })).toBeInTheDocument();
		await expect.element(page.getByRole('heading', { name: /OUR COFFEE/ })).toBeInTheDocument();
		await expect.element(page.getByText('D.R. Congo', { exact: true })).toBeInTheDocument();

		await page.getByRole('button', { name: 'Contact' }).click();
		const dialog = page.getByRole('dialog', { name: 'Get In Touch' });
		await expect.element(dialog).toBeVisible();

		await expect.element(dialog.getByRole('heading', { name: 'Get In Touch' })).toBeVisible();
		await expect.element(dialog.getByLabelText('Name *')).toBeVisible();
		await expect.element(dialog.getByLabelText('Email *')).toBeVisible();
		await expect.element(dialog.getByLabelText('Subject *')).toBeVisible();
		await expect.element(dialog.getByLabelText('Message *')).toBeVisible();
		await expect.element(dialog.getByRole('checkbox', { name: /privacy policy/ })).toBeVisible();
	});
});
