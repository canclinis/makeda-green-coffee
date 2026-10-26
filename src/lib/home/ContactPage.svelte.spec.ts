import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../design/design.css';
import ContactPage from './ContactPage.svelte';

describe('ContactPage', () => {
  it('shows contact with the film beside the form', async () => {
    render(ContactPage);

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect
      .element(nav.getByRole('link', { name: 'Contact', exact: true }))
      .toHaveAttribute('href', '/contact');

    await expect
      .element(page.getByRole('heading', { name: 'CONTACT', exact: true }))
      .toBeInTheDocument();
    const film = page.getByLabelText('Coffee film');
    await expect.element(film).toBeVisible();
    await expect.element(film).toHaveAttribute('src', '/video/coffee_pill_women.mp4');
    await expect.element(film).toHaveAttribute('poster', '/images/contact-film-poster.jpg');
    await expect.element(film).toHaveAttribute('controls', '');
    await expect.element(film).toHaveAttribute('preload', 'metadata');

    const contact = page.getByRole('region', { name: 'CONTACT' });
    await expect.element(contact.getByLabelText('Name *')).toBeVisible();
    await expect
      .element(contact.getByRole('textbox', { name: 'Subject *' }))
      .toHaveValue("I'd like to get in touch");

    const submit = page.getByRole('button', { name: 'Get in touch' });
    await expect.element(submit).toHaveStyle({
      backgroundColor: 'rgb(92, 16, 34)',
      color: 'rgb(255, 255, 255)'
    });

    await expect.element(page.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('opens the contact modal from the email icon', async () => {
    render(ContactPage);

    await page.getByRole('contentinfo').getByRole('button', { name: 'Email' }).click();

    const dialog = page.getByRole('dialog', { name: 'Get in touch' });
    await expect.element(dialog).toBeVisible();
    await expect
      .element(dialog.getByRole('textbox', { name: 'Subject *' }))
      .toHaveValue("I'd like to get in touch");
  });
});
