import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Button from './Button.svelte';

function text(content: string) {
  return createRawSnippet(() => ({ render: () => `<span>${content}</span>` }));
}

describe('Button', () => {
  it('renders a light button', async () => {
    render(Button, { props: { children: text('Order now') } });

    const order = page.getByRole('button', { name: 'Order now' });
    await expect.element(order).toBeInTheDocument();
    await expect.element(order).toHaveClass('button');
  });

  it('renders a burgundy link', async () => {
    render(Button, {
      props: {
        variant: 'burgundy',
        href: '/our-coffee',
        children: text('Discover our coffees')
      }
    });

    const discover = page.getByRole('link', { name: 'Discover our coffees' });
    await expect.element(discover).toHaveAttribute('href', '/our-coffee');
    await expect.element(discover).toHaveClass('button', 'button-burgundy');
  });

  it('renders an icon link', async () => {
    render(Button, {
      props: {
        variant: 'icon',
        href: 'https://instagram.com/makedagreencoffee',
        'aria-label': 'Instagram',
        target: '_blank',
        rel: 'noreferrer',
        children: text('icon')
      }
    });

    const instagram = page.getByRole('link', { name: 'Instagram' });
    await expect
      .element(instagram)
      .toHaveAttribute('href', 'https://instagram.com/makedagreencoffee');
    await expect.element(instagram).toHaveClass('icon-button');
  });

  it('renders a disabled submit button', async () => {
    render(Button, {
      props: { type: 'submit', disabled: true, children: text('Get In Touch') }
    });

    const submit = page.getByRole('button', { name: 'Get In Touch' });
    await expect.element(submit).toHaveAttribute('type', 'submit');
    await expect.element(submit).toBeDisabled();
  });
});
