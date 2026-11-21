import { page } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../design/design.css';
import StorageEditor from './StorageEditor.svelte';

const lots: {
  id: string;
  origin: string;
  crop: string;
  arrived: number;
  sold: Record<string, number>;
}[] = [
  { id: 'washed', origin: 'Fully Washed K3', crop: '2026', arrived: 40, sold: { ballario: 10 } },
  { id: 'natural', origin: 'Natural K3', crop: '2026', arrived: 14, sold: {} }
];

const washed = () => page.getByRole('row', { name: /Fully Washed K3/ });
const natural = () => page.getByRole('row', { name: /Natural K3/ });
const total = () => page.getByRole('row', { name: /Total/ });

/** Left reads as "left of started with"; Ballario and Loscuro show only the bags left. */
async function expectCells(row: ReturnType<typeof washed>, cells: string[]) {
  for (const [index, text] of cells.entries()) {
    await expect
      .element(row.getByRole('cell').nth(index))
      .toHaveTextContent(new RegExp(`^${text}$`));
  }
}

async function edit(coffee: string, bags: string) {
  await page.getByRole('button', { name: `Edit ${coffee}` }).click();
  await page.getByLabelText(`Loscuro, ${coffee}`).fill(bags);
}

describe('StorageEditor', () => {
  // Never answers: SvelteKit's form handling needs a running app to apply a response.
  const fetch = vi.fn(() => new Promise<Response>(() => {}));

  beforeEach(() => {
    fetch.mockClear();
    vi.stubGlobal('fetch', fetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the bags left in each storage, all in Ballario at first', async () => {
    render(StorageEditor, { props: { lots, book: {} } });

    await expectCells(washed(), ['30 of 40', '30', '0']);
    await expectCells(natural(), ['14 of 14', '14', '0']);
  });

  it('shows no field for Loscuro until Edit is pressed, so a swipe cannot change it', async () => {
    render(StorageEditor, { props: { lots, book: {} } });

    await expect.element(page.getByLabelText('Loscuro, Fully Washed K3')).not.toBeInTheDocument();

    await page.getByRole('button', { name: 'Edit Fully Washed K3' }).click();

    await expect.element(page.getByLabelText('Loscuro, Fully Washed K3')).toHaveValue('0');
    await expect.element(page.getByLabelText('Loscuro, Natural K3')).not.toBeInTheDocument();
  });

  it('has no button that saves every coffee at once', async () => {
    render(StorageEditor, { props: { lots, book: {} } });

    await expect.element(page.getByRole('button', { name: /save/i })).not.toBeInTheDocument();
  });

  it('puts the typed bags back when the edit is cancelled', async () => {
    render(StorageEditor, { props: { lots, book: { washed: { loscuro: 12 } } } });

    await edit('Fully Washed K3', '20');
    await page.getByRole('button', { name: 'Cancel Fully Washed K3' }).click();

    await expect.element(page.getByLabelText('Loscuro, Fully Washed K3')).not.toBeInTheDocument();
    await expectCells(washed(), ['30 of 40', '18', '12']);
  });

  it('edits one coffee at a time', async () => {
    render(StorageEditor, { props: { lots, book: {} } });

    await page.getByRole('button', { name: 'Edit Fully Washed K3' }).click();

    await expect.element(page.getByRole('button', { name: 'Edit Natural K3' })).toBeDisabled();
  });

  it('saves the bags a storage started with when the admin is done with a coffee', async () => {
    render(StorageEditor, { props: { lots, book: {} } });

    await edit('Fully Washed K3', '12');
    await page.getByRole('button', { name: 'Done Fully Washed K3' }).click();

    await expect.poll(() => fetch.mock.calls.length).toBe(1);
    const [, init] = fetch.mock.calls[0] as unknown as [string, { body: FormData }];
    expect(JSON.parse(String(init.body.get('storage'))).washed).toEqual({ loscuro: '12' });
  });

  it('does not let a count that cannot be covered be done', async () => {
    render(StorageEditor, { props: { lots, book: {} } });

    await edit('Natural K3', '20');

    await expect.element(page.getByRole('button', { name: 'Done Natural K3' })).toBeDisabled();
  });

  it('shows the bags saved for Loscuro and Ballario holding the rest', async () => {
    render(StorageEditor, { props: { lots, book: { washed: { loscuro: 12 } } } });

    await expectCells(washed(), ['30 of 40', '18', '12']);
  });

  it('takes the bags ordered from Loscuro out of Loscuro, not Ballario', async () => {
    render(StorageEditor, {
      props: {
        lots: [{ ...lots[0], sold: { ballario: 10, loscuro: 4 } }, lots[1]],
        book: { washed: { loscuro: 12 } }
      }
    });

    await expectCells(washed(), ['26 of 40', '18', '8']);
  });

  it('moves the typed bags out of Ballario of that coffee only', async () => {
    render(StorageEditor, { props: { lots, book: {} } });

    await edit('Fully Washed K3', '20');

    await expectCells(washed(), ['30 of 40', '10']);
    await expectCells(natural(), ['14 of 14', '14', '0']);
  });

  it('adds up every coffee in a total row', async () => {
    render(StorageEditor, { props: { lots, book: { washed: { loscuro: 12 } } } });

    await expectCells(total(), ['44 of 54', '32', '12']);
  });

  it('warns when Loscuro has more bags of a coffee than arrived', async () => {
    render(StorageEditor, { props: { lots, book: {} } });

    await edit('Natural K3', '20');

    await expect
      .element(page.getByText('Natural K3: only 14 bags arrived. Remove 6 bags to save.'))
      .toBeVisible();
  });

  it('saves even when Loscuro would hold fewer bags than are ordered from it', async () => {
    render(StorageEditor, {
      props: { lots: [{ ...lots[0], sold: { ballario: 10, loscuro: 4 } }, lots[1]], book: {} }
    });

    await edit('Fully Washed K3', '3');

    await expect.element(page.getByRole('button', { name: 'Done Fully Washed K3' })).toBeEnabled();
    await page.getByRole('button', { name: 'Done Fully Washed K3' }).click();
    await expect.poll(() => fetch.mock.calls.length).toBe(1);
  });

  it('shows the problem inside the coffee row that has it', async () => {
    render(StorageEditor, { props: { lots, book: { natural: { loscuro: 20 } } } });

    await expect
      .element(natural().getByText('Natural K3: only 14 bags arrived. Remove 6 bags to save.'))
      .toBeVisible();
  });

  it('says which coffee to fix when a valid coffee cannot be saved', async () => {
    render(StorageEditor, { props: { lots, book: { natural: { loscuro: 20 } } } });

    await edit('Fully Washed K3', '12');
    await page.getByRole('button', { name: 'Done Fully Washed K3' }).click();

    await expect.element(page.getByRole('alert')).toHaveTextContent('Fix Natural K3 first.');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('shows a coffee that arrives after the page loaded, without breaking', async () => {
    const screen = render(StorageEditor, { props: { lots: [lots[0]], book: {} } });

    await screen.rerender({ lots, book: {} });

    await expectCells(natural(), ['14 of 14', '14', '0']);
    await edit('Natural K3', '5');
    await expectCells(natural(), ['14 of 14', '9']);
    await expect.element(page.getByLabelText('Loscuro, Natural K3')).toHaveValue('5');
  });

  it('shows the message when saving fails', async () => {
    render(StorageEditor, {
      props: { lots, book: {}, form: { message: 'Fully Washed K3: enter the bags in Loscuro.' } }
    });

    await expect
      .element(page.getByRole('alert'))
      .toHaveTextContent('Fully Washed K3: enter the bags in Loscuro.');
  });
});
