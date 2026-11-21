<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    id,
    headingId,
    title,
    open = $bindable(false),
    aside,
    children
  }: {
    id?: string;
    headingId: string;
    title: string;
    open?: boolean;
    aside?: Snippet;
    children: Snippet;
  } = $props();
</script>

<section {id} aria-labelledby={headingId}>
  <details bind:open>
    <summary>
      <h2 id={headingId}>{title}</h2>
      {#if aside}
        <span class="aside">{@render aside()}</span>
      {/if}
    </summary>
    <div class="body">
      {@render children()}
    </div>
  </details>
</section>

<style>
  section {
    margin: 0 0 12px;
    padding: 0 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.04);
    scroll-margin-top: 80px;
  }

  section:has(details[open]) {
    border-color: rgba(0, 0, 0, 0.2);
  }

  summary {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 56px;
    cursor: pointer;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::marker {
    content: '';
  }

  summary::after {
    content: '';
    flex: none;
    width: 0.45rem;
    height: 0.45rem;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: translateY(-2px) rotate(45deg);
  }

  details[open] summary::after {
    transform: translateY(2px) rotate(-135deg);
  }

  h2 {
    flex: 1;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.3;
  }

  .aside {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .body {
    padding: 4px 0 20px;
  }
</style>
