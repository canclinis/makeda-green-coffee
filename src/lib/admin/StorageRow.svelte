<script lang="ts">
  import { CENTRAL_STORAGE, COUNTED_STORAGES } from '#lib/home/storage-book.ts';
  import StorageBags from './StorageBags.svelte';

  type Lot = {
    origin: string;
    crop: string;
    arrived: number;
    /** Bags already ordered from each storage. */
    sold: Record<string, number>;
  };

  let {
    lot,
    held,
    problem,
    counts = $bindable(),
    editing,
    canEdit,
    onedit,
    oncancel
  }: {
    lot: Lot;
    /** The bags each storage started with, or null while a typed count is not valid. */
    held: Record<string, number> | null;
    problem?: string;
    /** What was typed for each counted storage. */
    counts: Record<string, string>;
    editing: boolean;
    /** Only one coffee is edited at a time. */
    canEdit: boolean;
    onedit: () => void;
    oncancel: () => void;
  } = $props();

  const soldIn = (storage: string) => lot.sold[storage] ?? 0;
  const soldAll = $derived(Object.values(lot.sold).reduce((all, bags) => all + bags, 0));
  const leftIn = (storage: string) => (held ? held[storage] - soldIn(storage) : null);
</script>

<tr>
  <th scope="row">
    {lot.origin} · {lot.crop}
    {#if problem}<span class="problem">{problem}</span>{/if}
  </th>
  <td data-label="Left"><StorageBags left={lot.arrived - soldAll} started={lot.arrived} /></td>
  <td data-label={CENTRAL_STORAGE.label}>
    <StorageBags left={leftIn(CENTRAL_STORAGE.value)} />
  </td>
  {#each COUNTED_STORAGES as storage (storage.value)}
    <td data-label={storage.label}>
      {#if editing}
        <input
          bind:value={counts[storage.value]}
          inputmode="numeric"
          aria-label="{storage.label}, {lot.origin}"
          aria-invalid={Boolean(problem)}
          autocomplete="off"
          required
        />
        <span class="hint">bags at the start</span>
      {:else}
        <StorageBags left={leftIn(storage.value)} />
      {/if}
    </td>
  {/each}
  <td>
    <div class="buttons">
      {#if editing}
        <button
          type="submit"
          aria-label="Done {lot.origin}"
          disabled={held === null || Boolean(problem)}
        >
          Done
        </button>
        <button type="button" aria-label="Cancel {lot.origin}" onclick={oncancel}>Cancel</button>
      {:else}
        <button type="button" aria-label="Edit {lot.origin}" disabled={!canEdit} onclick={onedit}>
          Edit
        </button>
      {/if}
    </div>
  </td>
</tr>

<style>
  th,
  td {
    padding: 12px 16px;
    border-block: 1px solid rgba(0, 0, 0, 0.12);
    background: #fff;
    vertical-align: middle;
    text-align: left;
  }

  th {
    font-weight: 700;
  }

  th:first-child {
    border-left: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 8px 0 0 8px;
  }

  td:last-child {
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 0 8px 8px 0;
  }

  input {
    width: 7rem;
    min-height: 44px;
    padding: 8px 10px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    background: #fff;
    font: inherit;
    font-size: 16px;
  }

  input[aria-invalid='true'] {
    border-color: var(--makeda-coffee);
    box-shadow: 0 0 0 1px var(--makeda-coffee);
  }

  .hint {
    display: block;
    margin-top: 4px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
  }

  .problem {
    display: block;
    margin-top: 4px;
    color: var(--makeda-coffee);
    font-size: 13px;
    font-weight: 700;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
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

  button:hover:enabled {
    border-color: var(--makeda-coffee);
    color: var(--makeda-coffee);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

    th,
    td,
    th:first-child,
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
  }
</style>
