<script lang="ts">
  let {
    left,
    started
  }: {
    left: number | null;
    /** The bags the storage started with, before any order. Leave out to show only the bags left. */
    started?: number | null;
  } = $props();
</script>

{#if left === null || started === null}
  —
{:else if started === undefined}
  <strong>{left}</strong>
{:else}
  <strong>{left}</strong> <span>of {started}</span>
{/if}

<style>
  strong {
    font-size: 18px;
  }

  span {
    color: rgba(0, 0, 0, 0.6);
  }
</style>
