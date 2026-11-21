<script lang="ts">
  import AdminShell from '#lib/admin/AdminShell.svelte';
  import CustomersEditor from '#lib/admin/CustomersEditor.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<AdminShell
  email={data.email}
  section="customers"
  title="Customers"
  headingId="customers-heading"
  documentTitle="Customers — Makeda Green Coffee"
>
  <CustomersEditor customers={data.customers} />
</AdminShell>
