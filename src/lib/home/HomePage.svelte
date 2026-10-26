<script lang="ts">
  import Coffee from './Coffee.svelte';
  import Hero from './Hero.svelte';
  import Project from './Project.svelte';
  import Page from './Page.svelte';
</script>

<svelte:head>
  <title>Makeda Green Coffee</title>
  <meta
    name="description"
    content="Green coffee from Kivu cooperatives for roasters. A fair-trade project with farmers in eastern DR Congo, a region that has faced years of conflict."
  />
</svelte:head>

<Page>
  <Hero />
  <Project />
  <Coffee />
</Page>
