import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../design/design.css';
import SampleContactFields from './SampleContactFields.svelte';

const blank = {
  roastery: '',
  name: '',
  email: '',
  phone: '',
  street: '',
  postalCode: '',
  city: '',
  country: '',
  message: ''
};

async function box(name: string) {
  return (await page.getByLabelText(name).element()).getBoundingClientRect();
}

function sameRow(left: DOMRect, right: DOMRect) {
  expect(right.left).toBeGreaterThan(left.right);
  expect(Math.abs(right.top - left.top)).toBeLessThan(2);
}

async function labelFits(name: string) {
  const input = await page.getByLabelText(name).element();
  const span = input.closest('label')?.querySelector('span');
  if (!span) throw new Error(`No label for ${name}`);
  const range = span.ownerDocument.createRange();
  range.selectNodeContents(span);
  const textWidth = range.getBoundingClientRect().width;
  expect(textWidth).toBeLessThanOrEqual(input.getBoundingClientRect().width + 1);
}

function stacked(above: DOMRect, below: DOMRect) {
  expect(below.top).toBeGreaterThanOrEqual(above.bottom - 1);
  expect(Math.abs(below.left - above.left)).toBeLessThan(2);
}

describe('SampleContactFields', () => {
  it('pairs short fields when the form is wide, and stacks them on a phone', async () => {
    await page.viewport(640, 900);
    render(SampleContactFields, { props: { ...blank } });

    const roastery = await box('Roastery *');
    const name = await box('Name *');
    const email = await box('Email *');
    const phone = await box('Phone');
    const street = await box('Street *');
    const postal = await box('Postal code *');
    const city = await box('City *');
    const country = await box('Country *');
    const message = await box('Message');

    sameRow(roastery, name);
    sameRow(email, phone);
    sameRow(postal, city);
    expect(Math.abs(city.left - name.left)).toBeLessThan(2);
    expect(Math.abs(city.width - name.width)).toBeLessThan(2);
    expect(Math.abs(message.height - name.height)).toBeLessThan(2);
    expect(Math.abs(message.width - street.width)).toBeLessThan(2);
    expect(street.top).toBeGreaterThan(email.bottom);
    expect(postal.top).toBeGreaterThan(street.bottom);
    expect(Math.abs(street.left - roastery.left)).toBeLessThan(2);
    expect(Math.abs(street.right - name.right)).toBeLessThan(2);
    expect(Math.abs(country.width - street.width)).toBeLessThan(2);

    await page.viewport(300, 800);
    sameRow(await box('Roastery *'), await box('Name *'));
    sameRow(await box('Email *'), await box('Phone'));
    sameRow(await box('Postal code *'), await box('City *'));
    await labelFits('Postal code *');
    expect((await box('City *')).right).toBeLessThanOrEqual(300 + 1);

    await page.viewport(260, 700);
    const narrow = {
      roastery: await box('Roastery *'),
      name: await box('Name *'),
      email: await box('Email *'),
      phone: await box('Phone'),
      postal: await box('Postal code *'),
      city: await box('City *')
    };

    stacked(narrow.roastery, narrow.name);
    stacked(narrow.email, narrow.phone);
    stacked(narrow.postal, narrow.city);
    expect(narrow.name.right).toBeLessThanOrEqual(260 + 1);
    expect(narrow.city.right).toBeLessThanOrEqual(260 + 1);
  });
});
