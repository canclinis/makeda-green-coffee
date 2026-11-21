<script lang="ts">
  import { untrack } from 'svelte';
  import { enhance, type SubmitFunction } from '$app/forms';
  import Text from '#lib/design/Text.svelte';
  import {
    CENTRAL_STORAGE,
    COUNTED_STORAGES,
    bagsHeld,
    centralBags,
    type StorageBook,
    type StorageCounts
  } from '#lib/home/storage-book.ts';
  import FormMessage from './FormMessage.svelte';
  import StorageBags from './StorageBags.svelte';
  import StorageRow from './StorageRow.svelte';

  type Lot = {
    id: string;
    origin: string;
    crop: string;
    arrived: number;
    /** Bags already ordered from each storage. */
    sold: Record<string, number>;
  };

  let {
    lots,
    book,
    form = null
  }: {
    lots: Lot[];
    book: StorageBook;
    form?: { saved?: boolean; message?: string } | null;
  } = $props();

  /** What the book says each counted storage started with, as the text the admin can edit. */
  function savedCounts(lot: Lot): Record<string, string> {
    return Object.fromEntries(
      COUNTED_STORAGES.map((storage) => [storage.value, String(book[lot.id]?.[storage.value] ?? 0)])
    );
  }

  let draft = $state(
    untrack(() => Object.fromEntries(lots.map((lot) => [lot.id, savedCounts(lot)])))
  );

  // A coffee that arrives after the page loaded starts from what the book says, and edits stay.
  $effect.pre(() => {
    for (const lot of lots) {
      if (!draft[lot.id]) draft[lot.id] = untrack(() => savedCounts(lot));
    }
  });

  /** The typed counts of a coffee as numbers, or null while one is missing or not a whole number. */
  function counted(lot: Lot): StorageCounts | null {
    const typed = draft[lot.id];
    if (!typed) return null;
    const entries = COUNTED_STORAGES.map((s) => [s.value, typed[s.value].trim()]);
    if (entries.some(([, bags]) => !/^\d{1,6}$/.test(bags))) return null;
    return Object.fromEntries(entries.map(([id, bags]) => [id, Number(bags)]));
  }

  /** Why the counts of a coffee cannot be saved, if they cannot. */
  function problem(lot: Lot, counts: StorageCounts): string | undefined {
    const over = -centralBags(lot.arrived, counts);
    if (over > 0) {
      return `${lot.origin}: only ${lot.arrived} ${lot.arrived === 1 ? 'bag' : 'bags'} arrived. Remove ${over} ${over === 1 ? 'bag' : 'bags'} to save.`;
    }
    return undefined;
  }

  /** The id of the coffee being edited. The others show text only, so a swipe cannot change them. */
  let editing = $state<string | null>(null);

  const rows = $derived(
    lots.map((lot) => {
      const counts = counted(lot);
      return {
        lot,
        held: counts ? bagsHeld(lot.arrived, counts) : null,
        problem: counts ? problem(lot, counts) : undefined
      };
    })
  );

  const total = $derived.by(() => {
    const sold = (storage: string) => lots.reduce((all, lot) => all + (lot.sold[storage] ?? 0), 0);
    const startedIn = (storage: string) =>
      rows.every((row) => row.held)
        ? rows.reduce((all, row) => all + (row.held?.[storage] ?? 0), 0)
        : null;
    const leftIn = (storage: string) => {
      const started = startedIn(storage);
      return started === null ? null : started - sold(storage);
    };
    const arrived = lots.reduce((all, lot) => all + lot.arrived, 0);
    const soldAll = [CENTRAL_STORAGE, ...COUNTED_STORAGES].reduce(
      (all, storage) => all + sold(storage.value),
      0
    );
    return { arrived, left: arrived - soldAll, leftIn };
  });

  const blocking = $derived(rows.find((row) => row.problem));
  const message = $derived(blocking?.problem);
  const shownMessage = $derived(blocking ? { message: `Fix ${blocking.lot.origin} first.` } : form);
  const storageJson = $derived(
    JSON.stringify(Object.fromEntries(lots.map((lot) => [lot.id, draft[lot.id]])))
  );

  let saving = $state(false);

  const save: SubmitFunction = ({ formData, cancel }) => {
    if (message || saving) return cancel();
    saving = true;
    formData.set('storage', storageJson);
    return async ({ result, update }) => {
      try {
        // The form is the live editor, so a reset would blank the fields the admin keeps working in.
        await update({ reset: false });
        if (result.type === 'success') editing = null;
      } finally {
        saving = false;
      }
    };
  };
</script>

<Text style="margin-bottom: 24px">
  Tell us how many bags {COUNTED_STORAGES.map((s) => s.label).join(' and ')} started with for each coffee.
  {CENTRAL_STORAGE.label} holds the rest. Each storage shows the bags left.
</Text>

<form method="POST" action="?/save" use:enhance={save} autocomplete="off">
  <input type="hidden" name="storage" value={storageJson} />
  <FormMessage form={shownMessage} />
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th scope="col">Coffee</th>
          <th scope="col">Left</th>
          <th scope="col">{CENTRAL_STORAGE.label}</th>
          {#each COUNTED_STORAGES as storage (storage.value)}
            <th scope="col">{storage.label}</th>
          {/each}
          <th scope="col"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {#each rows as { lot, held, problem } (lot.id)}
          {#if draft[lot.id]}
            <StorageRow
              {lot}
              {held}
              {problem}
              bind:counts={draft[lot.id]}
              editing={editing === lot.id}
              canEdit={editing === null}
              onedit={() => (editing = lot.id)}
              oncancel={() => {
                draft[lot.id] = savedCounts(lot);
                editing = null;
              }}
            />
          {/if}
        {/each}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">Total</th>
          <td data-label="Left"><StorageBags left={total.left} started={total.arrived} /></td>
          <td data-label={CENTRAL_STORAGE.label}>
            <StorageBags left={total.leftIn(CENTRAL_STORAGE.value)} />
          </td>
          {#each COUNTED_STORAGES as storage (storage.value)}
            <td data-label={storage.label}>
              <StorageBags left={total.leftIn(storage.value)} />
            </td>
          {/each}
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
</form>

<style>
  .table-wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
    font-size: 16px;
    font-variant-numeric: tabular-nums;
  }

  th {
    padding: 0 16px 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-align: left;
    text-transform: uppercase;
  }

  tfoot th,
  tfoot td {
    padding: 12px 16px;
    font-size: 16px;
    letter-spacing: 0;
    text-transform: none;
  }

  tfoot td {
    font-weight: 700;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  @media (max-width: 800px) {
    table,
    tbody,
    tfoot,
    tfoot tr,
    tfoot th,
    tfoot td {
      display: block;
    }

    table {
      border-spacing: 0;
    }

    thead {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }

    tfoot td[data-label]::before {
      content: attr(data-label);
      display: block;
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
  }
</style>
