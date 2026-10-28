<script lang="ts">
  import Coffee from './Coffee.svelte';
  import Hero from './Hero.svelte';
  import Project from './Project.svelte';
  import Page from './Page.svelte';
</script>

<svelte:head>
  <title>Green coffee beans from Congo — Makeda Green Coffee</title>
  <meta
    name="description"
    content="Green coffee beans from Kivu cooperatives in eastern DR Congo, for roasters in Europe. A fair-trade project with the farmers, from the field to delivery."
  />
</svelte:head>

<Page>
  <Hero />
  <Project />
  <Coffee />
</Page>
