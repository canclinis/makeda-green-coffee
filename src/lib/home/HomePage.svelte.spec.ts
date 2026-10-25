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
		const lots = page.getByRole('table', { name: 'Specialty coffee, crop 2026' });
		await expect.element(lots.getByRole('columnheader', { name: 'Origin' })).toBeInTheDocument();
		await expect.element(lots.getByRole('columnheader', { name: 'Bags' })).toBeInTheDocument();
		await expect.element(lots.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
		for (const [origin, bags] of [
			['Arabica Fully Washed K3 Microlot Special Selection', '42 × 60 kg'],
			['Arabica Fully Washed K3', '92 × 60 kg'],
			['Arabica Natural K3 Special Selection', '84 × 60 kg'],
			['Arabica Natural K3', '100 × 60 kg']
		]) {
			const row = lots.getByRole('row').filter({ hasText: origin }).filter({ hasText: bags });
			await expect
				.element(row.getByRole('cell', { name: origin, exact: true }))
				.toBeInTheDocument();
			await expect.element(row.getByRole('cell', { name: bags, exact: true })).toBeInTheDocument();
			await expect
				.element(row.getByRole('cell', { name: 'Arriving soon', exact: true }))
				.toBeInTheDocument();
		}

		await page.getByRole('button', { name: 'Order now' }).click();
		const dialog = page.getByRole('dialog', { name: 'Get In Touch' });
		await expect.element(dialog).toBeVisible();

		await expect.element(dialog.getByRole('heading', { name: 'Get In Touch' })).toBeVisible();
		await expect.element(dialog.getByLabelText('Name *')).toBeVisible();
		await expect.element(dialog.getByLabelText('Email *')).toBeVisible();
		await expect.element(dialog.getByLabelText('Subject *')).toBeVisible();
		await expect.element(dialog.getByLabelText('Message *')).toBeVisible();
		await expect.element(dialog.getByRole('checkbox', { name: /privacy policy/ })).toBeVisible();
	});

	it('opens the contact form from the email icon with a subject already filled', async () => {
		render(HomePage);

		const contact = page.getByRole('region', { name: 'Get In Touch' });
		await expect.element(contact.getByRole('link', { name: 'Contact Us' })).not.toBeInTheDocument();

		await contact.getByRole('button', { name: 'Email' }).click();

		await expect.element(contact.getByRole('textbox', { name: 'Name *' })).toHaveFocus();
		await expect
			.element(contact.getByRole('textbox', { name: 'Subject *' }))
			.toHaveValue('Makeda Green Coffee');
	});
});
