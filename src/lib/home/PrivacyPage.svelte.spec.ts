import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import PrivacyPage from './PrivacyPage.svelte';

describe('PrivacyPage', () => {
  it('explains that the contact form is used to reply and not for a mailing list', async () => {
    render(PrivacyPage);

    await expect
      .element(page.getByRole('heading', { name: 'PRIVACY', exact: true }))
      .toBeInTheDocument();
    await expect
      .element(page.getByText(/name, email address, and message so we can reply/))
      .toBeInTheDocument();
    await expect.element(page.getByText(/do not\s+add you to a\s+mailing list/)).toBeInTheDocument();
    const notice = page.getByRole('region', { name: 'PRIVACY' });
    await expect
      .element(notice.getByRole('link', { name: 'info@makedagreencoffee.com' }))
      .toHaveAttribute('href', 'mailto:info@makedagreencoffee.com');
  });

  it('mentions service providers outside the EU and no analytics cookies', async () => {
    render(PrivacyPage);

    await expect
      .element(page.getByText(/Service providers outside the EU/))
      .toBeInTheDocument();
    await expect.element(page.getByText(/do not use analytics or advertising cookies/)).toBeInTheDocument();
    await expect.element(page.getByText(/may share your IP address/)).toBeInTheDocument();
  });

  it('covers retention and the right to withdraw form consent', async () => {
    render(PrivacyPage);

    await expect
      .element(page.getByText(/keep it in our inbox as part of our\s+correspondence with you/))
      .toBeInTheDocument();
    await expect
      .element(page.getByText(/withdraw\s+the consent you gave on the\s+form/))
      .toBeInTheDocument();
  });
});
