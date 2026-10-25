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
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<SiteNav />
<Hero />
<Project />
<Mission />
<Coffee />
<About />
<Contact />
