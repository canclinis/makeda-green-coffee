<script lang="ts">
  import { untrack } from 'svelte';
  import { resolve } from '$app/paths';
  import type { CustomerRecord } from '#lib/home/customer-log.ts';
  import type { SampleRecord } from '#lib/home/sample-log.ts';
  import AdminCard from './AdminCard.svelte';

  let {
    sample = $bindable(),
    customer,
    customers,
    index,
    isNew,
    owners,
    onremove
  }: {
    sample: SampleRecord;
    customer: CustomerRecord | undefined;
    customers: CustomerRecord[];
    index: number;
    isNew: boolean;
    owners: string[];
    onremove: () => void;
  } = $props();

  const row = $derived(index + 1);
  // Requests still on their way stay open; finished ones fold away.
  let open = $state(untrack(() => isNew || sample.status !== 'received'));

  const STATUS_LABELS = { ordered: 'Ordered', sent: 'Sent', received: 'Received' } as const;

  const choices = $derived(
    sample.owner !== '' && !owners.includes(sample.owner) ? [sample.owner, ...owners] : owners
  );

  function requestedOn(value: string): string {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) return '';
    return `${value.slice(0, 10)} ${value.slice(11, 16)}`;
  }

  function customerLabel(entry: CustomerRecord): string {
    return entry.roastery ? `${entry.name} · ${entry.roastery}` : entry.name;
  }

  const title = $derived(
    customer ? customerLabel(customer) : isNew ? 'New sample' : 'Unknown customer'
  );
  const summary = $derived(
    [STATUS_LABELS[sample.status], requestedOn(sample.requestedAt).slice(0, 10)]
      .filter(Boolean)
      .join(' · ')
  );
</script>

<AdminCard headingId="sample-{sample.id}" {title} bind:open>
  {#snippet aside()}{summary}{/snippet}
  <div class="fields">
    <div class="column">
      {#if isNew}
        <label>
          Customer
          <select bind:value={sample.customerId} aria-label="Customer {row}">
            <option value="">Choose a customer</option>
            {#each customers as entry (entry.id)}
              <option value={entry.id}>{customerLabel(entry)}</option>
            {/each}
          </select>
        </label>
        <label class="top">
          Coffees
          <textarea bind:value={sample.coffees} rows="2" aria-label="Coffees {row}"></textarea>
        </label>
        <label>
          Amount
          <input bind:value={sample.amount} aria-label="Amount {row}" autocomplete="off" />
        </label>
      {:else}
        <dl class="request">
          {#if requestedOn(sample.requestedAt)}
            <div>
              <dt>Requested</dt>
              <dd>{requestedOn(sample.requestedAt)}</dd>
            </div>
          {/if}
          <div>
            <dt>Customer</dt>
            <dd>
              {#if customer}
                <a href="{resolve('/admin/customers')}#customer-{customer.id}"
                  >{customerLabel(customer)}</a
                >
              {:else}
                Unknown customer
              {/if}
            </dd>
          </div>
          {#if sample.coffees}
            <div>
              <dt>Coffees</dt>
              <dd class="coffees">{sample.coffees}</dd>
            </div>
          {/if}
          {#if sample.amount}
            <div>
              <dt>Amount</dt>
              <dd>{sample.amount}</dd>
            </div>
          {/if}
          {#if sample.message}
            <div>
              <dt>Message</dt>
              <dd>{sample.message}</dd>
            </div>
          {/if}
        </dl>
      {/if}
    </div>
    <div class="column">
      <label>
        Owner
        <select bind:value={sample.owner} aria-label="Owner {row}" autocomplete="off">
          <option value="">Unassigned</option>
          {#each choices as owner (owner)}
            <option value={owner}>{owner}</option>
          {/each}
        </select>
      </label>
      <label>
        Status
        <select bind:value={sample.status} aria-label="Status {row}">
          <option value="ordered">Ordered</option>
          <option value="sent">Sent</option>
          <option value="received">Received</option>
        </select>
      </label>
      <label class="top">
        Comment
        <textarea bind:value={sample.comment} rows="3" aria-label="Comment {row}"></textarea>
      </label>
    </div>
  </div>
  <p class="footer">
    <button type="button" class="remove" aria-label="Remove sample {row}" onclick={onremove}>
      Remove
    </button>
  </p>
</AdminCard>

<style>
  .fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
    gap: 12px 40px;
  }

  .column {
    display: grid;
    gap: 12px;
    align-content: start;
  }

  label,
  .request > div {
    display: grid;
    grid-template-columns: 6.5rem 1fr;
    gap: 8px;
    align-items: center;
    font-size: 15px;
  }

  label.top {
    align-items: start;
  }

  .request {
    display: grid;
    gap: 12px;
    margin: 0;
    font-size: 15px;
  }

  .request > div {
    align-items: start;
  }

  dt {
    margin: 0;
    color: rgba(0, 0, 0, 0.62);
  }

  dd {
    margin: 0;
    overflow-wrap: anywhere;
  }

  .coffees {
    white-space: pre-line;
  }

  a {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
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

  textarea {
    resize: vertical;
  }

  .footer {
    margin: 20px 0 0;
    padding-top: 8px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    text-align: right;
  }

  .remove {
    min-height: 44px;
    padding: 0 4px;
    border: 0;
    background: transparent;
    font: inherit;
    font-size: 16px;
    text-decoration: underline;
    cursor: pointer;
  }

  .remove:hover {
    color: var(--makeda-coffee);
  }
</style>
