<script lang="ts">
	import { buildContactMailto } from './contact-mailto';

	let { headingId }: { headingId: string } = $props();

	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let status = $state('');

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;

		window.location.href = buildContactMailto({ name, email, subject, message });
		status = 'Opening your email app to send this message.';
	}
</script>

<form class="contact-form" onsubmit={onSubmit}>
	<h2 id={headingId}>Get In Touch</h2>
	<label class="field">
		<span>Name *</span>
		<input name="name" type="text" required bind:value={name} autocomplete="name" />
	</label>
	<label class="field">
		<span>Email *</span>
		<input name="email" type="email" required bind:value={email} autocomplete="email" />
	</label>
	<label class="field">
		<span>Subject *</span>
		<input name="subject" type="text" required bind:value={subject} />
	</label>
	<label class="field">
		<span>Message *</span>
		<textarea name="message" rows="7" required bind:value={message}></textarea>
	</label>
	<label class="consent">
		<input type="checkbox" name="privacy" required />
		<span>
			I have read and accept the privacy policy and agree to the processing of my personal data in
			accordance with GDPR regulations.
		</span>
	</label>
	<button class="button" type="submit">Get In Touch</button>
	{#if status}
		<p class="form-status">{status}</p>
	{/if}
</form>
