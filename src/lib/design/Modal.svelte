<script lang="ts">
	import type { Snippet } from 'svelte';
	import SectionTitle from './SectionTitle.svelte';

	let {
		open = $bindable(false),
		title,
		labelledBy,
		children
	}: {
		open?: boolean;
		title: string;
		labelledBy?: string;
		children: Snippet;
	} = $props();

	const headingId = $props.id();

	let dialog = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		if (!dialog) return;
		if (open) {
			if (!dialog.open) dialog.showModal();
		} else if (dialog.open) {
			dialog.close();
		}
	});

	function onBackdrop(event: MouseEvent) {
		if (event.target === dialog) open = false;
	}

	function onDialogClose() {
		open = false;
	}
</script>

<dialog
	class="modal"
	bind:this={dialog}
	aria-labelledby={title ? headingId : labelledBy}
	onclick={onBackdrop}
	onclose={onDialogClose}
>
	<button class="modal-close" type="button" aria-label="Close" onclick={() => (open = false)}>
		×
	</button>
	<SectionTitle id={headingId}>{title}</SectionTitle>
	{@render children()}
</dialog>
