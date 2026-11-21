<script lang="ts">
  import OurCoffeePage from '#lib/home/OurCoffeePage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<OurCoffeePage stock={data.stock} />
