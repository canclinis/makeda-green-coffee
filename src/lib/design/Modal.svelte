<script lang="ts">
  import type { Snippet } from 'svelte';
  import IconButton from './IconButton.svelte';
  import SectionTitle from './SectionTitle.svelte';

  let {
    open = $bindable(false),
    title,
    image,
    children
  }: {
    open?: boolean;
    title: string;
    image?: { src: string; alt: string; objectPosition?: string };
    children: Snippet;
  } = $props();

  const headingId = $props.id();

  let dialog = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  });

  function onBackdrop(event: MouseEvent) {
    if (event.target === dialog) open = false;
  }

  function onDialogClose() {
    open = false;
  }
</script>

<dialog bind:this={dialog} aria-labelledby={headingId} onclick={onBackdrop} onclose={onDialogClose}>
  {#if image}
    <img src={image.src} alt={image.alt} style:object-position={image.objectPosition} />
  {/if}
  <div style="position: absolute; top: 10px; right: 10px; z-index: 1">
    <IconButton
      tone={image ? 'light' : 'ink'}
      aria-label="Close"
      style="font-size: 28px; line-height: 1"
      onclick={() => (open = false)}
    >
      ×
    </IconButton>
  </div>
  <SectionTitle id={headingId} style="font-size: 1.5rem; padding-inline: 3.25rem">
    {title}
  </SectionTitle>
  <div style="padding: 1.75rem 2rem 2rem">
    {@render children()}
  </div>
</dialog>

<style>
  dialog {
    position: fixed;
    inset: 0;
    width: min(760px, calc(100vw - 32px));
    height: fit-content;
    max-height: calc(100vh - 48px);
    margin: auto;
    padding: 0;
    overflow: auto;
    border: 0;
    border-inline: 10px solid var(--makeda-coffee);
    background: #fff;
    color: var(--makeda-ink);
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.22);
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.55);
  }

  img {
    display: block;
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
</style>
