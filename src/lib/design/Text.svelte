<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    class: className = '',
    style,
    children
  }: {
    class?: string;
    style?: string;
    children: Snippet;
  } = $props();
</script>

<p class={className || undefined} {style}>{@render children()}</p>

<style>
  p {
    font-size: 17px;
    line-height: 1.7;
  }
</style>
