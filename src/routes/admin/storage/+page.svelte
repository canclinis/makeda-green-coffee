<script lang="ts">
  import AdminShell from '#lib/admin/AdminShell.svelte';
  import StorageEditor from '#lib/admin/StorageEditor.svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
</script>

<AdminShell
  email={data.email}
  section="storage"
  title="Storage"
  headingId="storage-heading"
  documentTitle="Storage — Makeda Green Coffee"
>
  <StorageEditor lots={data.lots} book={data.book} {form} />
</AdminShell>
