<script lang="ts">
  import type { Snippet } from 'svelte';
  import PageSection from '#lib/design/PageSection.svelte';
  import Page from '#lib/home/Page.svelte';

  let {
    email,
    section,
    title,
    headingId,
    documentTitle,
    children
  }: {
    email: string;
    section: 'stock' | 'storage' | 'samples' | 'customers';
    title: string;
    headingId: string;
    documentTitle: string;
    children: Snippet;
  } = $props();
</script>

<svelte:head>
  <title>{documentTitle}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Page menu="admin" {section} {email}>
  <PageSection {headingId} level={1} {title}>
    <div class="content">
      {@render children()}
    </div>
  </PageSection>
</Page>

<style>
  .content {
    padding-inline: 16px;
  }

  @media (min-width: 640px) {
    .content {
      padding-inline: 24px;
    }
  }
</style>
