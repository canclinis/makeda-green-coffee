<script lang="ts">
  import Coffee from './Coffee.svelte';
  import Hero from './Hero.svelte';
  import Project from './Project.svelte';
  import Page from './Page.svelte';
</script>

<svelte:head>
  <title>Makeda Green Coffee</title>
</svelte:head>

<Page>
  <Hero />
  <Project />
  <Coffee />
</Page>
