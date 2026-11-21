<script lang="ts">
  import { untrack } from 'svelte';
  import type { CustomerRecord } from '#lib/home/customer-log.ts';
  import AdminCard from './AdminCard.svelte';

  let {
    customer = $bindable(),
    index,
    isNew,
    onremove
  }: {
    customer: CustomerRecord;
    index: number;
    isNew: boolean;
    onremove: () => void;
  } = $props();

  const row = $derived(index + 1);
  let open = $state(untrack(() => isNew));

  $effect(() => {
    if (location.hash !== `#customer-${untrack(() => customer.id)}`) return;
    open = true;
    document.getElementById(`customer-${untrack(() => customer.id)}`)?.scrollIntoView();
  });
</script>

<AdminCard
  id="customer-{customer.id}"
  headingId="title-{customer.id}"
  title={customer.roastery || customer.name || 'New customer'}
  bind:open
>
  <div class="fields">
    <div class="column">
      <label>
        Name
        <input bind:value={customer.name} aria-label="Name {row}" autocomplete="off" />
      </label>
      <label>
        Roastery
        <input bind:value={customer.roastery} aria-label="Roastery {row}" autocomplete="off" />
      </label>
      <label>
        Email
        <input
          bind:value={customer.email}
          type="email"
          aria-label="Email {row}"
          autocomplete="off"
        />
      </label>
      <label>
        Phone
        <input bind:value={customer.phone} type="tel" aria-label="Phone {row}" autocomplete="off" />
      </label>
    </div>
    <div class="column">
      <label>
        Street
        <input bind:value={customer.street} aria-label="Street {row}" autocomplete="off" />
      </label>
      <label>
        Postal code
        <input bind:value={customer.postalCode} aria-label="Postal code {row}" autocomplete="off" />
      </label>
      <label>
        City
        <input bind:value={customer.city} aria-label="City {row}" autocomplete="off" />
      </label>
      <label>
        Country
        <input bind:value={customer.country} aria-label="Country {row}" autocomplete="off" />
      </label>
    </div>
  </div>
  <p class="footer">
    <button type="button" class="remove" aria-label="Remove customer {row}" onclick={onremove}>
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

  label {
    display: grid;
    grid-template-columns: 6.5rem 1fr;
    gap: 8px;
    align-items: center;
    font-size: 15px;
  }

  input {
    width: 100%;
    min-height: 44px;
    padding: 8px 10px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    background: #fff;
    font: inherit;
    font-size: 16px;
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
