<script lang="ts">
  import { page } from '$app/state';
  import { canonicalUrl } from '../lib/canonical-url';
  import '../lib/design/design.css';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();

  const canonical = $derived(canonicalUrl(page.url.pathname));
</script>

<svelte:head>
  <link rel="canonical" href={canonical} />
  <link rel="icon" href="/favicon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{@render children()}
