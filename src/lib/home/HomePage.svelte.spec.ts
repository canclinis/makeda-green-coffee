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
		await expect.element(page.getByText(/symbol of resistance/)).toBeInTheDocument();
		await expect.element(page.getByRole('heading', { name: /OUR MISSION/ })).toBeInTheDocument();
		const coffee = page.getByRole('region', { name: /OUR COFFEE/ });
		await expect.element(coffee).toBeInTheDocument();
		await expect.element(coffee.getByText(/Lake Kivu/)).toBeInTheDocument();
		await expect
			.element(
				coffee.getByRole('img', {
					name: 'A farmer letting washed coffee beans fall through his hands'
				})
			)
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('link', { name: 'Discover our coffees' }))
			.toHaveAttribute('href', '/our-coffee');

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
