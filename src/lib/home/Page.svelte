<script lang="ts">
  import type { Snippet } from 'svelte';
  import SiteFooter from './SiteFooter.svelte';
  import SiteNav from './SiteNav.svelte';

  let {
    onEmail,
    children
  }: {
    onEmail?: () => void;
    children: Snippet;
  } = $props();
</script>

<SiteNav />
{@render children()}
<SiteFooter {onEmail} />
