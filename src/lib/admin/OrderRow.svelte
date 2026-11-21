<script lang="ts">
  import { untrack } from 'svelte';
  import { resolve } from '$app/paths';
  import type { CustomerRecord } from '#lib/home/customer-log.ts';
  import {
    INVOICE_STATUSES,
    SHIPPING_STATUSES,
    type InvoiceStatus,
    type ShippingStatus
  } from '#lib/home/stock-book.ts';
  import { STORAGES } from '#lib/home/storage-book.ts';

  type Order = {
    customerId: string;
    bags: string;
    comment: string;
    shipping: ShippingStatus;
    invoice: InvoiceStatus;
    storage: string;
  };

  let {
    order = $bindable(),
    customers,
    index,
    origin,
    onremove,
    ondone
  }: {
    order: Order;
    customers: CustomerRecord[];
    index: number;
    origin: string;
    onremove: () => void;
    /** Called after the admin finishes editing the order, so the book can be saved. */
    ondone: () => void;
  } = $props();

  const row = $derived(index + 1);
  const customer = $derived(customers.find((entry) => entry.id === order.customerId));
  let editing = $state(untrack(() => order.customerId === ''));

  function done() {
    editing = false;
    ondone();
  }

  function customerLabel(entry: CustomerRecord): string {
    return entry.roastery ? `${entry.name} · ${entry.roastery}` : entry.name;
  }
</script>

<tr>
  <td data-label="Customer">
    {#if customer}
      <a href="{resolve('/admin/customers')}#customer-{customer.id}">{customerLabel(customer)}</a>
    {:else if order.customerId === ''}
      <select bind:value={order.customerId} aria-label="Customer {row}, {origin}">
        <option value="">Choose a customer</option>
        {#each customers as entry (entry.id)}
          <option value={entry.id}>{customerLabel(entry)}</option>
        {/each}
      </select>
    {:else}
      Unknown customer
    {/if}
  </td>
  <td data-label="Bags" class="bags">
    {#if editing}
      <input
        bind:value={order.bags}
        inputmode="numeric"
        aria-label="Bags {row}, {origin}"
        autocomplete="off"
      />
    {:else}
      {order.bags}
    {/if}
  </td>
  <td data-label="Shipping">
    {#if editing}
      <select bind:value={order.shipping} aria-label="Shipping {row}, {origin}">
        {#each SHIPPING_STATUSES as entry (entry.value)}
          <option value={entry.value}>{entry.label}</option>
        {/each}
      </select>
    {:else}
      {SHIPPING_STATUSES.find((entry) => entry.value === order.shipping)?.label}
    {/if}
  </td>
  <td data-label="Invoice">
    {#if editing}
      <select bind:value={order.invoice} aria-label="Invoice {row}, {origin}">
        {#each INVOICE_STATUSES as entry (entry.value)}
          <option value={entry.value}>{entry.label}</option>
        {/each}
      </select>
    {:else}
      {INVOICE_STATUSES.find((entry) => entry.value === order.invoice)?.label}
    {/if}
  </td>
  <td data-label="Storage">
    {#if editing}
      <select bind:value={order.storage} aria-label="Storage {row}, {origin}">
        {#each STORAGES as entry (entry.value)}
          <option value={entry.value}>{entry.label}</option>
        {/each}
      </select>
    {:else}
      <a href={resolve('/admin/storage')}>
        {STORAGES.find((entry) => entry.value === order.storage)?.label}
      </a>
    {/if}
  </td>
  <td data-label="Comment">
    {#if editing}
      <textarea bind:value={order.comment} aria-label="Comment {row}, {origin}" rows="3"></textarea>
    {:else}
      {order.comment}
    {/if}
  </td>
  <td>
    <div style="display: flex; justify-content: flex-end; gap: 8px">
      {#if editing}
        <button type="button" aria-label="Done editing order {row}, {origin}" onclick={done}>
          Done
        </button>
      {:else}
        <button
          type="button"
          aria-label="Edit order {row}, {origin}"
          onclick={() => (editing = true)}
        >
          Edit
        </button>
      {/if}
      <button type="button" aria-label="Remove order {row}, {origin}" onclick={onremove}>
        Remove
      </button>
    </div>
  </td>
</tr>

<style>
  td {
    padding: 12px 16px;
    border-block: 1px solid rgba(0, 0, 0, 0.12);
    background: #fff;
    vertical-align: middle;
    text-align: left;
  }

  td:first-child {
    border-left: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 8px 0 0 8px;
  }

  td:last-child {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 0 8px 8px 0;
  }

  .bags {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
  }

  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }

  select {
    appearance: none;
    padding-right: 36px;
    border-radius: 8px;
    background:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%23000' stroke-width='1.5'%3E%3Cpath d='m1 1 5 5 5-5'/%3E%3C/svg%3E")
        no-repeat right 12px center / 12px 8px,
      #fff;
    cursor: pointer;
  }

  select:hover,
  select:focus-visible {
    border-color: var(--makeda-coffee);
  }

  select,
  input,
  textarea {
    width: 100%;
    min-height: 44px;
    padding: 8px 10px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    background: #fff;
    font: inherit;
    font-size: 16px;
  }

  select {
    min-width: 9rem;
  }

  td:first-child select {
    min-width: 14rem;
  }

  textarea {
    min-width: 12rem;
    resize: vertical;
  }

  button {
    min-height: 44px;
    padding: 0 16px;
    border: 1px solid rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    background: transparent;
    font: inherit;
    font-size: 15px;
    cursor: pointer;
  }

  button:hover {
    border-color: var(--makeda-coffee);
    color: var(--makeda-coffee);
  }

  @media (max-width: 800px) {
    tr {
      display: block;
      margin-bottom: 8px;
      padding: 16px 16px 4px;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 8px;
      background: #fff;
    }

    td,
    td:first-child,
    td:last-child {
      display: block;
      padding: 0 0 12px;
      border: 0;
      border-radius: 0;
    }

    td[data-label]::before {
      content: attr(data-label);
      display: block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    select,
    textarea {
      min-width: 0;
    }
  }
</style>
