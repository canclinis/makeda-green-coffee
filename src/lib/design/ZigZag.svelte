<script lang="ts">
  import type { Snippet } from 'svelte';

  type Frame = {
    src: string;
    width?: number;
    height?: number;
    style?: string;
    sticky?: boolean;
  };

  type Media =
    | (Frame & { type: 'image'; alt: string })
    | (Frame & { type: 'video'; label: string; poster?: string });

  let {
    mediaSide,
    media,
    mediaSlot,
    children
  }: {
    mediaSide: 'left' | 'right';
    children: Snippet;
  } & ({ media: Media; mediaSlot?: undefined } | { media?: undefined; mediaSlot: Snippet }) =
    $props();
</script>

{#snippet frame()}
  {#if mediaSlot}
    {@render mediaSlot()}
  {:else if media?.type === 'image'}
    <img
      class="media"
      class:sticky={media.sticky}
      src={media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      style={media.style}
    />
  {:else if media?.type === 'video'}
    <video
      class="media"
      class:sticky={media.sticky}
      src={media.src}
      poster={media.poster}
      width={media.width}
      height={media.height}
      style={media.style}
      aria-label={media.label}
      controls
      playsinline
      preload="metadata"
    ></video>
  {/if}
{/snippet}

<div class="container">
  {#if mediaSide === 'left'}
    {@render frame()}
    <div style="max-width: 42rem">{@render children()}</div>
  {:else}
    <div style="max-width: 42rem">{@render children()}</div>
    {@render frame()}
  {/if}
</div>

<style>
  .container {
    display: grid;
    gap: 36px;
    align-items: start;
    padding: 36px 0 56px;
  }

  .media {
    display: block;
    width: 100%;
    height: auto;
  }

  @media (min-width: 960px) {
    .container {
      grid-template-columns: 1fr 1fr;
      gap: 48px;
    }

    .sticky {
      position: sticky;
      top: 88px;
    }
  }
</style>
