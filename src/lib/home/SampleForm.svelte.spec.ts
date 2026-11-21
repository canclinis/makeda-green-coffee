import { page } from 'vitest/browser';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../design/design.css';
import SampleForm from './SampleForm.svelte';

async function fillContact() {
  await page.getByLabelText('Roastery *').fill('Resistance Roastery');
  await page.getByLabelText('Name *').fill('Ada Lovelace');
  await page.getByLabelText('Email *').fill('ada@example.com');
  await page.getByLabelText('Phone').fill('+41 79 000 00 00');
  await page.getByLabelText('Street *').fill('12 Roastery Lane');
  await page.getByLabelText('Postal code *').fill('1200');
  await page.getByLabelText('City *').fill('Geneva');
  await page.getByLabelText('Country *').selectOptions('Switzerland');
}

describe('SampleForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts by asking which coffees, and keeps the error with that question', async () => {
    render(SampleForm);

    await expect.element(page.getByText('Step 1 of 4')).toBeVisible();
    await expect
      .element(page.getByRole('heading', { name: 'Which coffees would you like to try?' }))
      .toBeVisible();
    await expect
      .element(page.getByRole('checkbox', { name: 'Natural K3 Classic', exact: true }))
      .toBeVisible();
    await expect.element(page.getByLabelText('Name *')).not.toBeInTheDocument();
  });

  it('keeps Next disabled until the current step can continue', async () => {
    render(SampleForm);

    const next = page.getByRole('button', { name: 'Next' });
    await expect.element(next).toBeDisabled();

    await page.getByRole('checkbox', { name: 'Natural K3 Classic', exact: true }).click();
    await expect.element(next).toBeEnabled();

    await page.getByRole('checkbox', { name: 'Natural K3 Classic', exact: true }).click();
    await expect.element(next).toBeDisabled();
  });

  it('lists coffees without repeating the stock status', async () => {
    render(SampleForm);

    await expect
      .element(page.getByRole('checkbox', { name: 'Fully Washed K3 Classic', exact: true }))
      .toBeVisible();
    expect(await page.getByText('In stock').query()).toBeNull();
  });

  it('shows each coffee with its photo, name and year', async () => {
    render(SampleForm);

    const card = (
      await page.getByRole('checkbox', { name: 'Natural K3 Classic', exact: true }).element()
    ).closest('label');
    expect(card?.querySelector('img')).not.toBeNull();
    expect(card?.textContent).toContain('2026');
  });

  it('puts Back directly to the left of Next', async () => {
    render(SampleForm);

    await page.getByRole('checkbox', { name: 'Fully Washed K3 Classic', exact: true }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect.element(page.getByText('Step 2 of 4')).toBeVisible();

    const back = (
      await page.getByRole('button', { name: 'Back' }).element()
    ).getBoundingClientRect();
    const next = (
      await page.getByRole('button', { name: 'Next' }).element()
    ).getBoundingClientRect();
    expect(back.right).toBeLessThanOrEqual(next.left);
    expect(next.left - back.right).toBeLessThan(24);
  });

  it('moves to the amount, explains the roaster minimum, and focuses the question', async () => {
    render(SampleForm);

    await page.getByRole('checkbox', { name: 'Fully Washed K3 Classic', exact: true }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    const question = page.getByRole('heading', { name: 'How much does your roaster need?' });
    await expect.element(page.getByText('Step 2 of 4')).toBeVisible();
    await expect.element(question).toBeVisible();
    expect(document.activeElement).toBe(await question.element());
    await expect
      .element(page.getByText('Choose the smallest amount your roaster can roast.'))
      .toBeVisible();
    await expect.element(page.getByRole('radio', { name: '50 g', exact: true })).not.toBeChecked();
    await expect.element(page.getByRole('radio', { name: '500 g', exact: true })).toBeVisible();

    const freeRow = (
      await page.getByRole('radio', { name: '150 g', exact: true }).element()
    ).getBoundingClientRect();
    const paidRow = (
      await page.getByRole('radio', { name: '300 g', exact: true }).element()
    ).getBoundingClientRect();
    expect(paidRow.top).toBeGreaterThan(freeRow.bottom);

    await expect.element(page.getByRole('button', { name: 'Next' })).toBeDisabled();

    await page.getByRole('button', { name: 'Back' }).click();
    await expect
      .element(page.getByRole('checkbox', { name: 'Fully Washed K3 Classic', exact: true }))
      .toBeChecked();
  });

  it('shows what will be posted, then thanks the roaster and closes', async () => {
    const requests: Array<{ url: string; body: string }> = [];
    let closed = false;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        requests.push({ url: String(input), body: String(init?.body ?? '') });
        return Response.json({ ok: true });
      })
    );

    render(SampleForm, { props: { onclose: () => (closed = true) } });

    await page.getByRole('checkbox', { name: 'Fully Washed K3 Classic', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Natural K3 Classic', exact: true }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('radio', { name: '50 g', exact: true }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    await expect.element(page.getByText('Step 3 of 4')).toBeVisible();
    await expect
      .element(page.getByRole('heading', { name: 'Where should we send them?' }))
      .toBeVisible();
    expect(await page.getByText(/50 g each/).query()).toBeNull();

    await expect.element(page.getByRole('button', { name: 'Next' })).toBeDisabled();

    await fillContact();
    await expect.element(page.getByRole('button', { name: 'Next' })).toBeDisabled();
    await page.getByLabelText('Message').fill('Our roaster needs 50 g.');
    await page.getByRole('checkbox', { name: /privacy policy/ }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    await expect.element(page.getByText('Step 4 of 4')).toBeVisible();
    await expect
      .element(page.getByRole('heading', { name: 'Does this look right?' }))
      .toBeVisible();
    const coffees = page.getByRole('listitem');
    await expect
      .element(coffees.filter({ hasText: 'Fully Washed K3 Classic · 2026' }))
      .toBeVisible();
    await expect.element(coffees.filter({ hasText: 'Natural K3 Classic · 2026' })).toBeVisible();
    await expect.element(page.getByText('50 g of each — free')).toBeVisible();
    await expect.element(page.getByText('1200 Geneva')).toBeVisible();
    await expect.element(page.getByText('Our roaster needs 50 g.')).toBeVisible();

    await page.getByRole('button', { name: 'Change coffees' }).click();
    await expect
      .element(page.getByRole('checkbox', { name: 'Natural K3 Classic', exact: true }))
      .toBeChecked();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('checkbox', { name: /privacy policy/ }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Get samples' }).click();

    await expect
      .element(page.getByText('Thank you, Ada, for your request. Your order has been registered.'))
      .toBeVisible();

    const request = requests.find((entry) => entry.url.endsWith('/api/sample'));
    expect(JSON.parse(request?.body ?? '{}')).toMatchObject({
      samples: ['washed-k3-2026', 'natural-k3-2026'],
      grams: 50,
      roastery: 'Resistance Roastery',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '+41 79 000 00 00',
      street: '12 Roastery Lane',
      postalCode: '1200',
      city: 'Geneva',
      country: 'Switzerland',
      message: 'Our roaster needs 50 g.'
    });

    await page.getByRole('button', { name: 'Close' }).click();
    expect(closed).toBe(true);
  });

  async function reachPreview() {
    await page.getByRole('checkbox', { name: 'Fully Washed K3 Classic', exact: true }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('radio', { name: '50 g', exact: true }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await fillContact();
    await page.getByRole('checkbox', { name: /privacy policy/ }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect
      .element(page.getByRole('heading', { name: 'Does this look right?' }))
      .toBeVisible();
  }

  it('replaces the preview with a loading view while sending, then shows the thanks', async () => {
    let finish: (response: Response) => void = () => {};
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>((resolve) => (finish = resolve)))
    );
    render(SampleForm);
    await reachPreview();

    await page.getByRole('button', { name: 'Get samples' }).click();

    await expect.element(page.getByRole('status')).toHaveTextContent('Sending your request');
    expect(await page.getByRole('heading', { name: 'Does this look right?' }).query()).toBeNull();
    expect(await page.getByText('Fully Washed K3 Classic · 2026').query()).toBeNull();
    expect(await page.getByRole('button', { name: 'Get samples' }).query()).toBeNull();

    finish(Response.json({ ok: true }));

    await expect
      .element(page.getByText('Thank you, Ada, for your request. Your order has been registered.'))
      .toBeVisible();
    expect(await page.getByText('Sending your request').query()).toBeNull();
  });

  it('goes back to the preview with an error when sending fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ ok: false }, { status: 500 }))
    );
    render(SampleForm);
    await reachPreview();

    await page.getByRole('button', { name: 'Get samples' }).click();

    await expect
      .element(page.getByText('We could not send your request. Please try again.'))
      .toBeVisible();
    await expect
      .element(page.getByRole('heading', { name: 'Does this look right?' }))
      .toBeVisible();
    await expect.element(page.getByRole('button', { name: 'Get samples' })).toBeEnabled();
  });
});
