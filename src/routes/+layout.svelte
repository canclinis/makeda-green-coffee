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
  <link
    rel="preload"
    href="/fonts/darwin-pro-regular.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
</svelte:head>

{@render children()}
