<script lang="ts">
	import ContactForm from './ContactForm.svelte';

	let dialog = $state<HTMLDialogElement | null>(null);

	function openContact() {
		dialog?.showModal();
	}

	function onBackdrop(event: MouseEvent) {
		if (event.target === dialog) dialog?.close();
	}
</script>

<section id="top" class="hero" aria-label="Makeda Green Coffee">
	<div class="hero-video">
		<video
			src="/video/hero.mp4"
			poster="/images/hero-poster.jpg"
			autoplay
			muted
			loop
			playsinline
			aria-label="Hero film"
		></video>
	</div>
</section>

<section class="order-bar">
	<div class="container container-large order-bar-inner">
		<p class="order-line">Bring home a unique coffee, a symbol of strength and courage.</p>
		<button class="button" type="button" onclick={openContact}>Order now</button>
		<dialog
			class="contact-modal"
			bind:this={dialog}
			aria-labelledby="contact-modal-heading"
			onclick={onBackdrop}
		>
			<button class="modal-close" type="button" aria-label="Close" onclick={() => dialog?.close()}>
				×
			</button>
			<ContactForm headingId="contact-modal-heading" />
		</dialog>
	</div>
</section>
