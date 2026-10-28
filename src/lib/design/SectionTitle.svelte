<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    id,
    class: className = '',
    style,
    level = 2,
    children
  }: {
    id?: string;
    class?: string;
    style?: string;
    level?: 1 | 2;
    children: Snippet;
  } = $props();
</script>

<svelte:element this={level === 1 ? 'h1' : 'h2'} class={className || undefined} {id} {style}>
  {@render children()}
</svelte:element>

<style>
  h1,
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
