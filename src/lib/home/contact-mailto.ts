export type ContactMessage = {
	name: string;
	email: string;
	subject: string;
	message: string;
};

const INBOX = 'info@makedagreencoffee.com';

export function buildContactMailto(fields: ContactMessage) {
	const body = `Name: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`;
	const params = new URLSearchParams({
		subject: fields.subject,
		body
	});

	return `mailto:${INBOX}?${params.toString()}`;
}
