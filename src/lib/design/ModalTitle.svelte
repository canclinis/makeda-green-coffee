<script lang="ts">
	import type { Snippet } from 'svelte';
	import SectionTitle from './SectionTitle.svelte';

	let {
		id,
		children
	}: {
		id?: string;
		children: Snippet;
	} = $props();
</script>

<SectionTitle {id} style="font-size: 1.5rem; padding-inline: 3.25rem">
	{@render children()}
</SectionTitle>
