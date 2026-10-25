import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ButtonHarness from './ButtonHarness.svelte';

describe('Button', () => {
  it('renders the light, burgundy, and icon actions', async () => {
    render(ButtonHarness);

    const order = page.getByRole('button', { name: 'Order now' });
    await expect.element(order).toBeInTheDocument();
    await expect.element(order).toHaveClass('button');

    const discover = page.getByRole('link', { name: 'Discover our coffees' });
    await expect.element(discover).toHaveAttribute('href', '/our-coffee');
    await expect.element(discover).toHaveClass('button', 'button-burgundy');

    const instagram = page.getByRole('link', { name: 'Instagram' });
    await expect
      .element(instagram)
      .toHaveAttribute('href', 'https://instagram.com/makedagreencoffee');
    await expect.element(instagram).toHaveClass('icon-button');

    const submit = page.getByRole('button', { name: 'Get In Touch' });
    await expect.element(submit).toHaveAttribute('type', 'submit');
    await expect.element(submit).toBeDisabled();
  });
});
