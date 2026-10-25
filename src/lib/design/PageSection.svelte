<script lang="ts">
  import type { Snippet } from 'svelte';
  import SectionTitle from './SectionTitle.svelte';

  let {
    id,
    headingId,
    title,
    band,
    prose = false,
    children
  }: {
    id?: string;
    headingId: string;
    title: string;
    band?: Snippet;
    prose?: boolean;
    children: Snippet;
  } = $props();
</script>

<section
  {id}
  aria-labelledby={headingId}
  style="scroll-margin-top: 80px; background: #fff; border-inline: 25px solid var(--makeda-coffee)"
>
  {#if band}
    {@render band()}
  {/if}
  <SectionTitle id={headingId}>{title}</SectionTitle>
  <div class="container" style="padding: 36px 0 56px">
    {#if prose}
      <div style="max-width: 42rem; margin-inline: auto">
        {@render children()}
      </div>
    {:else}
      {@render children()}
    {/if}
  </div>
</section>
