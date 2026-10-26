<script lang="ts">
  import type { Snippet } from 'svelte';
  import SiteFooter from './SiteFooter.svelte';
  import SiteNav from './SiteNav.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<SiteNav />
{@render children()}
<SiteFooter />
