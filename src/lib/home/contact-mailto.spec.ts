import { describe, expect, it } from 'vitest';
import { buildContactMailto } from './contact-mailto';

describe('buildContactMailto', () => {
	it('addresses the company inbox with the visitor message', () => {
		const href = buildContactMailto({
			name: 'Ada',
			email: 'ada@example.com',
			subject: 'Green coffee',
			message: 'Hello from the roastery'
		});

		expect(href.startsWith('mailto:info@makedagreencoffee.com?')).toBe(true);

		const url = new URL(href);
		expect(url.searchParams.get('subject')).toBe('Green coffee');
		expect(url.searchParams.get('body')).toContain('Ada');
		expect(url.searchParams.get('body')).toContain('ada@example.com');
		expect(url.searchParams.get('body')).toContain('Hello from the roastery');
	});
});
