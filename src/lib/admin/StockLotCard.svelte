<script lang="ts">
  import type { CustomerRecord } from '#lib/home/customer-log.ts';
  import AdminCard from './AdminCard.svelte';
  import { overdrawnMessage, type StorageCounts } from '#lib/home/storage-book.ts';
  import { bagsLeftIn, overdrawnIn, type DraftLot as Lot } from './draft-stock.ts';
  import FormMessage from './FormMessage.svelte';
  import OrderRow from './OrderRow.svelte';

  let {
    lot = $bindable(),
    customers,
    storage,
    blockedBy,
    onadd,
    onremove,
    ondone
  }: {
    lot: Lot;
    customers: CustomerRecord[];
    /** Bags each counted storage started with for this coffee. */
    storage: StorageCounts;
    /** Origin of a lot that has too many bags ordered. Nothing is saved until it is fixed. */
    blockedBy?: string;
    onadd: () => void;
    onremove: (id: string) => void;
    ondone: () => void;
  } = $props();

  const left = $derived(bagsLeftIn(lot));
  const short = $derived(left !== null && left < 0);
  const stockLine = $derived(left === null ? '—' : `${left} of ${lot.arrived.trim()}`);
  const message = $derived.by(() => {
    if (left !== null && left < 0) {
      const received = Number(lot.arrived.trim());
      return `Only ${received} bags received, but ${received - left} are ordered. Remove ${-left} ${-left === 1 ? 'bag' : 'bags'} to save.`;
    }
    const overdrawn = overdrawnIn(lot, storage);
    if (overdrawn) return overdrawnMessage(lot.origin, overdrawn);
    return blockedBy ? `Fix ${blockedBy} first.` : undefined;
  });
</script>

<AdminCard headingId="stock-{lot.id}" title="{lot.origin} · {lot.crop}">
  {#snippet aside()}<span class:short>{stockLine}</span>{/snippet}
  <label class="received">
    Received
    <input
      bind:value={lot.arrived}
      inputmode="numeric"
      aria-label="Received bags, {lot.origin}"
      autocomplete="off"
      aria-invalid={short}
      required
    />
  </label>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th scope="col">Customer</th>
          <th scope="col">Bags</th>
          <th scope="col">Shipping</th>
          <th scope="col">Invoice</th>
          <th scope="col">Storage</th>
          <th scope="col">Comment</th>
          <th scope="col"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {#each lot.sales as sale, index (sale.id)}
          <OrderRow
            bind:order={lot.sales[index]}
            {customers}
            {index}
            origin={lot.origin}
            onremove={() => onremove(sale.id)}
            {ondone}
          />
        {/each}
      </tbody>
    </table>
  </div>
  <FormMessage form={message ? { message } : null} />
  <div class="actions">
    <button type="button" class="add" aria-label="Add order for {lot.origin}" onclick={onadd}>
      Add order
    </button>
  </div>
</AdminCard>

<style>
  .received {
    display: grid;
    grid-template-columns: 6.5rem 8rem;
    gap: 8px;
    align-items: center;
    margin-bottom: 20px;
    font-size: 15px;
  }

  .received input[aria-invalid='true'] {
    border-color: var(--makeda-coffee);
    box-shadow: 0 0 0 1px var(--makeda-coffee);
  }

  .short {
    color: var(--makeda-coffee);
    font-weight: 700;
  }

  .received input {
    min-height: 44px;
    padding: 8px 10px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    background: #fff;
    font: inherit;
    font-size: 16px;
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
  }

  th {
    padding: 0 16px 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-align: left;
    text-transform: uppercase;
  }

  .actions {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }

  .add {
    min-height: 44px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--makeda-coffee);
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-decoration: underline;
    text-transform: uppercase;
    cursor: pointer;
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
    tbody {
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
  }
</style>
