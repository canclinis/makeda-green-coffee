import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import HomePage from './HomePage.svelte';

describe('HomePage', () => {
  it('describes the homepage for search as green coffee for roasters', () => {
    render(HomePage);

    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Green coffee from Kivu cooperatives for roasters. A fair-trade project with farmers in eastern DR Congo, a region that has faced years of conflict.'
    );
  });

  it('reserves space for the hero film', async () => {
    render(HomePage);

    const film = page.getByLabelText('Hero film');
    await expect.element(film).toHaveAttribute('width', '1920');
    await expect.element(film).toHaveAttribute('height', '818');
  });

  it('tells the project story and collects contact instead of taking an order', async () => {
    await page.viewport(1200, 900);
    render(HomePage);

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect.element(nav).toBeInTheDocument();
    await expect
      .element(nav.getByRole('link', { name: 'Makeda Green Coffee', exact: true }))
      .toBeInTheDocument();
    await expect
      .element(nav.getByRole('link', { name: 'Our coffee', exact: true }))
      .toHaveAttribute('href', '/our-coffee');
    await expect
      .element(nav.getByRole('link', { name: 'About', exact: true }))
      .toHaveAttribute('href', '/about');
    await expect
      .element(nav.getByRole('link', { name: 'Contact', exact: true }))
      .toHaveAttribute('href', '/contact');

    await expect
      .element(page.getByRole('region', { name: 'Makeda Green Coffee' }))
      .toBeInTheDocument();
    await expect.element(page.getByLabelText('Hero film')).toBeInTheDocument();

    await expect.element(page.getByRole('heading', { name: 'The Project' })).toBeInTheDocument();
    await expect.element(page.getByText(/symbol of resistance/)).toBeInTheDocument();
    const coffee = page.getByRole('region', { name: /OUR COFFEE/ });
    await expect.element(coffee).toBeInTheDocument();
    await expect.element(coffee.getByText(/Lake Kivu/)).toBeInTheDocument();
    await expect
      .element(
        coffee.getByRole('img', {
          name: 'A farmer letting washed coffee beans fall through his hands'
        })
      )
      .toBeInTheDocument();
    await expect
      .element(page.getByRole('link', { name: 'Discover our coffees' }))
      .toHaveAttribute('href', '/our-coffee');
    await expect.element(page.getByRole('heading', { name: 'WHO WE ARE' })).not.toBeInTheDocument();
    await expect
      .element(page.getByRole('heading', { name: /OUR MISSION/ }))
      .not.toBeInTheDocument();

    await page.getByRole('button', { name: 'Order now' }).click();
    const dialog = page.getByRole('dialog', { name: 'Get in touch' });
    await expect.element(dialog).toBeVisible();
    await expect
      .element(dialog.getByRole('img', { name: 'A volcano rising above dense forest' }))
      .toBeVisible();
    await expect
      .element(dialog.getByRole('textbox', { name: 'Subject *' }))
      .toHaveValue("I'd like to order coffee");

    await expect.element(dialog.getByRole('heading', { name: 'Get in touch' })).toBeVisible();
    await expect.element(dialog.getByLabelText('Name *')).toBeVisible();
    await expect.element(dialog.getByLabelText('Email *')).toBeVisible();
    await expect.element(dialog.getByLabelText('Subject *')).toBeVisible();
    await expect.element(dialog.getByLabelText('Message *')).toBeVisible();
    await expect.element(dialog.getByRole('checkbox', { name: /privacy policy/ })).toBeVisible();
    await expect
      .element(page.getByRole('region', { name: 'Get in touch' }))
      .not.toBeInTheDocument();

    const footer = page.getByRole('contentinfo').locator('.desktop');
    await expect
      .element(footer.getByRole('link', { name: 'Vimeo' }))
      .toHaveAttribute('href', 'https://vimeo.com/user192364448');
    await expect
      .element(footer.getByRole('link', { name: 'Instagram' }))
      .toHaveAttribute('href', 'https://instagram.com/makedagreencoffee');
    await expect.element(footer.getByRole('button', { name: 'Email' })).toBeInTheDocument();
    await expect
      .element(footer.getByRole('link', { name: '+ 46 70 874 96 26' }))
      .toHaveAttribute('href', 'tel:+46708749626');
    await expect
      .element(footer.getByRole('link', { name: '+ 39 349 76 46 077' }))
      .toHaveAttribute('href', 'tel:+393497646077');
  });
});
