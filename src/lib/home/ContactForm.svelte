<script lang="ts">
  import { resolve } from '$app/paths';
  import { untrack } from 'svelte';
  import Button from '../design/Button.svelte';

  let {
    headingId,
    initialSubject = '',
    hideHeading = false,
    dark = false,
    submitLabel = 'Get In Touch',
    element = $bindable(null)
  }: {
    headingId: string;
    initialSubject?: string;
    hideHeading?: boolean;
    dark?: boolean;
    submitLabel?: string;
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

<form class:dark bind:this={element} onsubmit={onSubmit}>
  {#if !hideHeading}
    <h2 id={headingId}>Get In Touch</h2>
  {/if}
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
  <label
    style="display: flex; gap: 10px; align-items: flex-start; margin: 8px 0 24px; font-size: 14px; line-height: 1.5"
  >
    <input type="checkbox" name="privacy" required />
    <span>
      I have read the <a href={resolve('/privacy')} target="_blank" rel="noreferrer"
        >privacy policy</a
      >
      and agree that you can use this message to reply to me.
    </span>
  </label>
  <Button type="submit" variant={dark ? 'default' : 'burgundy'} disabled={sending}>
    {submitLabel}
  </Button>
  {#if status}
    <p style="margin-top: 16px" role="status">{status}</p>
  {/if}
</form>

<style>
  form {
    scroll-margin-top: 8.5rem;
  }

  h2 {
    margin: 0 0 1.5rem;
    color: var(--makeda-coffee);
    font-size: clamp(1.25rem, 2.5vw, 1.75rem);
    font-weight: 700;
    letter-spacing: 0.18em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .dark h2 {
    color: #fff;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 20px;
  }

  .field span {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .field input,
  .field textarea {
    width: 100%;
    border: 0;
    border-bottom: 1px solid rgba(17, 17, 17, 0.28);
    border-radius: 0;
    background: transparent;
    color: var(--makeda-ink);
    font: inherit;
  }

  .dark .field input,
  .dark .field textarea {
    border-bottom-color: rgba(255, 255, 255, 0.28);
    color: #fff;
  }

  .field input {
    height: 40px;
  }

  .field textarea {
    min-height: 160px;
    padding-top: 8px;
    resize: vertical;
  }

  .field input:focus,
  .field textarea:focus {
    outline: none;
    border-bottom-color: var(--makeda-coffee);
  }

  .dark .field input:focus,
  .dark .field textarea:focus {
    border-bottom-color: #fff;
  }

  input[type='checkbox'] {
    margin-top: 4px;
    accent-color: var(--makeda-coffee);
  }

  label a {
    color: var(--makeda-coffee);
    font-weight: 600;
  }

  .dark label a {
    color: #fff;
  }

  .dark input[type='checkbox'] {
    accent-color: #fff;
  }
</style>
