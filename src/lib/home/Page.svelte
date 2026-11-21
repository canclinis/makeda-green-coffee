<script lang="ts">
  import type { Snippet } from 'svelte';
  import SiteFooter from './SiteFooter.svelte';
  import SiteNav from './SiteNav.svelte';

  let {
    children,
    menu = 'site',
    section,
    email
  }: {
    children: Snippet;
    menu?: 'site' | 'admin';
    section?: 'stock' | 'storage' | 'samples' | 'customers';
    email?: string;
  } = $props();
</script>

<SiteNav {menu} {section} {email} />
{@render children()}
<SiteFooter />
