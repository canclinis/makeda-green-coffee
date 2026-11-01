<script lang="ts">
  import type { Snippet } from 'svelte';
  import Image from './Image.svelte';

  type ImageMedia = {
    type: 'image';
    src: string;
    width: number;
    height: number;
    alt: string;
    priority?: boolean;
    loading?: 'eager' | 'lazy';
    style?: string;
    sticky?: boolean;
  };

  type VideoMedia = {
    type: 'video';
    src: string;
    label: string;
    poster?: string;
    width?: number;
    height?: number;
    style?: string;
    sticky?: boolean;
  };

  type Media = ImageMedia | VideoMedia;

  let {
    mediaSide,
    media,
    mediaSlot,
    sticky = false,
    children
  }: {
    mediaSide: 'left' | 'right';
    sticky?: boolean;
    children: Snippet;
  } & (
    { media: Media; mediaSlot?: undefined } | { media?: undefined; mediaSlot: Snippet }
  ) = $props();
</script>

{#snippet frame()}
  {#if mediaSlot}
    <div class="media" class:sticky>
      {@render mediaSlot()}
    </div>
  {:else if media?.type === 'image'}
    <div class="media" class:sticky={media.sticky} style={media.style}>
      <Image
        src={media.src}
        width={media.width}
        height={media.height}
        alt={media.alt}
        priority={media.priority}
        loading={media.loading}
      />
    </div>
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

<div class="columns">
  {#if mediaSide === 'left'}
    {@render frame()}
    <div style="max-width: 42rem">{@render children()}</div>
  {:else}
    <div style="max-width: 42rem">{@render children()}</div>
    {@render frame()}
  {/if}
</div>

<style>
  .columns {
    display: grid;
    gap: 36px;
    align-items: start;
  }

  .columns > * {
    min-width: 0;
  }

  .media {
    display: block;
    width: 100%;
    height: auto;
  }

  .media :global(img) {
    display: block;
    width: 100%;
    height: auto;
  }

  @media (min-width: 760px) {
    .columns {
      grid-template-columns: 1fr 1fr;
      gap: 48px;
    }

    .sticky {
      position: sticky;
      top: 88px;
    }
  }
</style>
