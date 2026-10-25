<script lang="ts">
  import Coffee from './Coffee.svelte';
  import Hero from './Hero.svelte';
  import Project from './Project.svelte';
  import SitePage from './SitePage.svelte';
</script>

<svelte:head>
  <title>Makeda Green Coffee</title>
</svelte:head>

<SitePage>
  <Hero />
  <Project />
  <Coffee />
</SitePage>
