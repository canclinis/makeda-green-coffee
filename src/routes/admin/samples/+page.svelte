<script lang="ts">
  import AdminShell from '#lib/admin/AdminShell.svelte';
  import SamplesEditor from '#lib/admin/SamplesEditor.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<AdminShell
  email={data.email}
  section="samples"
  title="Samples"
  headingId="samples-heading"
  documentTitle="Samples admin — Makeda Green Coffee"
>
  <SamplesEditor samples={data.samples} customers={data.customers} owners={data.owners} />
</AdminShell>
