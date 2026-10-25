import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import PrivacyPage from './PrivacyPage.svelte';

describe('PrivacyPage', () => {
  it('explains that a contact message is used to reply and not for a mailing list', async () => {
    render(PrivacyPage);

    await expect
      .element(page.getByRole('heading', { name: 'PRIVACY', exact: true }))
      .toBeInTheDocument();
    await expect
      .element(page.getByText(/name, email address, subject, and message/))
      .toBeInTheDocument();
    await expect.element(page.getByText(/do not add you to a mailing list/)).toBeInTheDocument();
    const notice = page.getByRole('region', { name: 'PRIVACY' });
    await expect
      .element(notice.getByRole('link', { name: 'info@makedagreencoffee.com' }))
      .toHaveAttribute('href', 'mailto:info@makedagreencoffee.com');
  });
});
