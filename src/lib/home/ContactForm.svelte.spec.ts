import { page } from 'vitest/browser';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ContactForm from './ContactForm.svelte';

describe('ContactForm', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('sends the message and confirms it was sent', async () => {
		const requests: Array<{ url: string; body: string }> = [];
		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
				requests.push({ url: String(input), body: String(init?.body ?? '') });
				return Response.json({ ok: true });
			})
		);

		render(ContactForm, { props: { headingId: 'contact-heading' } });

		await page.getByLabelText('Name *').fill('Ada');
		await page.getByLabelText('Email *').fill('ada@example.com');
		await page.getByLabelText('Subject *').fill('Green coffee');
		await page.getByLabelText('Message *').fill('Hello from the roastery');
		await page.getByRole('checkbox', { name: /privacy policy/ }).click();
		await page.getByRole('button', { name: 'Get In Touch' }).click();

		await expect.element(page.getByText('Your message has been sent.')).toBeVisible();

		const request = requests.find((entry) => entry.url.endsWith('/api/contact'));
		expect(request?.body).toContain('ada@example.com');
		expect(request?.body).toContain('Hello from the roastery');
		expect(window.location.href.includes('mailto:')).toBe(false);
	});
});
