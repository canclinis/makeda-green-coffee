<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    id,
    children
  }: {
    id?: string;
    children: Snippet;
  } = $props();
</script>

<h2 class="section-title" {id}>{@render children()}</h2>
