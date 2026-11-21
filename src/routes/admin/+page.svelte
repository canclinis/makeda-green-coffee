<script lang="ts">
  import AdminShell from '#lib/admin/AdminShell.svelte';
  import StockEditor from '#lib/admin/StockEditor.svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
</script>

<AdminShell
  email={data.email}
  section="stock"
  title="Orders"
  headingId="admin-heading"
  documentTitle="Orders — Makeda Green Coffee"
>
  <StockEditor customers={data.customers} lots={data.lots} storageBook={data.storageBook} {form} />
</AdminShell>
