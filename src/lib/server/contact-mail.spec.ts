import { describe, expect, it, vi } from 'vitest';
import { sendContactMessage } from './contact-mail';

const companyForm = `
<form action="https://makedagreencoffee.com/wp-admin/admin-ajax.php?action=kernel&amp;p=%2Fyooessentials%2Fform" method="POST" data-uk-yooessentials-form>
	<input name="name">
	<input name="email">
	<input name="subject">
	<textarea name="message"></textarea>
	<input type="checkbox" name="checkbox-page#8-0-1-5[]" value="privacy" required>
	<input type="hidden" name="formid" value="fe4da51d">
	<input type="hidden" name="_wpnonce_yooessentials" value="nonce-1">
</form>
`;

const message = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Green coffee',
  message: 'Hello from the roastery',
  consent: true
};

describe('sendContactMessage', () => {
  it('delivers the visitor message through the company contact form', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === 'POST') {
        return Response.json({ success: true });
      }
      return new Response(companyForm);
    });

    const result = await sendContactMessage(message, fetchImpl);

    expect(result).toEqual({ ok: true });

    const post = fetchImpl.mock.calls.find((call) => call[1]?.method === 'POST');
    expect(post?.[0]).toBe(
      'https://makedagreencoffee.com/wp-admin/admin-ajax.php?action=kernel&p=%2Fyooessentials%2Fform'
    );

    const fields = new URLSearchParams(String(post?.[1]?.body));
    expect(fields.get('name')).toBe('Ada');
    expect(fields.get('email')).toBe('ada@example.com');
    expect(fields.get('subject')).toBe('Green coffee');
    expect(fields.get('message')).toBe('Hello from the roastery');
    expect(fields.get('formid')).toBe('fe4da51d');
    expect(fields.get('_wpnonce_yooessentials')).toBe('nonce-1');
    expect(fields.get('checkbox-page#8-0-1-5[]')).toBe('privacy');
  });

  it('reports failure when the company form rejects the message', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === 'POST') {
        return Response.json({ success: false }, { status: 422 });
      }
      return new Response(companyForm);
    });

    const result = await sendContactMessage(message, fetchImpl);

    expect(result).toEqual({ ok: false });
  });

  it('does not submit a message without privacy consent', async () => {
    const fetchImpl = vi.fn();

    const result = await sendContactMessage({ ...message, consent: false }, fetchImpl);

    expect(result).toEqual({ ok: false });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
