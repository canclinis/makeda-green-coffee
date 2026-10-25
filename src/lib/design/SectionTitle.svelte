<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    id,
    class: className = '',
    style,
    children
  }: {
    id?: string;
    class?: string;
    style?: string;
    children: Snippet;
  } = $props();
</script>

<h2 class={className || undefined} {id} {style}>
  {@render children()}
</h2>

<style>
  h2 {
    margin: 0;
    padding: 0.7em 24px;
    background: var(--makeda-black);
    color: #fff;
    font-size: clamp(1.35rem, 2.4vw + 1rem, 3rem);
    font-weight: 800;
    letter-spacing: 0.14em;
    line-height: 1;
    text-align: center;
    text-transform: uppercase;
  }
</style>
