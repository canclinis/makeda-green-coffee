import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { parseSampleLog } from '#lib/home/sample-log.ts';
import '../design/design.css';
import SamplesEditor from './SamplesEditor.svelte';

const ada = {
  id: 'customer-1',
  name: 'Ada Lovelace',
  roastery: 'Resistance Roastery',
  email: 'ada@example.com',
  phone: '+41 79 000 00 00',
  street: '12 Roastery Lane',
  postalCode: '1200',
  city: 'Geneva',
  country: 'Switzerland'
};

const request = {
  id: 'sample-1',
  customerId: 'customer-1',
  status: 'ordered' as const,
  comment: '',
  owner: '',
  coffees: 'Fully Washed K3 Classic · 2026\nNatural K4 · 2025',
  amount: '1 kg of each — paid, send price',
  message: 'Our roaster needs at least 1 kg.',
  requestedAt: '2026-11-14T10:00:00.000Z'
};

type Call = { url: string; body: FormData | null };
let calls: Call[] = [];

function stubServer() {
  calls = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({
        url: String(input),
        body: init?.body instanceof FormData ? init.body : null
      });
      return new Response(
        JSON.stringify({ type: 'success', status: 200, data: '[{"saved":1},true]' })
      );
    })
  );
}

/** The sample list sent with the most recent save. */
function lastSavedSamples() {
  const saves = calls.filter((call) => call.url.includes('?/save'));
  const raw = saves[saves.length - 1]?.body?.get('samples');
  if (typeof raw !== 'string') return null;
  const result = parseSampleLog(JSON.parse(raw));
  return result.ok ? result.samples : null;
}

describe('SamplesEditor', () => {
  it('saves owner, status, and comment edits without a save button', async () => {
    stubServer();
    render(SamplesEditor, {
      props: { samples: [request], customers: [ada], owners: ['sofia@makedagreencoffee.com'] }
    });

    await expect.element(page.getByText('Ordered 1 · Sent 0 · Received 0')).toBeVisible();
    await expect.element(page.getByText('2026-11-14 10:00')).toBeVisible();
    await expect
      .element(page.getByRole('heading', { name: 'Ada Lovelace · Resistance Roastery' }))
      .toBeVisible();
    await expect.element(page.getByText('Fully Washed K3 Classic · 2026')).toBeVisible();
    await expect.element(page.getByText('Natural K4 · 2025')).toBeVisible();
    await expect.element(page.getByText('1 kg of each — paid, send price')).toBeVisible();
    await expect.element(page.getByText('Our roaster needs at least 1 kg.')).toBeVisible();
    await expect
      .element(page.getByRole('button', { name: 'Save samples' }))
      .not.toBeInTheDocument();

    await page.getByLabelText('Owner 1').selectOptions('sofia@makedagreencoffee.com');
    await page.getByLabelText('Status 1').selectOptions('Sent');
    await expect.element(page.getByText('Ordered 0 · Sent 1 · Received 0')).toBeVisible();
    await page.getByLabelText('Status 1').selectOptions('Received');
    await page.getByLabelText('Comment 1').fill('Left at the roastery');

    await expect.element(page.getByText('Ordered 0 · Sent 0 · Received 1')).toBeVisible();
    await expect
      .poll(() => lastSavedSamples())
      .toEqual([
        {
          ...request,
          status: 'received',
          owner: 'sofia@makedagreencoffee.com',
          comment: 'Left at the roastery'
        }
      ]);
  });

  it('saves a hand-added sample once it has a customer, coffees, and an amount', async () => {
    stubServer();
    render(SamplesEditor, { props: { samples: [], customers: [ada], owners: [] } });

    await page.getByRole('button', { name: 'Add sample' }).click();
    await page.getByLabelText('Customer 1').selectOptions('Ada Lovelace · Resistance Roastery');
    expect(calls).toEqual([]);

    await page.getByLabelText('Coffees 1').fill('Natural K4 · 2025');
    await page.getByLabelText('Amount 1').fill('250 g');
    await page.getByLabelText('Status 1').selectOptions('Sent');

    await expect.element(page.getByText('Ordered 0 · Sent 1 · Received 0')).toBeVisible();
    await expect
      .poll(() => lastSavedSamples()?.[0])
      .toMatchObject({
        customerId: 'customer-1',
        coffees: 'Natural K4 · 2025',
        amount: '250 g',
        status: 'sent'
      });
    expect(lastSavedSamples()?.[0]?.requestedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('links each request to its customer instead of repeating their contact details', async () => {
    render(SamplesEditor, { props: { samples: [request], customers: [ada], owners: [] } });

    await expect
      .element(page.getByRole('link', { name: 'Ada Lovelace · Resistance Roastery' }))
      .toHaveAttribute('href', '/admin/customers#customer-customer-1');
    await expect.element(page.getByText('ada@example.com')).not.toBeInTheDocument();
    await expect.element(page.getByText('12 Roastery Lane')).not.toBeInTheDocument();
  });

  it('removes a saved request on the server straight away, without saving the page', async () => {
    stubServer();
    render(SamplesEditor, {
      props: { samples: [request], customers: [ada], owners: [] }
    });

    await page.getByRole('button', { name: 'Remove sample 1' }).click();

    await expect.element(page.getByText('No sample requests yet.')).toBeVisible();
    expect(calls.map((call) => call.url)).toEqual([expect.stringContaining('?/remove')]);
    expect(calls[0]?.body?.get('id')).toBe('sample-1');
    vi.unstubAllGlobals();
  });

  it('waits for a save in flight before removing, so the removed request is not put back', async () => {
    const pending: { url: string; body: FormData | null; answer: (type: string) => void }[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (input: RequestInfo | URL, init?: RequestInit) =>
          new Promise<Response>((resolve) => {
            pending.push({
              url: String(input),
              body: init?.body instanceof FormData ? init.body : null,
              answer: (type) =>
                resolve(
                  new Response(JSON.stringify({ type, status: 200, data: '[{"saved":1},true]' }))
                )
            });
          })
      )
    );
    render(SamplesEditor, {
      props: { samples: [request], customers: [ada], owners: [] }
    });

    await page.getByLabelText('Comment 1').fill('Left at the roastery');
    await expect.poll(() => pending.length).toBe(1);
    expect(pending[0]?.url).toContain('?/save');

    await page.getByRole('button', { name: 'Remove sample 1' }).click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(pending).toHaveLength(1);

    pending[0]?.answer('success');
    await expect.poll(() => pending.length).toBe(2);
    expect(pending[1]?.url).toContain('?/remove');
    pending[1]?.answer('success');

    await expect.element(page.getByText('No sample requests yet.')).toBeVisible();
    await new Promise((resolve) => setTimeout(resolve, 700));
    expect(pending).toHaveLength(2);
    vi.unstubAllGlobals();
  });

  it('still saves the edits made while a save was failing', async () => {
    const saves: { body: FormData | null; answer: (type: string) => void }[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_input: RequestInfo | URL, init?: RequestInit) =>
          new Promise<Response>((resolve) => {
            saves.push({
              body: init?.body instanceof FormData ? init.body : null,
              answer: (type) =>
                resolve(
                  new Response(JSON.stringify({ type, status: 200, data: '[{"saved":1},true]' }))
                )
            });
          })
      )
    );
    render(SamplesEditor, {
      props: { samples: [request], customers: [ada], owners: [] }
    });

    await page.getByLabelText('Comment 1').fill('First');
    await expect.poll(() => saves.length).toBe(1);
    await page.getByLabelText('Comment 1').fill('Second');
    await new Promise((resolve) => setTimeout(resolve, 700));
    expect(saves).toHaveLength(1);

    saves[0]?.answer('error');
    await expect.poll(() => saves.length).toBe(2);
    const raw = saves[1]?.body?.get('samples');
    expect(JSON.parse(String(raw))[0].comment).toBe('Second');
    vi.unstubAllGlobals();
  });

  it('keeps a request and shows an error when the server cannot remove it', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ type: 'error', status: 500, error: { message: 'Boom' } }))
      )
    );
    render(SamplesEditor, {
      props: { samples: [request], customers: [ada], owners: [] }
    });

    await page.getByRole('button', { name: 'Remove sample 1' }).click();

    await expect
      .element(page.getByRole('alert'))
      .toHaveTextContent('The sample could not be removed. Please try again.');
    await expect.element(page.getByText('Fully Washed K3 Classic · 2026')).toBeVisible();
    vi.unstubAllGlobals();
  });
});
