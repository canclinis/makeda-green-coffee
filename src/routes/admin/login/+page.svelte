<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '#lib/design/Button.svelte';
  import PageSection from '#lib/design/PageSection.svelte';
  import Text from '#lib/design/Text.svelte';
  import Page from '#lib/home/Page.svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
  let sending = $state(false);
</script>

<svelte:head>
  <title>Stock admin login — Makeda Green Coffee</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Page>
  <PageSection headingId="admin-login-heading" level={1} title="Stock admin" prose>
    {#if data.linkInvalid}
      <Text>That link is no longer valid. Request a new one below.</Text>
    {/if}
    {#if form?.sent}
      <Text
        >If this email belongs to an admin, a login link is on its way. It works for 15 minutes.</Text
      >
    {:else}
      <form
        method="POST"
        class="login-form"
        use:enhance={() => {
          sending = true;
          return async ({ update }) => {
            try {
              await update();
            } finally {
              sending = false;
            }
          };
        }}
      >
        <label for="admin-email">Admin email</label>
        <input id="admin-email" name="email" type="email" autocomplete="email" required />
        <Button type="submit" loading={sending}>Email me a login link</Button>
      </form>
      {#if form?.message}
        <p role="alert">{form.message}</p>
      {/if}
    {/if}
  </PageSection>
</Page>

<style>
  .login-form {
    display: grid;
    gap: 12px;
    max-width: 28rem;
  }

  input {
    min-height: 48px;
    padding: 0 12px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    font: inherit;
    font-size: 16px;
  }
</style>
