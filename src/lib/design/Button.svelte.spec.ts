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

  it('rounds every button the same way', async () => {
    render(Button, { props: { children: text('Next') } });
    render(Button, { props: { variant: 'default', children: text('Get free sample') } });

    const next = getComputedStyle(
      page.getByRole('button', { name: 'Next' }).element()
    ).borderRadius;
    const sample = getComputedStyle(
      page.getByRole('button', { name: 'Get free sample' }).element()
    ).borderRadius;

    expect(next).toBe(sample);
    expect(next).not.toBe('0px');
  });

  it('renders a disabled submit button', async () => {
    render(Button, {
      props: { type: 'submit', disabled: true, children: text('Get in touch') }
    });

    const submit = page.getByRole('button', { name: 'Get in touch' });
    await expect.element(submit).toHaveAttribute('type', 'submit');
    await expect.element(submit).toBeDisabled();
  });

  it('blocks clicks and shows a busy state while loading', async () => {
    let clicks = 0;
    render(Button, {
      props: { loading: true, onclick: () => clicks++, children: text('Send') }
    });

    const send = page.getByRole('button', { name: 'Send' });
    await expect.element(send).toBeDisabled();
    await expect.element(send).toHaveAttribute('aria-busy', 'true');
    await expect.element(send).toHaveClass('loading');
    ((await send.element()) as HTMLButtonElement).click();
    expect(clicks).toBe(0);
  });

  it('looks disabled and ignores hover when disabled', async () => {
    render(Button, { props: { disabled: true, children: text('Next') } });

    const next = page.getByRole('button', { name: 'Next' });
    await expect.element(next).toBeDisabled();
    await expect.element(next).not.toHaveAttribute('aria-busy');
    expect(getComputedStyle(next.element()).cursor).toBe('not-allowed');
    expect(Number(getComputedStyle(next.element()).opacity)).toBeLessThan(1);
  });

  it('is not disabled by default', async () => {
    render(Button, { props: { children: text('Next') } });

    await expect.element(page.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  it('cannot follow a disabled link', async () => {
    render(Button, { props: { href: '/our-coffee', disabled: true, children: text('Discover') } });

    const link = page.getByRole('link', { name: 'Discover' });
    await expect.element(link).toHaveAttribute('aria-disabled', 'true');
    await expect.element(link).not.toHaveAttribute('href');
  });

  it('shows a check mark when the work succeeded, and keeps its name', async () => {
    render(Button, { props: { success: true, children: text('Save') } });

    const save = page.getByRole('button', { name: 'Save' });
    await expect.element(save).toHaveClass('success');
    await expect.element(save).toBeEnabled();
    expect(save.element().querySelector('svg.check')).not.toBeNull();
  });

  it('prefers the loading state over the success state', async () => {
    render(Button, { props: { loading: true, success: true, children: text('Save') } });

    const save = page.getByRole('button', { name: 'Save' });
    await expect.element(save).toHaveClass('loading');
    await expect.element(save).not.toHaveClass('success');
    expect(save.element().querySelector('svg.check')).toBeNull();
  });
});
