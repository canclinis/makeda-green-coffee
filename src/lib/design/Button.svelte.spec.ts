import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Button from './Button.svelte';

function text(content: string) {
  return createRawSnippet(() => ({ render: () => `<span>${content}</span>` }));
}

describe('Button', () => {
  it('renders a white button on a dark field', async () => {
    render(Button, { props: { variant: 'default', children: text('Order now') } });

    const order = page.getByRole('button', { name: 'Order now' });
    await expect.element(order).toBeInTheDocument();
    await expect.element(order).toHaveClass('button');
    await expect.element(order).not.toHaveClass('button-burgundy');
  });

  it('renders a burgundy link by default', async () => {
    render(Button, {
      props: {
        href: '/our-coffee',
        children: text('Discover our coffees')
      }
    });

    const discover = page.getByRole('link', { name: 'Discover our coffees' });
    await expect.element(discover).toHaveAttribute('href', '/our-coffee');
    await expect.element(discover).toHaveClass('button', 'button-burgundy');
  });

  it('renders a disabled submit button', async () => {
    render(Button, {
      props: { type: 'submit', disabled: true, children: text('Get in touch') }
    });

    const submit = page.getByRole('button', { name: 'Get in touch' });
    await expect.element(submit).toHaveAttribute('type', 'submit');
    await expect.element(submit).toBeDisabled();
  });
});
