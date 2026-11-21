<script lang="ts">
  import { untrack } from 'svelte';
  import { enhance, type SubmitFunction } from '$app/forms';
  import Text from '#lib/design/Text.svelte';
  import type { CustomerRecord } from '#lib/home/customer-log.ts';
  import { soldOut, type StockEditorLot } from '#lib/home/stock-book.ts';
  import { CENTRAL_STORAGE, type StorageBook } from '#lib/home/storage-book.ts';
  import { blankSale, overbooked, type DraftLot } from './draft-stock.ts';
  import StockLotCard from './StockLotCard.svelte';
  import Tabs from './Tabs.svelte';

  let {
    lots,
    customers,
    storageBook = {},
    form = null
  }: {
    lots: StockEditorLot[];
    customers: CustomerRecord[];
    /** The bags each counted storage started with, so no storage can be ordered past what it holds. */
    storageBook?: StorageBook;
    form?: { saved?: boolean; message?: string } | null;
  } = $props();

  let draft = $state(untrack(() => toDraft(lots)));

  function toDraft(rows: StockEditorLot[]): DraftLot[] {
    return rows.map((lot) => ({
      id: lot.id,
      origin: lot.origin,
      crop: lot.crop,
      arrived: String(lot.arrived),
      sales: lot.sales.map((sale) => ({
        id: sale.id,
        customerId: sale.customerId,
        bags: String(sale.bags),
        comment: sale.comment,
        shipping: sale.shipping,
        invoice: sale.invoice,
        storage: sale.storage
      }))
    }));
  }

  function addSale(lot: DraftLot) {
    lot.sales.push({
      id: crypto.randomUUID(),
      customerId: '',
      bags: '',
      comment: '',
      shipping: 'to-ship',
      invoice: 'to-issue',
      storage: CENTRAL_STORAGE.value
    });
  }

  function removeSale(lot: DraftLot, id: string) {
    lot.sales = lot.sales.filter((sale) => sale.id !== id);
  }

  const bookJson = $derived(
    JSON.stringify(
      Object.fromEntries(
        draft.map((lot) => [
          lot.id,
          {
            arrived: lot.arrived,
            sales: lot.sales.map((sale) => ({
              id: sale.id,
              customerId: sale.customerId,
              bags: sale.bags,
              comment: sale.comment,
              shipping: sale.shipping,
              invoice: sale.invoice,
              storage: sale.storage
            }))
          }
        ])
      )
    )
  );

  const overbookedLot = $derived(draft.find((lot) => overbooked(lot, storageBook[lot.id] ?? {})));

  // Sorted by the saved book, not the draft, so a coffee does not vanish while it is being edited.
  const soldOutIds = $derived(new Set(lots.filter(soldOut).map((lot) => lot.id)));
  const tabs = $derived([
    { id: 'in-stock', label: 'In stock' },
    { id: 'sold-out', label: 'Sold out' }
  ]);
  let tab = $state('in-stock');
  const shown = $derived(draft.filter((lot) => soldOutIds.has(lot.id) === (tab === 'sold-out')));
  const hiddenOverbooked = $derived(
    overbookedLot && !shown.includes(overbookedLot) ? overbookedLot : undefined
  );

  let formElement: HTMLFormElement | undefined = $state();

  const save: SubmitFunction = ({ formData, cancel }) => {
    if (overbookedLot) return cancel();
    formData.set('book', bookJson);
    return async ({ result, update }) => {
      if (result.type === 'success') {
        for (const lot of draft) {
          lot.sales = lot.sales.filter((sale) => !blankSale(sale));
        }
      }
      // The form is the live editor, so a reset would blank the fields the admin keeps working in.
      await update({ reset: false });
    };
  };
</script>

<form bind:this={formElement} method="POST" action="?/save" use:enhance={save} autocomplete="off">
  <input type="hidden" name="book" value={bookJson} />
  {#if form?.saved}
    <Text>Saved. The coffee page now shows what’s left.</Text>
  {/if}
  {#if form?.message}
    <p role="alert">{form.message}</p>
  {/if}
  {#if hiddenOverbooked}
    <p role="alert">Fix {hiddenOverbooked.origin} first. It is on the other tab.</p>
  {/if}
  <Tabs {tabs} bind:selected={tab} label="Coffees">
    {#if shown.length === 0}
      <Text>{tab === 'sold-out' ? 'No coffee has sold out yet.' : 'No coffee in stock.'}</Text>
    {/if}
    {#each shown as lot (lot.id)}
      {@const index = draft.indexOf(lot)}
      <StockLotCard
        bind:lot={draft[index]}
        {customers}
        storage={storageBook[lot.id] ?? {}}
        blockedBy={overbookedLot?.origin}
        onadd={() => addSale(draft[index])}
        onremove={(id) => removeSale(draft[index], id)}
        ondone={() => formElement?.requestSubmit()}
      />
    {/each}
  </Tabs>
</form>
