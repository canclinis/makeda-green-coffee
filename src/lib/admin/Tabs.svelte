<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    tabs,
    selected = $bindable(),
    label,
    children
  }: {
    tabs: { id: string; label: string }[];
    selected: string;
    label: string;
    children: Snippet;
  } = $props();

  function move(event: KeyboardEvent, index: number) {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = tabs[(index + step + tabs.length) % tabs.length];
    selected = next.id;
    document.getElementById(`tab-${next.id}`)?.focus();
  }
</script>

<div class="tabs" role="tablist" aria-label={label}>
  {#each tabs as tab, index (tab.id)}
    <button
      type="button"
      role="tab"
      id="tab-{tab.id}"
      aria-selected={selected === tab.id}
      aria-controls="panel-{selected}"
      tabindex={selected === tab.id ? 0 : -1}
      onclick={() => (selected = tab.id)}
      onkeydown={(event) => move(event, index)}
    >
      {tab.label}
    </button>
  {/each}
</div>
<div role="tabpanel" id="panel-{selected}" aria-labelledby="tab-{selected}">
  {@render children()}
</div>

<style>
  .tabs {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  button {
    min-height: 44px;
    padding: 0 4px;
    border: 0;
    border-bottom: 3px solid transparent;
    background: transparent;
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
  }

  button:hover,
  button[aria-selected='true'] {
    color: var(--makeda-coffee);
  }

  button[aria-selected='true'] {
    border-bottom-color: var(--makeda-coffee);
  }
</style>
