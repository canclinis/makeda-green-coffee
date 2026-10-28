<script lang="ts">
  import type { Snippet } from 'svelte';
  import SectionTitle from './SectionTitle.svelte';

  let {
    id,
    headingId,
    title,
    level = 2,
    band,
    prose = false,
    children
  }: {
    id?: string;
    headingId: string;
    title: string;
    level?: 1 | 2;
    band?: Snippet;
    prose?: boolean;
    children: Snippet;
  } = $props();
</script>

<section {id} aria-labelledby={headingId}>
  {#if band}
    {@render band()}
  {/if}
  <SectionTitle id={headingId} {level}>{title}</SectionTitle>
  <div class="container well" style="padding: 36px 0 56px">
    {#if prose}
      <div style="max-width: 42rem; margin-inline: auto">
        {@render children()}
      </div>
    {:else}
      {@render children()}
    {/if}
  </div>
</section>

<style>
  section {
    scroll-margin-top: 80px;
    background: #fff;
    border-inline: 25px solid var(--makeda-coffee);
  }

  @media (max-width: 639px) {
    section {
      border-inline-width: 12px;
    }

    .well {
      width: min(1200px, calc(100% - 24px));
    }
  }
</style>
