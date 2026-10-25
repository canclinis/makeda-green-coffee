<script lang="ts">
  import { untrack } from 'svelte';

  let {
    headingId,
    initialSubject = '',
    element = $bindable(null)
  }: {
    headingId: string;
    initialSubject?: string;
    element?: HTMLFormElement | null;
  } = $props();

  let name = $state('');
  let email = $state('');
  let subject = $state(untrack(() => initialSubject));
  let message = $state('');
  let status = $state('');
  let sending = $state(false);

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement) || !form.reportValidity() || sending) return;

    sending = true;
    status = 'Sending your message.';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, consent: true })
      });
      if (!response.ok) throw new Error('Contact form was not accepted');

      name = '';
      email = '';
      subject = initialSubject;
      message = '';
      const privacy = form.querySelector('input[name="privacy"]');
      if (privacy instanceof HTMLInputElement) privacy.checked = false;
      status = 'Your message has been sent.';
    } catch {
      status = 'We could not send your message. Please try again.';
    } finally {
      sending = false;
    }
  }
</script>

<form class="contact-form" bind:this={element} onsubmit={onSubmit}>
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
  <button class="button" type="submit" disabled={sending}>Get In Touch</button>
  {#if status}
    <p class="form-status" role="status">{status}</p>
  {/if}
</form>
