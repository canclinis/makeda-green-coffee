<script lang="ts">
	import About from './About.svelte';
	import Coffee from './Coffee.svelte';
	import Contact from './Contact.svelte';
	import Hero from './Hero.svelte';
	import Mission from './Mission.svelte';
	import Project from './Project.svelte';
	import SiteNav from './SiteNav.svelte';
	import './home.css';
</script>

<svelte:head>
	<title>Makeda Green Coffee</title>
</svelte:head>

<SiteNav />
<Hero />
<Project />
<Mission />
<Coffee />
<About />
<Contact />
